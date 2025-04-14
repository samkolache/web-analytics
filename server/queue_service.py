import json
import time
import pika
from config import QUEUE_NAME, logger
from storage import get_rabbitmq_connection, save_analysis_status

def enqueue_analysis_task(url, analysis_id, callback_url):
    """Enqueue a job to the RabbitMQ queue"""
    try:
        # Get RabbitMQ connection
        connection = get_rabbitmq_connection()
        if not connection:
            raise Exception("Could not connect to RabbitMQ")
        
        # Create a channel
        channel = connection.channel()
        
        # Declare the queue (creates if doesn't exist)
        channel.queue_declare(queue=QUEUE_NAME, durable=True)
        
        # Create message
        message = {
            "url": url,
            "analysis_id": analysis_id,
            "callback_url": callback_url,
            "timestamp": time.time()
        }
        
        # Publish message to queue
        channel.basic_publish(
            exchange='',
            routing_key=QUEUE_NAME,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Make message persistent
            )
        )
        
        # Update the analysis status
        save_analysis_status(analysis_id, {
            "status": "queued",
            "message": "Task queued for processing",
            "timestamp": time.time(),
            "url": url
        })
        
        # Close the connection
        connection.close()
        
        logger.info(f"Enqueued analysis task for URL: {url}, analysis ID: {analysis_id}")
        return analysis_id
    
    except Exception as e:
        logger.error(f"Error enqueueing task: {str(e)}")
        save_analysis_status(analysis_id, {
            "status": "failed",
            "error": f"Failed to enqueue task: {str(e)}",
            "timestamp": time.time(),
            "url": url
        })
        return False