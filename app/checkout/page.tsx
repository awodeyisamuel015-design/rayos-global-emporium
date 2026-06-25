"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePaystackPayment } from "react-paystack";
import { v4 as uuidv4 } from "uuid";

import { cartStore, type CartItem } from "../lib/cartStore";
import { supabase } from "../lib/supabase";

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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = cartItems.length > 0 ? 2500 : 0;
  const total = subtotal + shipping;

  const config = {
    reference: uuidv4(),
    email: customerEmail,
    amount: total * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  };

  const initializePayment = usePaystackPayment(config);

  const saveOrder = async () => {
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
      console.error(error);
      alert("Failed to save order");
      return;
    }

    const orderId = orderData.id;

    const items = cartItems.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    await supabase.from("order_items").insert(items);

    cartStore.clear();

    router.push("/orders");
  };

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

    initializePayment({
      onSuccess: async () => {
        await saveOrder();
      },

      onClose: () => {
        alert("Payment cancelled");
      },
    });
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-10">
          Checkout
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-400">
            Your cart is empty
          </p>
        ) : (
          <>
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
                  className="flex justify-between border-b border-white/10 py-2"
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
          </>
        )}
      </div>
    </main>
  );
}