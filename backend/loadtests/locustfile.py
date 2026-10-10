from locust import HttpUser, task, between

class ShopFlowUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def list_products(self):
        self.client.get("/products?page=1&page_size=20", name="/products")

    @task(2)
    def categories(self):
        self.client.get("/categories", name="/categories")

    @task(1)
    def health(self):
        self.client.get("/health", name="/health")
