import { http, HttpResponse } from "msw";

export const productHandlers = [
  http.get("http://127.0.0.1:8000/products", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() ?? "";

    const products = [
      {
        id: 1,
        name: "Test Laptop",
        description: "Testing product",
        price: 59999,
        mrp: 69999,
        stock: 8,
        category: "Electronics",
        subcategory: "Laptops",
        image_url: "",
        rating: 4.5,
        reviews: 120,
        is_active: true,
      },
      {
        id: 2,
        name: "Test Headphones",
        description: "Testing audio product",
        price: 1999,
        mrp: 2999,
        stock: 25,
        category: "Electronics",
        subcategory: "Accessories",
        image_url: "",
        rating: 4.2,
        reviews: 80,
        is_active: true,
      },
    ];

    const filtered = search
      ? products.filter((product) =>
          product.name.toLowerCase().includes(search)
        )
      : products;

    return HttpResponse.json({
      items: filtered,
      total: filtered.length,
      page: 1,
      page_size: 20,
      has_next: false,
      has_previous: false,
    });
  }),
];
