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
let listeners: Function[] = [];

function loadProducts(): Product[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load products:", error);
    return [];
  }
}

function saveProducts() {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Failed to save products:", error);
  }
}

if (typeof window !== "undefined") {
  products = loadProducts();
}

function emit() {
  listeners.forEach((fn) => fn());
}

export const productStore = {
  getAll: () => products,

  getById: (id: string) =>
    products.find((product) => product.id === id),

  addProduct: (product: Product) => {
    products = [product, ...products];
    saveProducts();
    emit();
  },

  removeProduct: (id: string) => {
    products = products.filter((p) => p.id !== id);
    saveProducts();
    emit();
  },

  clear: () => {
    products = [];
    saveProducts();
    emit();
  },

  subscribe: (fn: Function) => {
    listeners.push(fn);
  },

  unsubscribe: (fn: Function) => {
    listeners = listeners.filter((l) => l !== fn);
  },
};