
"use client";

import { useRouter } from "next/navigation";
import { cartStore } from "../cartstore";
import { orderStore } from "../lib/orderStore";

export default function CheckoutButton() {
  const router = useRouter();

  const handleCheckout = () => {
    const items = cartStore.getCart();

    // Prevent empty checkout
    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    // Create order (NO missing variables anymore)
    orderStore.createOrder(
      "Guest User",
      "0000000000",
      "Not Provided",
      items
    );

    // Clear cart only ONCE
    cartStore.clear();

    // Redirect to orders page
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