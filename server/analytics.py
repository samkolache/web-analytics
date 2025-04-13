import time
import json
from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
import models
import storage
import queue_service
import config

router = APIRouter()

@router.post("/analyze-url")
async def analyze_website(request: UrlRequest, background_tasks: BackgroundTasks):
    """
    Trigger a website analysis and return an analysis ID
    
    The actual analysis will be processed in the background by a worker
    """
    if not request.url:
        raise HTTPException(status_code=400, detail="URL is required")
    
    # Validate URL format (basic validation)
    if not request.url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="URL must start with http:// or https://")
    
    # Generate a unique analysis ID
    analysis_id = f"analysis_{int(time.time() * 1000)}"
    
    # Store initial status
    save_analysis_status(analysis_id, {
        "url": request.url,
        "status": "pending",
        "timestamp": time.time()
    })
    
    # Enqueue the task
    callback_url = f"{API_BASE_URL}/api/analysis-complete"
    job_id = enqueue_analysis_task(request.url, analysis_id, callback_url)
    
    if not job_id:
        raise HTTPException(status_code=500, detail="Failed to enqueue analysis task")
    
    logger.info(f"Analysis started for URL: {request.url}, analysis ID: {analysis_id}")
    
    # Return the analysis ID immediately
    return {
        "analysisId": analysis_id,
        "status": "pending",
        "message": "Analysis queued. You can check status using the analysis ID."
    }

@router.post("/analysis-complete")
async def analysis_complete(request: Request):
    """
    Callback endpoint for n8n to send the final results
    """
    try:
        # Get the raw request body
        body_bytes = await request.body()
        raw_body = body_bytes.decode('utf-8')
        
        # Log the raw data for debugging
        logger.info(f"Received callback data: {raw_body}")
        
        # Parse the JSON data
        data = json.loads(raw_body)
        
        # Get the analysis ID
        analysis_id = data.get("analysisId")
        if not analysis_id:
            logger.error("Missing analysisId in callback data")
            return {"status": "error", "message": "Missing analysisId"}
        
        # Validate the data with our model
        try:
            # Create an AnalysisResult from the parsed data
            analysis_result = AnalysisResult(**data)
            
            # Save the results
            save_analysis_results(
                analysis_id, 
                analysis_result.model_dump(exclude={"analysisId"})
            )
            
            logger.info(f"Analysis complete for ID: {analysis_id}")
            return {"status": "ok"}
            
        except Exception as model_error:
            # Log the validation error
            logger.error(f"Error validating data: {str(model_error)}")
            
            # Still store the data but mark it with an error
            save_analysis_status(analysis_id, {
                "status": "error",
                "error": f"Data validation error: {str(model_error)}",
                "raw_data": data
            })
            
            return {"status": "error", "message": f"Data validation error: {str(model_error)}"}
    
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON body: {str(e)}")
        return {"status": "error", "message": f"Invalid JSON: {str(e)}"}
    
    except Exception as e:
        logger.exception(f"Unexpected error processing callback: {str(e)}")
        return {"status": "error", "message": f"Server error: {str(e)}"}

@router.get("/analysis-status/{analysis_id}")
async def get_analysis_status_endpoint(analysis_id: str):
    """
    Get the current status of an analysis
    """
    logger.info(f"Checking status for analysis ID: {analysis_id}")
    
    # Get the analysis status
    analysis = get_analysis_status(analysis_id)
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    logger.info(f"Analysis status: {analysis.get('status', 'unknown')}")
    
    # If complete, include the results
    if analysis.get("status") == "complete" and "results" in analysis:
        return {
            "analysisId": analysis_id,
            "status": "complete",
            "url": analysis.get("url", ""),
            **analysis["results"]
        }
    
    # If error, include the error details
    if analysis.get("status") == "error":
        return {
            "analysisId": analysis_id,
            "status": "error",
            "url": analysis.get("url", ""),
            "error": analysis.get("error", "Unknown error"),
            "timestamp": analysis.get("timestamp", time.time())
        }
    
    # Return the current status
    return {
        "analysisId": analysis_id,
        "status": analysis.get("status", "unknown"),
        "url": analysis.get("url", ""),
        "timestamp": analysis.get("timestamp", time.time()),
        "message": analysis.get("message", "")
    }

@router.get("/")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "ok", "message": "Website Performance Analyzer API is running"}