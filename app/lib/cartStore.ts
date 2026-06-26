
// app/lib/cartStore.ts

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;

  quantity: number;

  color?: string;
  size?: string;
};

const STORAGE_KEY = "rayos_cart_v2";

let cart: CartItem[] = [];
let listeners: Array<() => void> = [];

/* LOAD CART */
if (typeof window !== "undefined") {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    cart = data ? JSON.parse(data) : [];
  } catch (err) {
    console.warn("Failed to load cart");
    cart = [];
  }
}

/* SAVE CART */
function save() {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.warn("Cart save failed");
  }
}

/* EMIT CHANGES */
function emit() {
  listeners.forEach((fn) => fn());
}

export const cartStore = {
  /* GET ALL ITEMS */
  getAll: (): CartItem[] => cart,

  /* TOTAL ITEMS */
  getCartCount: (): number =>
    cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    ),

  /* ADD ITEM */
  addToCart: (product: CartItem) => {
    const existing = cart.find(
      (p) =>
        p.id === product.id &&
        p.color === product.color &&
        p.size === product.size
    );

    if (existing) {
      existing.quantity += product.quantity || 1;
    } else {
      cart.push({
        ...product,
        quantity: product.quantity || 1,
      });
    }

    save();
    emit();
  },

  /* REMOVE ITEM */
  removeFromCart: (id: string) => {
    cart = cart.filter((p) => p.id !== id);

    save();
    emit();
  },

  /* CLEAR CART */
  clear: () => {
    cart = [];

    save();
    emit();
  },

  /* SUBSCRIBE */
  subscribe: (fn: () => void) => {
    listeners.push(fn);
  },

  /* UNSUBSCRIBE */
  unsubscribe: (fn: () => void) => {
    listeners = listeners.filter(
      (listener) => listener !== fn
    );
  },
};
