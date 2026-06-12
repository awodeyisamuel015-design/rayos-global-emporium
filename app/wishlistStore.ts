import type { Product } from "./cartstore";

const STORAGE_KEY = "rayos_wishlist";

let wishlist: Product[] = [];
let listeners: (() => void)[] = [];

// Load wishlist from localStorage
if (typeof window !== "undefined") {
  const savedWishlist = localStorage.getItem(STORAGE_KEY);

  if (savedWishlist) {
    wishlist = JSON.parse(savedWishlist);
  }
}

const saveWishlist = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(wishlist)
    );
  }
};

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const wishlistStore = {
  getAll: (): Product[] => {
    return wishlist;
  },

  add: (product: Product) => {
    const exists = wishlist.some(
      (item) => item.id === product.id
    );

    if (!exists) {
      wishlist.push(product);

      saveWishlist();
      notify();
    }
  },

  remove: (id: string) => {
    wishlist = wishlist.filter(
      (item) => item.id !== id
    );

    saveWishlist();
    notify();
  },

  clear: () => {
    wishlist = [];

    saveWishlist();
    notify();
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener);
  },

  unsubscribe: (listener: () => void) => {
    listeners = listeners.filter(
      (l) => l !== listener
    );
  },
};