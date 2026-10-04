import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "./server";
import { getApiData } from "../utils/api";
import type { ProductPage } from "../types/api";

describe("Products API with MSW", () => {
  it("returns mocked product data without calling the real backend", async () => {
    const data = await getApiData<ProductPage>(
      "http://127.0.0.1:8000/products",
    );

    expect(data.items).toHaveLength(2);
    expect(data.items[0].name).toBe("Test Laptop");
    expect(data.items[1].name).toBe("Test Headphones");
  });

  it("supports mocked search behaviour", async () => {
    server.use(
      http.get("http://127.0.0.1:8000/products", ({ request }) => {
        const url = new URL(request.url);
        const search = url.searchParams.get("search");

        return HttpResponse.json({
          items:
            search === "laptop"
              ? [
                  {
                    id: 1,
                    name: "Test Laptop",
                    price: 59999,
                    stock: 8,
                    category: "Electronics",
                  },
                ]
              : [],
          total: search === "laptop" ? 1 : 0,
          page: 1,
          page_size: 20,
          has_next: false,
          has_previous: false,
        });
      }),
    );

    const data = await getApiData<ProductPage>(
      "http://127.0.0.1:8000/products",
      { search: "laptop" },
    );

    expect(data.items).toHaveLength(1);
    expect(data.items[0].name).toBe("Test Laptop");
  });
});
