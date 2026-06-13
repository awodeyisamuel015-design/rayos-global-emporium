export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  name: string;
  phone: string;
  address: string;
  items: Product[];
  total: number;
  date: string;
  status: OrderStatus;
};

const STORAGE_KEY = "rayos_orders_v3";

let orders: Order[] = [];
let listeners: Function[] = [];

/* LOAD */
function load(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/* SAVE */
function save() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

/* INIT */
if (typeof window !== "undefined") {
  orders = load();
}

/* EMIT */
function emit() {
  listeners.forEach((fn) => fn());
}

export const orderStore = {
  getAll: () => orders,

  createOrder: (
    name: string,
    phone: string,
    address: string,
    items: Product[],
    status: OrderStatus = "pending"
  ) => {
    const total = items.reduce((sum, i) => sum + i.price, 0);

    const newOrder: Order = {
      id: Date.now().toString(),
      name,
      phone,
      address,
      items,
      total,
      date: new Date().toLocaleString(),
      status,
    };

    orders.unshift(newOrder);
    save();
    emit();
  },

  updateOrderStatus: (id: string, status: OrderStatus) => {
    orders = orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    save();
    emit();
  },

  deleteOrder: (id: string) => {
    orders = orders.filter((o) => o.id !== id);
    save();
    emit();
  },

  clear: () => {
    orders = [];
    save();
    emit();
  },

  subscribe: (fn: Function) => {
    listeners.push(fn);
  },

  unsubscribe: (fn: Function) => {
    listeners = listeners.filter((l) => l !== fn);
  },
};