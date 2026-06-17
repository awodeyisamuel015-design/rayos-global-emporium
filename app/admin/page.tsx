"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { adminAuth } from "./adminAuth";
import { orderStore, type Order } from "../lib/orderStore";

import ThemeToggle from "../components/ThemeToggle";

export default function AdminDashboard() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Protect admin route
    if (!adminAuth.isLoggedIn()) {
      router.push("/admin/login");
      return;
    }

    const loadOrders = () => {
      setOrders([...orderStore.getAll()]);
    };

    // initial load
    loadOrders();

    // subscribe to changes
    orderStore.subscribe(loadOrders);

    return () => {
      orderStore.unsubscribe(loadOrders);
    };
  }, [router]);

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );

  const totalCustomers = new Set(
    orders.map((order) => order.phone)
  ).size;

  const deleteOrder = (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    orderStore.deleteOrder(id);
  };

  return (
    <main className="min-h-screen text-black dark:text-white transition-colors duration-300 p-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">

        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <div className="flex gap-3 items-center">
          <ThemeToggle />

          <button
            onClick={() => router.push("/admin/products")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
          >
            📦 Products
          </button>

          <button
            onClick={() => router.push("/admin/analytics")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold"
          >
            📊 Analytics
          </button>

          <button
            onClick={() => {
              adminAuth.logout();
              router.push("/admin/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>

      </div>

      {/* SUMMARY */}
      <div className="grid sm:grid-cols-3 gap-6 mb-10">

        <div className="p-6 bg-white/10 rounded-xl">
          <h3>Total Orders</h3>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>

        <div className="p-6 bg-white/10 rounded-xl">
          <h3>Revenue</h3>
          <p className="text-3xl font-bold text-green-500">
            ₦{Number(totalRevenue || 0).toLocaleString()}
          </p>
        </div>

        <div className="p-6 bg-white/10 rounded-xl">
          <h3>Customers</h3>
          <p className="text-3xl font-bold">{totalCustomers}</p>
        </div>

      </div>

      {/* ORDERS LIST */}
      <h2 className="text-2xl font-bold mb-6">
        Recent Orders
      </h2>

      {orders.length === 0 ? (
        <div className="p-6 text-center opacity-60 bg-white/10 rounded-xl">
          No orders yet 😴
        </div>
      ) : (
        <div className="space-y-5">

          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 bg-white/10 rounded-xl"
            >

              {/* TOP SECTION */}
              <div className="flex flex-col lg:flex-row justify-between gap-4">

                <div>
                  <h3 className="text-yellow-400 font-bold text-lg">
                    {order.name}
                  </h3>

                  <p>📞 {order.phone}</p>
                  <p>📍 {order.address}</p>
                </div>

                <div className="text-left lg:text-right">
                  <p className="text-green-500 font-bold text-xl">
                    ₦{Number(order.total || 0).toLocaleString()}
                  </p>

                  <p className="text-xs opacity-60">
                    {order.date}
                  </p>
                </div>

              </div>

              {/* ITEMS */}
              <div className="mt-4">
                <p className="font-semibold mb-2">
                  Items:
                </p>

                <ul className="text-sm opacity-80 space-y-1">
                  {order.items?.map((item, i) => (
                    <li key={i}>
                      • {item.name} — ₦
                      {Number(item.price || 0).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>

              {/* DELETE BUTTON 🔥 */}
              <button
                onClick={() => deleteOrder(order.id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                🗑 Delete Order
              </button>

            </div>
          ))}

        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-12 text-center text-sm opacity-60">
        © 2024 Rayos Global Emporium
      </footer>

    </main>
  );
}