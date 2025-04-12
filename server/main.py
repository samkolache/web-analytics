from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import httpx
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import Dict, Optional, Any
import time

# Load environment variables
load_dotenv()

# Get n8n webhook URL from environment variable
N8N_WEBHOOK_URL = "https://web-analytics.app.n8n.cloud/webhook-test/a836cf09-54a6-4d78-97c5-dfb04569c748"
API_BASE_URL = "http://localhost:8000"  # Base URL of your API

if not N8N_WEBHOOK_URL:
    raise ValueError("N8N_WEBHOOK_URL environment variable is not set")

# In-memory storage for analysis status and results
# In a production environment, this should be replaced with Redis or a similar solution
analysis_storage: Dict[str, Dict[str, Any]] = {}

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

class AnalysisResult(BaseModel):
    analysisId: str
    avgPerformanceScore: Optional[float] = None
    avgFirstContentfulPaint: Optional[float] = None
    avgSpeedIndex: Optional[float] = None
    avgLargestContentfulPaint: Optional[float] = None
    avgTimeToInteractive: Optional[float] = None
    avgAccessibility: Optional[float] = None
    avgBestPractices: Optional[float] = None
    avgSeo: Optional[float] = None
    avgTotalBlockingTime: Optional[float] = None
    avgInteractionToNextPaint: Optional[float] = None
    avgCumulativeLayoutShift: Optional[float] = None
    avgServerResponseTime: Optional[float] = None
    urlCount: Optional[int] = None

@app.post("/api/analyze-url")
async def analyze_website(request: UrlRequest, background_tasks: BackgroundTasks):
    """
    Trigger the n8n workflow to analyze a website and return an analysis ID
    """
    if not request.url:
        raise HTTPException(status_code=400, detail="URL is required")
    
    # Validate URL format (basic validation)
    if not request.url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="URL must start with http:// or https://")
    
    # Generate a unique analysis ID
    analysis_id = f"analysis_{int(time.time() * 1000)}"
    
    # Store initial status in memory
    analysis_storage[analysis_id] = {
        "url": request.url,
        "status": "processing",
        "timestamp": time.time()
    }
    
    # Start the analysis in the background
    background_tasks.add_task(start_analysis, request.url, analysis_id)
    
    # Return the analysis ID immediately
    return {
        "analysisId": analysis_id,
        "status": "processing",
        "message": "Analysis started. You can check status using the analysis ID."
    }

async def start_analysis(url: str, analysis_id: str):
    """Background task to start the n8n workflow"""
    try:
        # Send the URL and analysis ID to n8n webhook
        async with httpx.AsyncClient() as client:
            response = await client.post(
                N8N_WEBHOOK_URL,
                json={
                    "url": url, 
                    "analysisId": analysis_id,
                    "callbackUrl": f"{API_BASE_URL}/api/analysis-complete"
                },
                timeout=60  # Reduced timeout since we're just starting the process
            )
            
        if response.status_code != 200:
            # Update status to failed
            analysis_storage[analysis_id]["status"] = "failed"
            analysis_storage[analysis_id]["error"] = f"n8n workflow failed with status code: {response.status_code}"
    except Exception as e:
        # Update status to failed
        analysis_storage[analysis_id]["status"] = "failed"
        analysis_storage[analysis_id]["error"] = str(e)

@app.post("/api/analysis-complete")
async def analysis_complete(data: AnalysisResult):
    """
    Callback endpoint for n8n to send the final results
    """
    analysis_id = data.analysisId
    
    if analysis_id not in analysis_storage:
        # Create the entry if it doesn't exist
        analysis_storage[analysis_id] = {
            "status": "complete",
            "completedAt": time.time()
        }
    
    # Update with the results
    analysis_storage[analysis_id]["status"] = "complete"
    analysis_storage[analysis_id]["completedAt"] = time.time()
    analysis_storage[analysis_id]["results"] = data.dict(exclude={"analysisId"})
    
    return {"status": "ok"}

@app.get("/api/analysis-status/{analysis_id}")
async def get_analysis_status(analysis_id: str):
    """
    Get the current status of an analysis
    """
    if analysis_id not in analysis_storage:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    analysis = analysis_storage[analysis_id]
    
    # If complete, include the results
    if analysis.get("status") == "complete" and "results" in analysis:
        return {
            "analysisId": analysis_id,
            "status": "complete",
            "url": analysis.get("url", ""),
            **analysis["results"]
        }
    
    return {
        "analysisId": analysis_id,
        **analysis
    }

@app.get("/")
async def root():
    """
    Health check endpoint
    """
    return {"status": "ok", "message": "Website Performance Analyzer API is running"}