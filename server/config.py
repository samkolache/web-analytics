import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("web-analytics")

# N8N Configuration
N8N_WEBHOOK_URL = "https://web-analytics.app.n8n.cloud/webhook-test/a836cf09-54a6-4d78-97c5-dfb04569c748"

# API Configuration
API_BASE_URL = "https://69f8-172-103-80-49.ngrok-free.app"
# RabbitMQ Configuration
RABBITMQ_HOST = "localhost"
RABBITMQ_PORT = 5672
RABBITMQ_USER = "guest"
RABBITMQ_PASS = "guest"
RABBITMQ_VHOST = "/"

# Queue Configuration
QUEUE_NAME = "analytics"
STATE_EXCHANGE = "analysis_state"  # Exchange for storing analysis state
TASK_TIMEOUT = 600  # 10 minutes timeout for tasks

# CORS Configuration
CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]