from io import BytesIO
from unittest.mock import patch

from PIL import Image


def register(client, email="user@example.com", password="secret123"):
    response = client.post("/auth/register", json={"email": email, "password": password})
    assert response.status_code == 201
    return response.json()["access_token"]


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def make_image():
    image = Image.new("RGB", (1600, 900), "blue")
    stream = BytesIO()
    image.save(stream, format="PNG")
    stream.seek(0)
    return stream


def create_product(client, token, name="Laptop", price=1000, stock=5):
    response = client.post(
        "/products",
        headers=auth(token),
        json={"name": name, "description": "Test product", "price": price, "stock": stock},
    )
    assert response.status_code == 201
    return response.json()


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200


def test_register(client):
    assert register(client)


def test_duplicate_register(client):
    register(client)
    response = client.post("/auth/register", json={"email": "user@example.com", "password": "secret123"})
    assert response.status_code == 409


def test_login(client):
    register(client)
    response = client.post("/auth/login", json={"email": "user@example.com", "password": "secret123", "role": "user"})
    assert response.status_code == 200


def test_invalid_login(client):
    register(client)
    response = client.post("/auth/login", json={"email": "user@example.com", "password": "wrongpass", "role": "user"})
    assert response.status_code == 401


def test_product_requires_auth(client):
    response = client.post("/products", json={"name": "Phone", "price": 500, "stock": 3})
    assert response.status_code == 401


def test_create_product(client, fake_redis):
    token = register(client)
    assert create_product(client, token)["name"] == "Laptop"


def test_list_products_and_cache(client, fake_redis):
    token = register(client)
    create_product(client, token)
    assert client.get("/products").status_code == 200
    assert len(client.get("/products").json()) == 1


def test_get_product(client, fake_redis):
    token = register(client)
    product = create_product(client, token)
    response = client.get(f"/products/{product['id']}")
    assert response.status_code == 200


def test_product_update(client, fake_redis):
    token = register(client)
    product = create_product(client, token)
    response = client.put(f"/products/{product['id']}", headers=auth(token), json={"price": 900})
    assert response.status_code == 200
    assert response.json()["price"] == 900


def test_product_delete(client, fake_redis):
    token = register(client)
    product = create_product(client, token)
    assert client.delete(f"/products/{product['id']}", headers=auth(token)).status_code == 204


def test_product_image_upload(client, fake_redis):
    token = register(client)
    product = create_product(client, token)
    response = client.post(
        f"/products/{product['id']}/image",
        headers=auth(token),
        files={"file": ("photo.png", make_image(), "image/png")},
    )
    assert response.status_code == 200
    assert response.json()["image_filename"].endswith(".jpg")


def test_cart_add_and_read(client, fake_redis):
    token = register(client)
    product = create_product(client, token, stock=5)
    response = client.post("/cart/items", headers=auth(token), json={"product_id": product["id"], "quantity": 2})
    assert response.status_code == 200
    assert client.get("/cart", headers=auth(token)).json()["total_items"] == 2


def test_cart_rejects_excess_stock(client, fake_redis):
    token = register(client)
    product = create_product(client, token, stock=1)
    response = client.post("/cart/items", headers=auth(token), json={"product_id": product["id"], "quantity": 2})
    assert response.status_code == 400


def test_cart_clear(client, fake_redis):
    token = register(client)
    assert client.delete("/cart", headers=auth(token)).status_code == 204


def test_order_stock_validation(client, fake_redis):
    token = register(client)
    product = create_product(client, token, stock=1)
    response = client.post("/orders", headers=auth(token), json={"items": [{"product_id": product["id"], "quantity": 2}]})
    assert response.status_code == 400


def test_place_order_reduces_stock_and_queues_task(client, fake_redis):
    token = register(client)
    product = create_product(client, token, price=50, stock=5)
    with patch("app.main.send_order_confirmation.delay") as mocked:
        response = client.post("/orders", headers=auth(token), json={"items": [{"product_id": product["id"], "quantity": 2}]})
    assert response.status_code == 201
    assert response.json()["total_amount"] == 100
    assert client.get(f"/products/{product['id']}").json()["stock"] == 3
    mocked.assert_called_once()


def test_list_orders(client, fake_redis):
    token = register(client)
    product = create_product(client, token, price=20, stock=2)
    with patch("app.main.send_order_confirmation.delay"):
        client.post("/orders", headers=auth(token), json={"items": [{"product_id": product["id"], "quantity": 1}]})
    response = client.get("/orders", headers=auth(token))
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_websocket_echo_and_order_notification(client, fake_redis):
    token = register(client)
    product = create_product(client, token, price=20, stock=2)
    with patch("app.main.send_order_confirmation.delay"):
        with client.websocket_connect(f"/ws/orders?token={token}") as websocket:
            assert websocket.receive_json()["event"] == "connected"
            websocket.send_text("hello")
            assert websocket.receive_json()["event"] == "echo"
            response = client.post("/orders", headers=auth(token), json={"items": [{"product_id": product["id"], "quantity": 1}]})
            assert response.status_code == 201
            assert websocket.receive_json()["event"] == "order_status"


def test_order_status_update(client, fake_redis):
    token = register(client)
    product = create_product(client, token, stock=2)
    with patch("app.main.send_order_confirmation.delay"):
        order = client.post("/orders", headers=auth(token), json={"items": [{"product_id": product["id"], "quantity": 1}]}).json()
    response = client.patch(f"/orders/{order['id']}/status", headers=auth(token), params={"status": "SHIPPED"})
    assert response.status_code == 200
    assert response.json()["status"] == "SHIPPED"


def test_invalid_order_status(client, fake_redis):
    token = register(client)
    product = create_product(client, token)
    with patch("app.main.send_order_confirmation.delay"):
        order = client.post("/orders", headers=auth(token), json={"items": [{"product_id": product["id"], "quantity": 1}]}).json()
    response = client.patch(f"/orders/{order['id']}/status", headers=auth(token), params={"status": "INVALID"})
    assert response.status_code == 400
