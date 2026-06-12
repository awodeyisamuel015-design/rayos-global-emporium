import { create } from "zustand";
import type { Product } from "./cartStore";

type WishlistState = {
  wishlist: Product[];
  add: (p: Product) => void;
  remove: (id: string) => void;
};

export const useWishlistStore = create<WishlistState>((set) => ({
  wishlist: [],

  add: (product) =>
    set((state) => {
      const exists = state.wishlist.find((p) => p.id === product.id);
      if (exists) return state;
      return { wishlist: [...state.wishlist, product] };
    }),

  remove: (id) =>
    set((state) => ({
      wishlist: state.wishlist.filter((p) => p.id !== id),
    })),
}));