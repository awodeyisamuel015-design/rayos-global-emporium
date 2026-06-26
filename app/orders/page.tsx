"use client";

import { useEffect, useState } from "react";
import { orderStore, type Order } from "../lib/orderStore";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(orderStore.getAll());

    const updateOrders = () => {
      setOrders(orderStore.getAll());
    };

    orderStore.subscribe(updateOrders);

    return () => {
      orderStore.unsubscribe(updateOrders);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        📦 Order History
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">
          No orders yet
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/10 border border-white/10 rounded-2xl p-4"
            >
              <div className="flex justify-between mb-3">
                <h2 className="font-semibold">
                  Order #{order.id}
                </h2>

                <span className="text-gray-400 text-sm">
                  {order.date}
                </span>
              </div>

              <div className="mb-3">
                <p>
                  <strong>Name:</strong> {order.name}
                </p>

                <p>
                  <strong>Phone:</strong> {order.phone}
                </p>

                <p>
                  <strong>Address:</strong> {order.address}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-yellow-400">
                    {order.status}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm border-b border-white/5 pb-2"
                  >
                    <span>{item.name}</span>

                    <span>
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 font-bold text-yellow-400">
                Total: ₦{order.total.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}