from celery import Celery
from app.config import settings
celery_app=Celery("shopflow",broker=settings.celery_broker_url,backend=settings.celery_result_backend)
@celery_app.task
def send_order_confirmation(email:str,order_id:int):
    print(f"Order confirmation queued for {email}: order #{order_id}")
    return True
