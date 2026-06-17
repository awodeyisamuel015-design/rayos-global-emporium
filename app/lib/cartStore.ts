// app/lib/cartStore.ts

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const STORAGE_KEY = "rayos_cart_v2";

let cart: CartItem[] = [];
let listeners: Array<() => void> = [];

/* LOAD */
if (typeof window !== "undefined") {
  const data = localStorage.getItem(STORAGE_KEY);
  cart = data ? JSON.parse(data) : [];
}

/* SAVE */
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

/* EMIT */
function emit() {
  listeners.forEach((fn) => fn());
}

export const cartStore = {
  getAll: () => cart,

  // 🔥 FIX: correct function name usage everywhere
  getCartCount: () =>
    cart.reduce((sum, item) => sum + item.quantity, 0),

  addToCart: (product: Omit<CartItem, "quantity">) => {
    const existing = cart.find((p) => p.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    save();
    emit();
  },

  removeFromCart: (id: string) => {
    cart = cart.filter((p) => p.id !== id);
    save();
    emit();
  },

  clear: () => {
    cart = [];
    save();
    emit();
  },

  subscribe: (fn: () => void) => listeners.push(fn),

  unsubscribe: (fn: () => void) => {
    listeners = listeners.filter((l) => l !== fn);
  },
};