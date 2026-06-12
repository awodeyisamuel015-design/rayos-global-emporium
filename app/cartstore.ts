export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
};

const STORAGE_KEY = "rayos_cart_v2";

let cart: Product[] = [];

function load() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function save() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

if (typeof window !== "undefined") {
  cart = load();
}

let listeners: Function[] = [];

function emit() {
  listeners.forEach((l) => l());
}

export const cartStore = {
  getCart: () => cart,

  addToCart: (product: Product) => {
    cart.push(product);
    save();
    emit();
  },

  removeFromCart: (id: string) => {
    cart = cart.filter((item) => item.id !== id);
    save();
    emit();
  },

  clear: () => {
    cart = [];
    save();
    emit();
  },

  subscribe: (fn: Function) => listeners.push(fn),

  unsubscribe: (fn: Function) => {
    listeners = listeners.filter((l) => l !== fn);
  },
};