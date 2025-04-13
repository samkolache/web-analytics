from pydantic import BaseModel, Field
from typing import Dict, Optional, Any

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

class AnalysisStatus(BaseModel):
    analysisId: str
    status: str
    url: Optional[str] = None
    timestamp: float
    completedAt: Optional[float] = None
    error: Optional[str] = None
    message: Optional[str] = None
    results: Optional[Dict[str, Any]] = None