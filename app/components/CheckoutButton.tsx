"use client";

import { useRouter } from "next/navigation";
import { cartStore } from "@/app/cartstore";
import { orderStore } from "@/app/orderStore";

export default function CheckoutButton() {
  const router = useRouter();

  const handleCheckout = () => {
    const items = cartStore.getCart();

    if (items.length === 0) return;

    orderStore.createOrder(items);
    cartStore.clearCart();

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