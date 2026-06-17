"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cartStore, type CartItem } from "../lib/cartStore";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);

  const load = () => {
    setCart([...cartStore.getAll()]);
  };

  useEffect(() => {
    load();

    cartStore.subscribe(load);

    return () => {
      cartStore.unsubscribe(load);
    };
  }, []);

  const removeItem = (id: string) => {
    cartStore.removeFromCart(id);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[360px] bg-black text-white shadow-2xl z-50 transform transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h2 className="text-lg font-bold">Your Cart 🛒</h2>

        <button
          onClick={onClose}
          className="text-white text-xl hover:text-red-400"
        >
          ✕
        </button>
      </div>

      {/* ITEMS */}
      <div className="p-4 space-y-3 overflow-y-auto h-[75%]">
        {cart.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">
            Your cart is empty
          </p>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white/10 p-3 rounded-lg"
            >
              <div>
                <h3 className="font-semibold text-sm">
                  {item.name}
                </h3>

                <p className="text-yellow-400 text-sm">
                  ₦{item.price.toLocaleString()}
                </p>

                <p className="text-xs text-gray-400">
                  Qty: {item.quantity}
                </p>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 text-sm hover:text-red-500"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/10 bg-black">
        <div className="flex justify-between mb-3">
          <span className="text-gray-400">Total</span>

          <span className="text-yellow-400 font-bold">
            ₦{total.toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => {
            onClose();
            router.push("/checkout");
          }}
          className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}