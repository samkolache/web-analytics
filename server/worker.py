import os
import sys
import json
import logging
import pika
import time

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("worker")

from config import RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASS, RABBITMQ_VHOST, QUEUE_NAME
from n8n_service import process_url_with_n8n
from storage import save_analysis_status

def callback(ch, method, properties, body):
    """Process a message from the queue"""
    try:
        logger.info("Received message from queue")
        
        # Parse the message
        message = json.loads(body)
        url = message.get('url')
        analysis_id = message.get('analysis_id')
        callback_url = message.get('callback_url')
        
        if not all([url, analysis_id, callback_url]):
            logger.error("Invalid message format")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return
        
        logger.info(f"Processing analysis for URL: {url}, ID: {analysis_id}")
        
        # Update status
        save_analysis_status(analysis_id, {
            "status": "processing",
            "message": "Starting analysis...",
            "timestamp": time.time()
        })
        
        # Process the URL with n8n
        result = process_url_with_n8n(url, analysis_id, callback_url)
        
        # Acknowledge the message
        ch.basic_ack(delivery_tag=method.delivery_tag)
        
        if result:
            logger.info(f"Successfully processed analysis {analysis_id}")
        else:
            logger.error(f"Failed to process analysis {analysis_id}")
            
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        # Still acknowledge to prevent redelivery of problematic messages
        ch.basic_ack(delivery_tag=method.delivery_tag)

def main():
    """Main worker function"""
    try:
        # Connect to RabbitMQ
        credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
        parameters = pika.ConnectionParameters(
            host=RABBITMQ_HOST,
            port=RABBITMQ_PORT,
            virtual_host=RABBITMQ_VHOST,
            credentials=credentials,
            heartbeat=600,
            blocked_connection_timeout=300
        )
        
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()
        
        # Declare the queue
        channel.queue_declare(queue=QUEUE_NAME, durable=True)
        
        # Configure prefetch (how many messages to fetch at once)
        channel.basic_qos(prefetch_count=1)
        
        # Set up the consumer
        channel.basic_consume(
            queue=QUEUE_NAME,
            on_message_callback=callback
        )
        
        logger.info(f"Worker started, listening for messages on queue: {QUEUE_NAME}")
        
        # Start consuming messages
        channel.start_consuming()
        
    except KeyboardInterrupt:
        logger.info("Worker stopped by user")
        if 'connection' in locals() and connection:
            connection.close()
    except Exception as e:
        logger.error(f"Worker error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()