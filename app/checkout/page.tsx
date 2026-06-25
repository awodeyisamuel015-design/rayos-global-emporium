"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cartStore, type CartItem } from "../lib/cartStore";
import { supabase } from "../lib/supabase";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    setCartItems(cartStore.getAll());

    const update = () => {
      setCartItems(cartStore.getAll());
    };

    cartStore.subscribe(update);

    return () => {
      cartStore.unsubscribe(update);
    };
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = cartItems.length > 0 ? 2500 : 0;

  const total = subtotal + shipping;

  async function saveOrder() {
    const { data: orderData, error } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        phone: customerPhone,
        address: customerAddress,
        total,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      alert("Failed to save order");
      console.log(error);
      return;
    }

    const orderId = orderData.id;

    const items = cartItems.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    }));

    await supabase.from("order_items").insert(items);

    cartStore.clear();

    router.push("/orders");
  }

  const handleCheckout = () => {
    if (
      !customerName ||
      !customerPhone ||
      !customerAddress ||
      !customerEmail
    ) {
      alert("Fill all fields");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: customerEmail,
      amount: total * 100,

      callback: async () => {
        await saveOrder();
      },

      onClose: () => {
        alert("Payment cancelled");
      },
    });

    handler.openIframe();
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-10">
          Checkout
        </h1>

        <div className="bg-white/10 p-6 rounded-2xl space-y-4 mb-8">

          <input
            className="w-full p-3 rounded bg-white/10"
            placeholder="Full Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            className="w-full p-3 rounded bg-white/10"
            placeholder="Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />

          <input
            className="w-full p-3 rounded bg-white/10"
            placeholder="Phone Number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />

          <textarea
            className="w-full p-3 rounded bg-white/10"
            placeholder="Address"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
          />
        </div>

        <div className="bg-white/10 p-6 rounded-2xl mb-8">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b border-white/10 py-3"
            >
              <span>
                {item.name} x{item.quantity}
              </span>

              <span className="text-yellow-400">
                ₦{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white/10 p-6 rounded-2xl">

          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Shipping</span>
            <span>₦{shipping.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>

            <span className="text-yellow-400">
              ₦{total.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full mt-6 bg-green-500 py-3 rounded-xl font-bold"
          >
            Pay With Paystack
          </button>

        </div>
      </div>
    </main>
  );
}