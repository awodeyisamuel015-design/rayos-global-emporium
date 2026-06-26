"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type OrderItem = {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  image: string;
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

export default function AdminOrdersPage() {
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
      console.log(error);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(
    id: string,
    status: string
  ) {
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    loadOrders();
  }

  async function deleteOrder(id: string) {
    const confirmed = window.confirm(
      "Delete this order?"
    );

    if (!confirmed) return;

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
    <main className="min-h-screen bg-gray-100 dark:bg-black dark:text-white p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            📦 Admin Orders
          </h1>

          <div className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-xl">
            Total Orders: {orders.length}
          </div>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-10 text-center">
            No orders yet
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6"
              >

                <div className="flex justify-between mb-6">
                  <div>
                    <h2 className="font-bold text-xl">
                      Order #{order.id}
                    </h2>

                    <p className="text-gray-500">
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full">
                    {order.status}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold mb-2">
                    Customer
                  </h3>

                  <p>
                    <strong>Name:</strong>{" "}
                    {order.customer_name}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.phone}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {order.address}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold mb-2">
                    Ordered Items
                  </h3>

                  <div className="space-y-2">

                    {order.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"
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
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4">

                  <div className="text-green-600 text-xl font-bold">
                    Total: ₦
                    {order.total.toLocaleString()}
                  </div>

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          "pending"
                        )
                      }
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                    >
                      Pending
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          "processing"
                        )
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Processing
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          "delivered"
                        )
                      }
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delivered
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          "cancelled"
                        )
                      }
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Cancelled
                    </button>

                    <button
                      onClick={() =>
                        deleteOrder(order.id)
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
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