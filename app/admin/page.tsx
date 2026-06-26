"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../components/ThemeToggle";
import { adminAuth } from "./adminAuth";
import { supabase } from "../lib/supabase";

type OrderItem = {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
};

export default function AdminDashboard() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setOrders((data as Order[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    if (!adminAuth.isLoggedIn()) {
      router.push("/admin/login");
      return;
    }

    loadOrders();
  }, [router]);

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const totalCustomers = new Set(
    orders.map((order) => order.phone)
  ).size;

  async function deleteOrder(id: string) {
    if (!confirm("Delete this order?")) return;

    await supabase
      .from("order_items")
      .delete()
      .eq("order_id", id);

    await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    loadOrders();
  }

  return (
    <main className="min-h-screen text-black dark:text-white p-6">

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">

        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <div className="flex gap-3">

          <ThemeToggle />

          <button
            onClick={() => router.push("/admin/products")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            📦 Products
          </button>

          <button
            onClick={() => router.push("/admin/orders")}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
          >
            📋 Orders
          </button>

          <button
            onClick={() => router.push("/admin/analytics")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            📊 Analytics
          </button>

          <button
            onClick={() => {
              adminAuth.logout();
              router.push("/admin/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white/10 rounded-xl p-6">
          <h3>Total Orders</h3>
          <p className="text-3xl font-bold">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-6">
          <h3>Revenue</h3>
          <p className="text-3xl font-bold text-green-500">
            ₦{totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-6">
          <h3>Customers</h3>
          <p className="text-3xl font-bold">
            {totalCustomers}
          </p>
        </div>

      </div>

      <h2 className="text-2xl font-bold mb-6">
        Recent Orders
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white/10 p-6 rounded-xl">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-5">

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/10 rounded-xl p-5"
            >

              <div className="flex justify-between">

                <div>
                  <h3 className="text-xl font-bold text-yellow-400">
                    {order.customer_name}
                  </h3>

                  <p>📞 {order.phone}</p>
                  <p>📍 {order.address}</p>

                  <p className="mt-2">
                    Status:
                    <span className="ml-2 font-semibold">
                      {order.status}
                    </span>
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-green-500 font-bold text-xl">
                    ₦{order.total.toLocaleString()}
                  </p>

                  <p className="text-xs">
                    {new Date(
                      order.created_at
                    ).toLocaleString()}
                  </p>

                </div>

              </div>

              <div className="mt-4">
                <p className="font-semibold mb-2">
                  Items
                </p>

                {order.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b border-white/10 py-2"
                  >
                    <span>
                      {item.product_name} × {item.quantity}
                    </span>

                    <span>
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => deleteOrder(order.id)}
                className="mt-5 bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete Order
              </button>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}