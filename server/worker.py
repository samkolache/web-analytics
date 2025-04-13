import os
import sys
from rq import Worker, Queue, Connection
import logging
import redis
import config

# Add the parent directory to the path so we can import our modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import configuration
from config import REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_PASSWORD, QUEUE_NAME

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("worker")

# Create Redis connection
redis_conn = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=REDIS_DB,
    password=REDIS_PASSWORD
)

def main():
    """
    Start the worker process
    """
    logger.info(f"Starting worker for queue: {QUEUE_NAME}")
    
    try:
        with Connection(redis_conn):
            queue = Queue(QUEUE_NAME)
            # Enable automatic job failure handling
            worker = Worker([queue], exception_handlers=None)
            
            # Start the worker
            worker.work()
    
    except Exception as e:
        logger.error(f"Worker error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()