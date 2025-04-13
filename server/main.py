from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import analytics
import config
import storage

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events handler for startup and shutdown events"""
    # Startup logic
    logger.info("Starting Website Performance Analyzer API")
    
    # Check Redis connection
    redis_status = get_redis_status()
    if redis_status:
        logger.info("Connected to Redis successfully")
    else:
        logger.warning("Failed to connect to Redis - falling back to in-memory storage")
    
    yield
    
    # Shutdown logic
    logger.info("Shutting down Website Performance Analyzer API")

# Create FastAPI app with lifespan handler
app = FastAPI(
    title="Website Performance Analyzer API",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analytics.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)