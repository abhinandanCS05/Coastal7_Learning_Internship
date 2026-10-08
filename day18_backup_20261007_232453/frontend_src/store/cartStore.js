import { create } from "zustand";

export const useCartStore = create((set) => ({
  cartCount: 0,
  isCartOpen: false,

  setCartCount: (count) =>
    set({
      cartCount: count,
    }),

  incrementCart: (quantity = 1) =>
    set((state) => ({
      cartCount: state.cartCount + quantity,
    })),

  decrementCart: (quantity = 1) =>
    set((state) => ({
      cartCount: Math.max(0, state.cartCount - quantity),
    })),

  openCart: () =>
    set({
      isCartOpen: true,
    }),

  closeCart: () =>
    set({
      isCartOpen: false,
    }),

  resetCart: () =>
    set({
      cartCount: 0,
      isCartOpen: false,
    }),
}));
