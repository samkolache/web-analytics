from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import analytics
import config
from config import logger, CORS_ORIGINS
from storage import get_rabbitmq_status

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events handler for startup and shutdown events"""
    # Startup logic
    logger.info("Starting Website Performance Analyzer API")
    
    # Check RabbitMQ connection
    rabbitmq_status = get_rabbitmq_status()
    if rabbitmq_status:
        logger.info("Connected to RabbitMQ successfully")
    else:
        logger.warning("Failed to connect to RabbitMQ - system may not function correctly")
    
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