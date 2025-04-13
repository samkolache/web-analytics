import time
from rq import Queue
from rq.job import Job
from config import QUEUE_NAME, TASK_TIMEOUT, logger
import storage
import n8n_service
# Create RQ queue with our Redis connection
task_queue = Queue(QUEUE_NAME, connection=redis_client, default_timeout=TASK_TIMEOUT)

def enqueue_analysis_task(url: str, analysis_id: str, callback_url: str):
    """
    Enqueue a task to process a URL with n8n
    
    Args:
        url: The website URL to analyze
        analysis_id: Unique identifier for this analysis
        callback_url: URL to call when analysis is complete
    
    Returns:
        str: Job ID of the queued task
    """
    try:
        # Import the worker function here to avoid circular imports
        from .n8n_service import process_url_with_n8n
        
        # Create and enqueue the job
        job = task_queue.enqueue(
            process_url_with_n8n,
            url,
            analysis_id,
            callback_url,
            job_id=f"analysis:{analysis_id}",
            result_ttl=86400,  # Keep results for 1 day
            failure_ttl=86400  # Keep failed jobs for 1 day
        )
        
        # Update the analysis status
        save_analysis_status(analysis_id, {
            "status": "queued",
            "message": "Task queued for processing",
            "job_id": job.id,
            "timestamp": time.time()
        })
        
        logger.info(f"Enqueued analysis task for URL: {url}, analysis ID: {analysis_id}")
        return job.id
    
    except Exception as e:
        logger.error(f"Error enqueueing task: {str(e)}")
        # Update the analysis status
        save_analysis_status(analysis_id, {
            "status": "failed",
            "error": f"Failed to enqueue task: {str(e)}",
            "timestamp": time.time()
        })
        return None

def get_job_status(job_id: str):
    """
    Get the status of a job in the queue
    
    Args:
        job_id: The job ID to check
        
    Returns:
        dict: Job status information
    """
    try:
        job = Job.fetch(job_id, connection=redis_client)
        status = job.get_status()
        
        result = {
            "status": status,
            "enqueued_at": job.enqueued_at.timestamp() if job.enqueued_at else None,
            "started_at": job.started_at.timestamp() if job.started_at else None,
            "ended_at": job.ended_at.timestamp() if job.ended_at else None,
        }
        
        if status == "failed" and job.exc_info:
            result["error"] = job.exc_info
            
        return result
    
    except Exception as e:
        logger.error(f"Error getting job status: {str(e)}")
        return {"status": "unknown", "error": str(e)}