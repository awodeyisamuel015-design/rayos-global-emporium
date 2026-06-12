"use client";

import { useEffect, useState } from "react";
import { orderStore, Order } from "../../lib/orderStore";


export default function AdminAnalytics() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const update = () => {
      setOrders([...orderStore.getAll()]);
    };

    update();
    orderStore.subscribe(update);

    return () => {
      orderStore.unsubscribe(update);
    };
  }, []);

  // 📊 METRICS
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.total,
    0
  );

  const totalItemsSold = orders.reduce(
    (sum, o) => sum + o.items.length,
    0
  );

  const avgOrderValue =
    totalOrders === 0
      ? 0
      : totalRevenue / totalOrders;

  const pendingOrders = orders.filter(
    (o) => o.status === "pending"
  ).length;

  const deliveredOrders = orders.filter(
    (o) => o.status === "delivered"
  ).length;

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl font-bold mb-8">
        📊 Admin Analytics Dashboard
      </h1>

      {/* STATS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="text-gray-400">Total Orders</h2>
          <p className="text-3xl font-bold">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="text-gray-400">Total Revenue</h2>
          <p className="text-3xl font-bold text-green-400">
            ₦{totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="text-gray-400">Items Sold</h2>
          <p className="text-3xl font-bold">
            {totalItemsSold}
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="text-gray-400">Average Order Value</h2>
          <p className="text-3xl font-bold text-yellow-400">
            ₦{avgOrderValue.toFixed(0)}
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="text-gray-400">Pending Orders</h2>
          <p className="text-3xl font-bold text-yellow-500">
            {pendingOrders}
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="text-gray-400">Delivered Orders</h2>
          <p className="text-3xl font-bold text-green-500">
            {deliveredOrders}
          </p>
        </div>

      </div>

      {/* ORDERS PREVIEW */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Recent Orders
        </h2>

        <div className="space-y-3">

          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="bg-white/10 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-bold">
                  {order.name}
                </p>

                <p className="text-sm text-gray-400">
                  {order.date}
                </p>
              </div>

              <div className="text-right">
                <p className="text-green-400 font-bold">
                  ₦{order.total.toLocaleString()}
                </p>

                <p
                  className={`text-sm ${
                    order.status === "delivered"
                      ? "text-green-400"
                      : order.status === "pending"
                      ? "text-yellow-400"
                      : order.status === "processing"
                      ? "text-blue-400"
                      : "text-red-400"
                  }`}
                >
                  {order.status}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>

    </main>
  );
}
