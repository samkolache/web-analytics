# Keep Redis for state storage, add RabbitMQ for queue
import pika
import json

def get_rabbitmq_connection():
    """Create a RabbitMQ connection"""
    try:
        credentials = pika.PlainCredentials(
            config.RABBITMQ_USER, 
            config.RABBITMQ_PASS
        )
        parameters = pika.ConnectionParameters(
            host=config.RABBITMQ_HOST,
            port=config.RABBITMQ_PORT,
            virtual_host=config.RABBITMQ_VHOST,
            credentials=credentials
        )
        return pika.BlockingConnection(parameters)
    except Exception as e:
        logger.error(f"RabbitMQ connection error: {str(e)}")
        return None