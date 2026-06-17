"use client";

import { useEffect, useState } from "react";
import { cartStore, Product } from "../lib/cartStore";
import { orderStore } from "../lib/orderStore";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  useEffect(() => {
    setCartItems(cartStore.getCart());
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shipping = cartItems.length > 0 ? 2500 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!customerName || !customerPhone || !customerAddress) {
      alert("Please fill in all customer details.");
      return;
    }

    const phoneNumber = "2347045999736";

    const orderDetails = cartItems
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} - ₦${item.price.toLocaleString()}`
      )
      .join("\n");

    const message = `
🛍️ NEW ORDER - RAYOS GLOBAL EMPORIUM

Customer Details:
Name: ${customerName}
Phone: ${customerPhone}
Address: ${customerAddress}

Items:
${orderDetails}

Subtotal: ₦${subtotal.toLocaleString()}
Shipping: ₦${shipping.toLocaleString()}
Total: ₦${total.toLocaleString()}
`;

    // SAVE ORDER (FIXED)
    orderStore.createOrder(
      customerName,
      customerPhone,
      customerAddress,
      cartItems
    );

    // CLEAR CART
    cartStore.clear();
    setCartItems([]);

    // OPEN WHATSAPP
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-10">
          Luxury Checkout
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-400">
            Your cart is empty
          </p>
        ) : (
          <>
            {/* CUSTOMER FORM */}
            <div className="bg-white/10 p-6 rounded-2xl space-y-4 mb-8">

              <input
                className="w-full p-3 rounded bg-white/10"
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
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

            {/* SUMMARY */}
            <div className="bg-white/10 p-6 rounded-2xl mb-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b border-white/10 py-2"
                >
                  <span>{item.name}</span>
                  <span className="text-yellow-400">
                    ₦{item.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="bg-white/10 p-6 rounded-2xl">
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-yellow-400 font-bold">
                  ₦{total.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-green-500 py-3 rounded-xl font-bold"
              >
                Place Order via WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}