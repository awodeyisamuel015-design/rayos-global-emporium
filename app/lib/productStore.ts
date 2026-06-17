export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
};

const STORAGE_KEY = "rayos_products";

let products: Product[] = [];
let listeners: Array<() => void> = [];

/* SAFE LOAD */
function loadProducts(): Product[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.warn("Failed to load products:", err);
    return [];
  }
}

/* SAFE SAVE */
function saveProducts() {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.warn("Storage quota exceeded:", err);
  }
}

/* INIT */
if (typeof window !== "undefined") {
  products = loadProducts();
}

/* EMIT UPDATES */
function emit() {
  listeners.forEach((fn) => fn());
}

export const productStore = {
  /* GET ALL PRODUCTS */
  getAll: (): Product[] => products,

  /* GET SINGLE PRODUCT */
  getById: (id: string): Product | undefined =>
    products.find((p) => p.id === id),

  /* ADD PRODUCT */
  addProduct: (product: Product) => {
    products = [product, ...products];
    saveProducts();
    emit();
  },

  /* REMOVE PRODUCT */
  removeProduct: (id: string) => {
    products = products.filter((p) => p.id !== id);
    saveProducts();
    emit();
  },

  /* CLEAR ALL */
  clear: () => {
    products = [];
    saveProducts();
    emit();
  },

  /* SUBSCRIBE */
  subscribe: (fn: () => void) => {
    listeners.push(fn);
  },

  /* UNSUBSCRIBE */
  unsubscribe: (fn: () => void) => {
    listeners = listeners.filter((l) => l !== fn);
  },
};