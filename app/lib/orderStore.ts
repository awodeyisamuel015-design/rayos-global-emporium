
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

const STORAGE_KEY = "rayos_orders_v2";

let orders: Order[] = [];
let listeners: Function[] = [];

/* ---------------- LOAD ---------------- */
function load(): Order[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load orders:", err);

    return [];
  }
}

/* ---------------- SAVE ---------------- */
function save() {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(orders)
    );
  } catch (err) {
    console.error("Failed to save orders:", err);
  }
}

/* ---------------- INIT ---------------- */
if (typeof window !== "undefined") {
  orders = load();
}

/* ---------------- EMIT ---------------- */
function emit() {
  listeners.forEach((fn) => fn());
}

/* ---------------- STORE ---------------- */
export const orderStore = {
  /* GET ALL ORDERS */
  getAll: (): Order[] => orders,

  /* CREATE ORDER */
  createOrder: (
    name: string,
    phone: string,
    address: string,
    items: Product[],
    status: OrderStatus = "pending"
  ) => {
    const total = items.reduce(
      (sum, item) => sum + item.price,
      0
    );

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

  /* UPDATE STATUS */
  updateOrderStatus: (
    id: string,
    status: OrderStatus
  ) => {
    orders = orders.map((order) =>
      order.id === id
        ? { ...order, status }
        : order
    );

    save();
    emit();
  },

  /* DELETE ORDER */
  deleteOrder: (id: string) => {
    orders = orders.filter(
      (order) => order.id !== id
    );

    save();
    emit();
  },

  /* CLEAR ALL ORDERS */
  clear: () => {
    orders = [];

    save();
    emit();
  },

  /* SUBSCRIBE */
  subscribe: (fn: Function) => {
    listeners.push(fn);
  },

  /* UNSUBSCRIBE */
  unsubscribe: (fn: Function) => {
    listeners = listeners.filter(
      (listener) => listener !== fn
    );
  },
};