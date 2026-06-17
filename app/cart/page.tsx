
"use client";

import { useEffect, useState } from "react";
import { cartStore, type Product } from "../lib/cartStore";

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>([]);

  const load = () => {
    setCart([...cartStore.getCart()]);
  };

  useEffect(() => {
    load();

    cartStore.subscribe(load);

    return () => {
      cartStore.unsubscribe(load);
    };
  }, []);

  const handleRemove = (id: string) => {
    cartStore.removeFromCart(id);
    load();
  };

  const handleClear = () => {
    cartStore.clear();
    load();
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        🛒 Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white/10 p-4 rounded-xl"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {item.name}
                </h3>

                <p>
                  ₦{item.price.toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleRemove(item.id)}
                className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 text-xl font-bold">
            Total: ₦{total.toLocaleString()}
          </div>

          <button
            onClick={handleClear}
            className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400"
          >
            Clear Cart
          </button>
        </div>
      )}
    </main>
  );
}