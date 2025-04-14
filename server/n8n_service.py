import httpx
import time
from tenacity import retry, stop_after_attempt, wait_exponential
import config
from config import logger, N8N_WEBHOOK_URL
from storage import save_analysis_status

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
async def call_n8n(url: str, analysis_id: str, callback_url: str):
    """
    Call the n8n webhook to start the website analysis
    
    Args:
        url: Website URL to analyze
        analysis_id: Unique identifier for this analysis
        callback_url: URL to call when analysis is complete
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Update status to indicate processing is starting
        save_analysis_status(analysis_id, {
            "status": "processing",
            "message": "Starting n8n workflow...",
            "timestamp": time.time()
        })
        
        logger.info(f"Calling n8n webhook for URL: {url}, analysis ID: {analysis_id}")
        
        # Call the n8n webhook
        async with httpx.AsyncClient() as client:
            response = await client.post(
                N8N_WEBHOOK_URL,
                json={
                    "url": url,
                    "analysisId": analysis_id,
                    "callbackUrl": callback_url
                },
                timeout=120  # 2 minute timeout
            )
        
        # Check the response
        if response.status_code == 200:
            logger.info(f"n8n webhook called successfully for analysis ID: {analysis_id}")
            save_analysis_status(analysis_id, {
                "status": "processing",
                "message": "n8n workflow started successfully"
            })
            return True
        else:
            logger.error(f"n8n webhook returned error {response.status_code}: {response.text}")
            save_analysis_status(analysis_id, {
                "status": "failed",
                "error": f"n8n workflow failed with status code: {response.status_code}",
                "message": response.text
            })
            return False
    
    except Exception as e:
        logger.error(f"Error calling n8n webhook: {str(e)}")
        save_analysis_status(analysis_id, {
            "status": "failed",
            "error": f"Error calling n8n webhook: {str(e)}"
        })
        return False

def process_url_with_n8n(url: str, analysis_id: str, callback_url: str):
    """
    Function to be executed by the worker to process a URL with n8n
    
    This is a synchronous function that will be called by the RQ worker
    
    Args:
        url: Website URL to analyze
        analysis_id: Unique identifier for this analysis
        callback_url: URL to call when analysis is complete
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        import asyncio
        
        # Create a new event loop for the async operations
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        # Run the async function in the loop
        result = loop.run_until_complete(call_n8n(url, analysis_id, callback_url))
        
        # Close the loop
        loop.close()
        
        return result
    
    except Exception as e:
        logger.error(f"Error in worker process: {str(e)}")
        save_analysis_status(analysis_id, {
            "status": "failed",
            "error": f"Error in worker process: {str(e)}"
        })
        return False