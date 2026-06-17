// app/lib/wishlistStore.ts

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
};

const STORAGE_KEY = "rayos_wishlist_v1";

let wishlist: WishlistItem[] = [];
let listeners: Array<() => void> = [];

if (typeof window !== "undefined") {
  const data = localStorage.getItem(STORAGE_KEY);
  wishlist = data ? JSON.parse(data) : [];
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
}

function emit() {
  listeners.forEach((fn) => fn());
}

export const wishlistStore = {
  getAll: () => wishlist,

  add: (product: WishlistItem) => {
    const exists = wishlist.find((p) => p.id === product.id);

    if (!exists) {
      wishlist.push(product);
      save();
      emit();
    }
  },

  remove: (id: string) => {
    wishlist = wishlist.filter((p) => p.id !== id);
    save();
    emit();
  },

  clear: () => {
    wishlist = [];
    save();
    emit();
  },

  subscribe: (fn: () => void) => listeners.push(fn),

  unsubscribe: (fn: () => void) => {
    listeners = listeners.filter((l) => l !== fn);
  },
};