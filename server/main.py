from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get n8n webhook URL from environment variable
N8N_WEBHOOK_URL = "https://web-analytics.app.n8n.cloud/webhook-test/a836cf09-54a6-4d78-97c5-dfb04569c748"
if not N8N_WEBHOOK_URL:
    raise ValueError("N8N_WEBHOOK_URL environment variable is not set")

app = FastAPI(title="Website Performance Analyzer API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UrlRequest(BaseModel):
    url: str

@app.post("/api/analyze-url")
async def analyze_website(request: UrlRequest):
    """
    Trigger the n8n workflow to analyze a website and return performance metrics
    """
    if not request.url:
        raise HTTPException(status_code=400, detail="URL is required")
    
    # Validate URL format (basic validation)
    if not request.url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="URL must start with http:// or https://")
    
    try:
        # Send the URL to n8n webhook
        async with httpx.AsyncClient() as client:
            response = await client.post(
                N8N_WEBHOOK_URL,
                json={"url": request.url},
                timeout=3600  # Increase timeout as website analysis can take time
            )
            
        if response.status_code != 200:
            raise HTTPException(
                status_code=500, 
                detail=f"n8n workflow failed with status code: {response.status_code}"
            )
            
        # Return the response from n8n (MongoDB aggregation results)
        return response.json()
        
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504, 
            detail="Analysis timed out. The website may be too large or slow to respond."
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error connecting to n8n: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Unexpected error: {str(e)}"
        )

@app.get("/")
async def root():
    """
    Health check endpoint
    """
    return {"status": "ok", "message": "Website Performance Analyzer API is running"}