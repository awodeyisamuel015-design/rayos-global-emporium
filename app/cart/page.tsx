"use client";

import { useEffect, useState } from "react";
import { cartStore, Product } from "@/app/cartstore";

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>([]);

  const load = () => {
    setCart([...cartStore.getCart()]);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="p-6 min-h-screen bg-black text-white">

      <h1 className="text-2xl font-bold mb-4">Cart</h1>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        cart.map((item, i) => (
          <div
            key={i}
            className="flex justify-between bg-white/10 p-3 mb-2 rounded"
          >
            <div>
              <h3>{item.name}</h3>
              <p>₦{item.price}</p>
            </div>

            <button
              onClick={() => {
                cartStore.removeFromCart(i);
                load();
              }}
              className="text-red-400"
            >
              Remove
            </button>
          </div>
        ))
      )}

    </main>
  );
}