import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ProductCard from "./ProductCard";
import type { Product } from "../types/api";

const product: Product = {
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
  badge: "Best Seller",
};

describe("ProductCard", () => {
  it("renders product information", () => {
    render(<ProductCard product={product} />);

    expect(screen.getByTestId("product-name")).toHaveTextContent(
      "Test Laptop",
    );

    expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/59,999/i)).toBeInTheDocument();
    expect(screen.getByTestId("product-badge")).toHaveTextContent(
      "Best Seller",
    );
  });

  it("shows the low-stock indicator", () => {
    render(<ProductCard product={product} />);

    expect(screen.getByTestId("low-stock")).toHaveTextContent("Only 8 left");
  });

  it("calls the add-to-cart callback when the user clicks the button", async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();

    render(
      <ProductCard
        product={product}
        onAddToCart={onAddToCart}
      />,
    );

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(product);
  });

  it("supports wishlist interaction", async () => {
    const user = userEvent.setup();
    const onToggleWishlist = vi.fn();

    render(
      <ProductCard
        product={product}
        onToggleWishlist={onToggleWishlist}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /add to wishlist/i }),
    );

    expect(onToggleWishlist).toHaveBeenCalledTimes(1);
    expect(onToggleWishlist).toHaveBeenCalledWith(product);
  });

  it("disables cart action for an out-of-stock product", () => {
    const outOfStockProduct: Product = {
      ...product,
      stock: 0,
    };

    render(
      <ProductCard
        product={outOfStockProduct}
        onAddToCart={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /out of stock/i }),
    ).toBeDisabled();
  });
});
