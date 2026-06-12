"use client";

import { useEffect, useState } from "react";
import {
  orderStore,
  type Order,
} from "../../lib/orderStore";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = () => {
    setOrders([...orderStore.getAll()]);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = (
    id: string,
    status: Order["status"]
  ) => {
    orderStore.updateStatus(id, status);
    loadOrders();
  };

  const deleteOrder = (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    orderStore.deleteOrder(id);
    loadOrders();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            📦 Admin Orders
          </h1>

          <div className="bg-black text-white px-4 py-2 rounded-xl">
            Total Orders: {orders.length}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-500 text-lg">
              No orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow p-6"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">

                  <div>
                    <h2 className="font-bold text-xl">
                      Order #{order.id}
                    </h2>

                    <p className="text-gray-500">
                      {order.date}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                </div>

                {/* Customer Details */}
                <div className="mb-6">
                  <h3 className="font-bold mb-2">
                    👤 Customer Details
                  </h3>

                  <p>
                    <strong>Name:</strong>{" "}
                    {order.customerName}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.customerPhone}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {order.customerAddress}
                  </p>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h3 className="font-bold mb-2">
                    🛍 Ordered Items
                  </h3>

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between border-b pb-2"
                      >
                        <span>
                          {item.name}
                        </span>

                        <span>
                          ₦{item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                  <div className="text-xl font-bold text-green-600">
                    Total: ₦
                    {order.total.toLocaleString()}
                  </div>

                  <div className="flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          "Pending"
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                      Pending
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          "Processing"
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Processing
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          "Delivered"
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600"
                    >
                      Delivered
                    </button>

                    <button
                      onClick={() =>
                        deleteOrder(order.id)
                      }
                      className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
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