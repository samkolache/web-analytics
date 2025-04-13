import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("web-analytics")

# N8N Configuration
N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "https://web-analytics.app.n8n.cloud/webhook-test/a836cf09-54a6-4d78-97c5-dfb04569c748")

# API Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")

# Redis Configuration
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_DB = int(os.getenv("REDIS_DB", "0"))

# Queue Configuration
QUEUE_NAME = os.getenv("QUEUE_NAME", "analytics")
TASK_TIMEOUT = int(os.getenv("TASK_TIMEOUT", "600"))  # 10 minutes timeout for tasks

# CORS Configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")