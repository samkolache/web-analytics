import json
import pika
import time
from config import RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASS, RABBITMQ_VHOST, STATE_EXCHANGE, logger

# In-memory cache for quick lookups (optional)
_analysis_cache = {}

def get_rabbitmq_connection():
    """Create a RabbitMQ connection"""
    try:
        credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
        parameters = pika.ConnectionParameters(
            host=RABBITMQ_HOST,
            port=RABBITMQ_PORT,
            virtual_host=RABBITMQ_VHOST,
            credentials=credentials
        )
        connection = pika.BlockingConnection(parameters)
        return connection
    except Exception as e:
        logger.error(f"RabbitMQ connection error: {str(e)}")
        return None

def get_rabbitmq_status():
    """Check RabbitMQ connection"""
    try:
        connection = get_rabbitmq_connection()
        if connection:
            connection.close()
            return True
        return False
    except Exception:
        return False

def save_analysis_status(analysis_id, status_data):
    """Save analysis status to RabbitMQ"""
    try:
        # Also update local cache
        if analysis_id in _analysis_cache:
            _analysis_cache[analysis_id].update(status_data)
        else:
            _analysis_cache[analysis_id] = status_data
            
        # Get RabbitMQ connection
        connection = get_rabbitmq_connection()
        if not connection:
            raise Exception("Could not connect to RabbitMQ")
            
        # Create a channel
        channel = connection.channel()
        
        # Declare exchange for state storage
        channel.exchange_declare(
            exchange=STATE_EXCHANGE,
            exchange_type='direct',
            durable=True
        )
        
        # Format the message
        message = json.dumps(status_data)
        
        # Publish state update
        channel.basic_publish(
            exchange=STATE_EXCHANGE,
            routing_key=analysis_id,
            body=message,
            properties=pika.BasicProperties(
                delivery_mode=2,  # Make message persistent
                content_type='application/json'
            )
        )
        
        # Close the connection
        connection.close()
        return True
    except Exception as e:
        logger.error(f"Error saving analysis status: {str(e)}")
        return False

def get_analysis_status(analysis_id):
    """Get analysis status from RabbitMQ"""
    try:
        # Check cache first for faster response
        if analysis_id in _analysis_cache:
            return _analysis_cache[analysis_id]
            
        # Get RabbitMQ connection
        connection = get_rabbitmq_connection()
        if not connection:
            raise Exception("Could not connect to RabbitMQ")
            
        # Create a channel
        channel = connection.channel()
        
        # Declare exchange
        channel.exchange_declare(
            exchange=STATE_EXCHANGE,
            exchange_type='direct',
            durable=True
        )
        
        # Declare a temporary queue
        result = channel.queue_declare(queue='', exclusive=True)
        queue_name = result.method.queue
        
        # Bind the queue to the exchange
        channel.queue_bind(
            exchange=STATE_EXCHANGE,
            queue=queue_name,
            routing_key=analysis_id
        )
        
        # Get the latest message
        method_frame, header_frame, body = channel.basic_get(queue=queue_name, auto_ack=True)
        
        # Close the connection
        connection.close()
        
        if method_frame:
            # Message found
            data = json.loads(body)
            _analysis_cache[analysis_id] = data  # Update cache
            return data
        else:
            # No message found
            return None
    except Exception as e:
        logger.error(f"Error getting analysis status: {str(e)}")
        return None

def save_analysis_results(analysis_id, results):
    """Save analysis results"""
    try:
        # Get current status
        current_status = get_analysis_status(analysis_id) or {}
        
        # Update with results and mark as complete
        updated_status = {
            **current_status,
            "status": "complete",
            "results": results,
            "completedAt": time.time()
        }
        
        # Save the updated status
        return save_analysis_status(analysis_id, updated_status)
    except Exception as e:
        logger.error(f"Error saving analysis results: {str(e)}")
        return False