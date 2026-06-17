"use client";

import { useRouter } from "next/navigation";
import { cartStore } from "../lib/cartStore";
import { orderStore } from "../lib/orderStore";

export default function CheckoutButton() {
  const router = useRouter();

  const handleCheckout = () => {
    const items = cartStore.getAll();

    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    orderStore.createOrder(
      "Guest User",
      "0000000000",
      "Not Provided",
      items
    );

    cartStore.clear();

    router.push("/orders");
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full bg-green-500 text-white py-3 rounded-xl mt-4"
    >
      📦 Place Order
    </button>
  );
}