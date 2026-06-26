 
"use client";

import { useEffect, useState } from "react";
import { getOrders, type Order } from "../lib/orderStore";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        Loading orders...
      </main>
    );
  }

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
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="mb-3">
                <p>
                  <strong>Name:</strong> {order.customer_name}
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

              <div className="mt-4 font-bold text-yellow-400">
                Total: ₦{Number(order.total).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
