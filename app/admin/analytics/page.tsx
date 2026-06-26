"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
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

export default function AdminAnalytics() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
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
    loadOrders();
  }, []);

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const totalItemsSold = orders.reduce(
    (sum, order) =>
      sum +
      (order.order_items?.reduce(
        (s, item) => s + item.quantity,
        0
      ) || 0),
    0
  );

  const avgOrderValue =
    totalOrders === 0 ? 0 : totalRevenue / totalOrders;

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

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
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
              <h2 className="text-gray-400">
                Average Order Value
              </h2>
              <p className="text-3xl font-bold text-yellow-400">
                ₦{avgOrderValue.toFixed(0)}
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-xl">
              <h2 className="text-gray-400">
                Pending Orders
              </h2>
              <p className="text-3xl font-bold text-yellow-400">
                {pendingOrders}
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-xl">
              <h2 className="text-gray-400">
                Delivered Orders
              </h2>
              <p className="text-3xl font-bold text-green-400">
                {deliveredOrders}
              </p>
            </div>

          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">
              Recent Orders
            </h2>

            <div className="space-y-3">

              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="bg-white/10 p-4 rounded-lg flex justify-between"
                >

                  <div>
                    <p className="font-bold">
                      {order.customer_name}
                    </p>

                    <p className="text-sm text-gray-400">
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
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
        </>
      )}
    </main>
  );
}