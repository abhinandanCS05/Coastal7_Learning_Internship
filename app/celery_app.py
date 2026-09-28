from celery import Celery

from app.config import settings

celery_app = Celery(
    "ecommerce",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    task_track_started=True,
)


@celery_app.task(name="send_order_confirmation")
def send_order_confirmation(order_id: int, email: str, total: float) -> str:
    message = (
        f"[EMAIL] Order confirmation for {email}: "
        f"order_id={order_id}, total={total:.2f}"
    )
    print(message)
    return f"confirmation-sent:{order_id}"
