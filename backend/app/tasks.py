import csv
import io
import os
from datetime import datetime
from pathlib import Path

from celery import states
from celery.exceptions import Ignore
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from .celery_app import celery_app


def _progress(task, current, total, message):
    percent = int((current / total) * 100) if total else 0

    task.update_state(
        state="PROGRESS",
        meta={
            "current": current,
            "total": total,
            "percent": percent,
            "message": message,
        },
    )


@celery_app.task(bind=True, name="shopflow.generate_invoice")
def generate_invoice(self, order_id: int, order_data: dict):
    try:
        self.update_state(
            state="STARTED",
            meta={
                "current": 0,
                "total": 3,
                "percent": 0,
                "message": "Preparing invoice...",
            },
        )

        invoice_dir = Path(
            os.getenv("INVOICE_DIR", "invoices")
        )
        invoice_dir.mkdir(parents=True, exist_ok=True)

        _progress(self, 1, 3, "Creating PDF document...")

        filename = f"invoice_order_{order_id}.pdf"
        output = invoice_dir / filename

        pdf = canvas.Canvas(str(output), pagesize=A4)
        width, height = A4

        y = height - 60

        pdf.setFont("Helvetica-Bold", 20)
        pdf.drawString(50, y, "ShopFlow")
        y -= 30

        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(50, y, f"Invoice #{order_id}")
        y -= 30

        pdf.setFont("Helvetica", 10)
        pdf.drawString(
            50,
            y,
            f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        )

        y -= 40

        customer = order_data.get("customer", {})
        pdf.drawString(
            50,
            y,
            f"Customer: {customer.get('name', 'Customer')}",
        )

        y -= 20

        pdf.drawString(
            50,
            y,
            f"Payment: {order_data.get('payment_method', 'N/A')}",
        )

        y -= 35

        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(50, y, "Product")
        pdf.drawString(330, y, "Qty")
        pdf.drawString(390, y, "Price")
        pdf.drawString(470, y, "Total")

        y -= 20

        pdf.setFont("Helvetica", 9)

        for item in order_data.get("items", []):
            if y < 80:
                pdf.showPage()
                y = height - 60

            name = str(item.get("name", ""))[:42]
            qty = int(item.get("quantity", 0))
            price = float(item.get("unit_price", 0))
            line_total = float(item.get("line_total", qty * price))

            pdf.drawString(50, y, name)
            pdf.drawString(335, y, str(qty))
            pdf.drawString(390, y, f"Rs {price:.2f}")
            pdf.drawString(470, y, f"Rs {line_total:.2f}")

            y -= 18

        y -= 15

        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(
            390,
            y,
            f"Total: Rs {float(order_data.get('total', 0)):.2f}",
        )

        _progress(self, 2, 3, "Writing invoice file...")

        pdf.save()

        _progress(self, 3, 3, "Invoice completed.")

        return {
            "order_id": order_id,
            "filename": filename,
            "path": str(output),
            "download_url": f"/invoices/{filename}",
            "status": "completed",
        }

    except Exception as exc:
        self.update_state(
            state=states.FAILURE,
            meta={
                "error": str(exc),
                "message": "Invoice generation failed.",
            },
        )
        raise


@celery_app.task(bind=True, name="shopflow.bulk_product_import")
def bulk_product_import(self, rows: list[dict]):
    from .database import SessionLocal
    from .models import Product

    db = SessionLocal()

    created = 0
    skipped = 0
    total = len(rows)

    try:
        if total == 0:
            return {
                "created": 0,
                "skipped": 0,
                "total": 0,
                "status": "completed",
            }

        for index, row in enumerate(rows, start=1):
            try:
                name = str(row.get("name", "")).strip()

                if not name:
                    skipped += 1
                    _progress(
                        self,
                        index,
                        total,
                        f"Skipped row {index}: missing name",
                    )
                    continue

                product = Product(
                    name=name,
                    description=str(row.get("description", "")),
                    category=str(row.get("category", "General")),
                    subcategory=str(row.get("subcategory", "General")),
                    price=float(row.get("price", 0)),
                    mrp=float(row.get("mrp", row.get("price", 0))),
                    stock=int(row.get("stock", 0)),
                    image_url=str(row.get("image_url", "")),
                    badge=str(row.get("badge", "")),
                    offer_text=str(row.get("offer_text", "")),
                    rating=float(row.get("rating", 4.2)),
                    reviews=int(row.get("reviews", 0)),
                    is_active=True,
                )

                db.add(product)
                created += 1

            except Exception:
                skipped += 1

            if index % 5 == 0 or index == total:
                db.commit()

            _progress(
                self,
                index,
                total,
                f"Processed {index} of {total} products",
            )

        db.commit()

        return {
            "created": created,
            "skipped": skipped,
            "total": total,
            "status": "completed",
        }

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


@celery_app.task(bind=True, name="shopflow.demo_background_job")
def demo_background_job(self, steps: int = 10):
    steps = max(1, min(int(steps), 50))

    for current in range(1, steps + 1):
        import time

        time.sleep(0.2)

        _progress(
            self,
            current,
            steps,
            f"Background processing {current}/{steps}",
        )

    return {
        "status": "completed",
        "message": "Background job completed successfully.",
        "steps": steps,
    }