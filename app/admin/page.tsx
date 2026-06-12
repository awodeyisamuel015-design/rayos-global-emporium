"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { adminAuth } from "./adminAuth";
import { orderStore } from "../lib/orderStore";

import ThemeToggle from "../components/ThemeToggle";

export default function AdminDashboard() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!adminAuth.isLoggedIn()) {
      router.push("/admin/login");
      return;
    }

    const loadOrders = () => {
      setOrders([...orderStore.getAll()]);
    };

    loadOrders();

    orderStore.subscribe(loadOrders);

    return () => {
      orderStore.unsubscribe(loadOrders);
    };
  }, [router]);

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const totalCustomers = new Set(
    orders.map((order) => order.phone)
  ).size;

  return (
    <main
      className="
        min-h-screen
        text-black dark:text-white
        transition-colors duration-300
        p-6
      "
    >
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">

        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <div className="flex flex-wrap gap-3 items-center">

          <ThemeToggle />

          <button
            onClick={() => router.push("/admin/products")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            📦 Products
          </button>

          <button
            onClick={() => router.push("/admin/analytics")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            📊 Analytics
          </button>

          <button
            onClick={() => {
              adminAuth.logout();
              router.push("/admin/login");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>

        </div>
      </div>

      {/* WELCOME */}
      <div className="glass-card p-6 mb-8">

        <h2 className="text-2xl font-bold mb-2">
          Welcome Admin 👋
        </h2>

        <p className="opacity-70">
          Manage products, track orders, and monitor your business performance.
        </p>

      </div>

      {/* SUMMARY */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

        <div className="glass-card p-6">
          <h3 className="opacity-70">
            Total Orders
          </h3>

          <p className="text-4xl font-bold mt-2">
            {totalOrders}
          </p>
        </div>

        <div className="glass-card p-6">
          <h3 className="opacity-70">
            Revenue
          </h3>

          <p className="text-4xl font-bold text-green-500 mt-2">
            ₦{totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="glass-card p-6">
          <h3 className="opacity-70">
            Customers
          </h3>

          <p className="text-4xl font-bold mt-2">
            {totalCustomers}
          </p>
        </div>

      </div>

      {/* RECENT ORDERS */}
      <div>

        <h2 className="text-2xl font-bold mb-6">
          Recent Orders
        </h2>

        {orders.length === 0 ? (
          <div className="glass-card p-8 text-center opacity-70">
            No orders yet 😴
          </div>
        ) : (
          <div className="space-y-4">

            {orders.map((order) => (
              <div
                key={order.id}
                className="glass-card p-5"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">

                  <div>

                    <h3 className="text-yellow-500 font-bold text-lg">
                      {order.name}
                    </h3>

                    <p>
                      📞 {order.phone}
                    </p>

                    <p>
                      📍 {order.address}
                    </p>

                  </div>

                  <div className="text-left lg:text-right">

                    <p className="text-green-500 font-bold text-xl">
                      ₦{order.total.toLocaleString()}
                    </p>

                    <p className="opacity-60 text-sm">
                      {order.date}
                    </p>

                  </div>

                </div>

                {/* ORDER ITEMS */}
                <div className="mt-4">

                  <p className="font-semibold mb-2">
                    Items Ordered:
                  </p>

                  <ul className="space-y-1 opacity-80">

                    {order.items?.map(
                      (
                        item: any,
                        index: number
                      ) => (
                        <li key={index}>
                          • {item.name} — ₦
                          {item.price.toLocaleString()}
                        </li>
                      )
                    )}

                  </ul>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="mt-12 text-center opacity-60 text-sm">
        © Since 2024 Rayos Global Emporium. All rights reserved.
      </footer>

    </main>
  );
}
