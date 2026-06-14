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

/* LOAD PRODUCTS */
function loadProducts(): Product[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load products:", error);

    return [];
  }
}

/* SAVE PRODUCTS */
function saveProducts() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(products)
    );
  } catch (error) {
    console.error(
      "Failed to save products. Storage quota exceeded:",
      error
    );

    alert(
      "Unable to save products. Your browser storage is full. Please reduce image sizes or clear old products."
    );
  }
}

/* INITIALIZE */
if (typeof window !== "undefined") {
  products = loadProducts();
}

/* NOTIFY SUBSCRIBERS */
function emit() {
  listeners.forEach((fn) => fn());
}

export const productStore = {
  getAll(): Product[] {
    return products;
  },

  getById(id: string): Product | undefined {
    return products.find(
      (product) => product.id === id
    );
  },

  addProduct(product: Product) {
    products = [product, ...products];

    saveProducts();
    emit();
  },

  removeProduct(id: string) {
    products = products.filter(
      (product) => product.id !== id
    );

    saveProducts();
    emit();
  },

  clear() {
    products = [];

    saveProducts();
    emit();
  },

  subscribe(fn: () => void) {
    listeners.push(fn);
  },

  unsubscribe(fn: () => void) {
    listeners = listeners.filter(
      (listener) => listener !== fn
    );
  },
};
