"use client";

import { useParams } from "next/navigation";
import { productStore } from "../../lib/productStore";
import { cartStore } from "../../lib/cartStore";
import { wishlistStore } from "../../lib/wishlistStore";

export default function ProductPage() {
  const params = useParams();

  const product = productStore.getById(params.id as string);

  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Product Not Found 😢
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">

      {/* 🔥 SIDE BY SIDE FIX */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* IMAGE */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-xl"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-5">

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-yellow-400 text-3xl font-bold">
            ₦{Number(product.price || 0).toLocaleString()}
          </p>

          <p className="text-gray-300">
            {product.description}
          </p>

          <p className="text-gray-400 capitalize">
            Category: {product.category}
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 mt-6">

            <button
              onClick={() =>
                cartStore.addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
              className="bg-yellow-400 text-black py-3 rounded-xl font-bold"
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={() =>
                wishlistStore.add({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                })
              }
              className="bg-pink-500 text-white py-3 rounded-xl font-bold"
            >
              ❤️ Add to Wishlist
            </button>

            <button
              className="bg-green-500 text-white py-3 rounded-xl font-bold"
            >
              Buy Now
            </button>

          </div>
        </div>

      </div>
    </main>
  );
}