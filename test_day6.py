import requests

BASE = "http://127.0.0.1:8000"
username, password = "abhi_day6", "SecurePass123"

r = requests.post(f"{BASE}/register", json={"username": username, "password": password})
print("REGISTER:", r.status_code, r.json())

r = requests.post(f"{BASE}/login", data={"username": username, "password": password})
print("LOGIN:", r.status_code)
tokens = r.json()
headers = {"Authorization": f"Bearer {tokens['access_token']}"}

print("ME:", requests.get(f"{BASE}/me", headers=headers).status_code)
print("PRODUCTS:", requests.get(f"{BASE}/products", headers=headers).status_code)

r = requests.post(
    f"{BASE}/products",
    json={"name": "Monitor", "price": 12000},
    headers=headers,
)
print("NORMAL USER CREATE PRODUCT (expected 403):", r.status_code)

r = requests.post(f"{BASE}/refresh", json={"refresh_token": tokens["refresh_token"]})
print("REFRESH:", r.status_code)
