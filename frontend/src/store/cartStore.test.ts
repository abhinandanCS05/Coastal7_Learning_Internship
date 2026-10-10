import { describe, expect, it, beforeEach } from "vitest";
import { useCartStore } from "./cartStore";

describe("Zustand Cart Store", () => {
  beforeEach(() => {
    useCartStore.setState({
      cartCount: 0,
      isCartOpen: false,
    });
  });

  it("starts with an empty cart count", () => {
    expect(useCartStore.getState().cartCount).toBe(0);
  });

  it("updates the cart count", () => {
    useCartStore.getState().setCartCount(3);

    expect(useCartStore.getState().cartCount).toBe(3);
  });

  it("opens the cart", () => {
    useCartStore.getState().openCart();

    expect(useCartStore.getState().isCartOpen).toBe(true);
  });

  it("closes the cart", () => {
    useCartStore.getState().openCart();
    useCartStore.getState().closeCart();

    expect(useCartStore.getState().isCartOpen).toBe(false);
  });

  it("can reopen the cart after closing it", () => {
    useCartStore.getState().openCart();
    useCartStore.getState().closeCart();
    useCartStore.getState().openCart();

    expect(useCartStore.getState().isCartOpen).toBe(true);
  });

  it("resets cart UI state", () => {
    useCartStore.setState({
      cartCount: 5,
      isCartOpen: true,
    });

    useCartStore.getState().resetCart();

    expect(useCartStore.getState().cartCount).toBe(0);
    expect(useCartStore.getState().isCartOpen).toBe(false);
  });
});
