import json
import time
import redis
from typing import Dict, Any, Optional
import config
from config import logger  # Import logger from config

# In-memory storage for analysis status and results
# In a production environment, this should be replaced with Redis or a similar solution
analysis_storage: Dict[str, Dict[str, Any]] = {}

# Initialize Redis connection
redis_client = redis.Redis(
    host=config.REDIS_HOST,
    port=config.REDIS_PORT,
    db=config.REDIS_DB,
    decode_responses=True
)

def get_redis_status():
    """Check if Redis connection is working"""
    try:
        redis_client.ping()
        return True
    except redis.ConnectionError:
        logger.error("Redis connection failed")
        return False
    except Exception as e:
        logger.error(f"Redis error: {str(e)}")
        return False

def save_analysis_status(analysis_id: str, status_data: Dict[str, Any]):
    """Save analysis status to both Redis and in-memory storage"""
    try:
        # Update in-memory storage
        if analysis_id not in analysis_storage:
            analysis_storage[analysis_id] = {}
        
        analysis_storage[analysis_id].update(status_data)
        
        # Update Redis storage - convert all values to strings for Redis storage
        redis_data = {k: json.dumps(v) if isinstance(v, (dict, list)) else str(v) 
                      for k, v in status_data.items()}
        
        redis_client.hset(f"analysis:{analysis_id}", mapping=redis_data)
        
        # Set a TTL for Redis entries (30 days)
        redis_client.expire(f"analysis:{analysis_id}", 60 * 60 * 24 * 30)
        
        logger.debug(f"Saved status for analysis {analysis_id}")
        return True
    except Exception as e:
        logger.error(f"Error saving analysis status: {str(e)}")
        return False

def get_analysis_status(analysis_id: str) -> Optional[Dict[str, Any]]:
    """Get analysis status from Redis first, then in-memory storage"""
    try:
        # Try to get from Redis first
        redis_data = redis_client.hgetall(f"analysis:{analysis_id}")
        
        if redis_data:
            # Convert string values back to Python objects when needed
            parsed_data = {}
            for k, v in redis_data.items():
                try:
                    parsed_data[k] = json.loads(v)
                except (json.JSONDecodeError, TypeError):
                    parsed_data[k] = v
            
            # Merge with in-memory data (Redis data takes precedence)
            memory_data = analysis_storage.get(analysis_id, {})
            result = {**memory_data, **parsed_data}
            return result
        
        # Fall back to in-memory storage
        elif analysis_id in analysis_storage:
            return analysis_storage[analysis_id]
        
        return None
    except Exception as e:
        logger.error(f"Error getting analysis status: {str(e)}")
        # Fall back to in-memory storage in case of Redis errors
        if analysis_id in analysis_storage:
            return analysis_storage[analysis_id]
        return None

def save_analysis_results(analysis_id: str, results: Dict[str, Any]):
    """Save analysis results to both Redis and in-memory storage"""
    try:
        # Get current status
        analysis = get_analysis_status(analysis_id) or {}
        
        # Update with results
        update_data = {
            "status": "complete",
            "completedAt": time.time(),
            "results": results
        }
        
        # Save the updated status
        save_analysis_status(analysis_id, update_data)
        
        logger.info(f"Saved results for analysis {analysis_id}")
        return True
    except Exception as e:
        logger.error(f"Error saving analysis results: {str(e)}")
        return False