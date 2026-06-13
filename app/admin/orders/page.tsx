"use client";

import { useEffect, useState } from "react";
import {
  orderStore,
  type Order,
  type OrderStatus,
} from "../../lib/orderStore";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = () => {
    setOrders([...orderStore.getAll()]);
  };

  useEffect(() => {
    loadOrders();

    orderStore.subscribe(loadOrders);

    return () => {
      orderStore.unsubscribe(loadOrders);
    };
  }, []);

  // ✅ SINGLE CLEAN FUNCTION (ONLY ONE!)
  const updateStatus = (
    id: string,
    status: OrderStatus
  ) => {
    orderStore.updateOrderStatus(id, status);
    loadOrders();
  };

  const deleteOrder = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    orderStore.deleteOrder(id);
    loadOrders();
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-black dark:text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">
            📦 Admin Orders
          </h1>

          <div className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded-xl font-semibold">
            Total Orders: {orders.length}
          </div>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-10 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6"
              >

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">

                  <div>
                    <h2 className="font-bold text-xl">
                      Order #{order.id}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      {order.date}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>

                </div>

                {/* CUSTOMER */}
                <div className="mb-6">
                  <h3 className="font-bold mb-2">
                    👤 Customer Details
                  </h3>

                  <p><strong>Name:</strong> {order.name}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                </div>

                {/* ITEMS */}
                <div className="mb-6">
                  <h3 className="font-bold mb-2">
                    🛍 Ordered Items
                  </h3>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"
                      >
                        <span>{item.name}</span>
                        <span>₦{item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                  <div className="text-xl font-bold text-green-600">
                    Total: ₦{order.total.toLocaleString()}
                  </div>

                  <div className="flex flex-wrap gap-3">

                    <button
                      onClick={() => updateStatus(order.id, "pending")}
                      className="px-4 py-2 rounded-xl bg-yellow-500 text-white"
                    >
                      Pending
                    </button>

                    <button
                      onClick={() => updateStatus(order.id, "processing")}
                      className="px-4 py-2 rounded-xl bg-blue-500 text-white"
                    >
                      Processing
                    </button>

                    <button
                      onClick={() => updateStatus(order.id, "delivered")}
                      className="px-4 py-2 rounded-xl bg-green-500 text-white"
                    >
                      Delivered
                    </button>

                    <button
                      onClick={() => updateStatus(order.id, "cancelled")}
                      className="px-4 py-2 rounded-xl bg-gray-500 text-white"
                    >
                      Cancelled
                    </button>

                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="px-4 py-2 rounded-xl bg-red-500 text-white"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}