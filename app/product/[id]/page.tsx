"use client";

import { useParams, useRouter } from "next/navigation";
import { productStore } from "../../lib/productStore";
import { cartStore } from "../../cartstore";
import { wishlistStore } from "../../wishlistStore";
import { showToast } from "../../components/Toast";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();

  const product = productStore.getById(
    params.id as string
  );

  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">
          Product Not Found
        </h1>

        <button
          onClick={() => router.push("/")}
          className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-xl"
        >
          Back Home
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      <button
        onClick={() => router.back()}
        className="mb-8 bg-white/10 px-4 py-2 rounded-lg"
      >
        ← Back
      </button>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* PRODUCT IMAGE */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-3xl object-cover"
          />
        </div>

        {/* PRODUCT INFO */}
        <div>

          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full capitalize">
            {product.category}
          </span>

          <h1 className="text-4xl font-bold mt-4">
            {product.name}
          </h1>

          <p className="text-yellow-400 text-3xl font-bold mt-4">
            ₦{product.price.toLocaleString()}
          </p>

          <div className="mt-8">

            <h2 className="text-2xl font-semibold mb-3">
              Product Description
            </h2>

            <p className="text-gray-300 leading-8">
              {product.description}
            </p>

          </div>

          <div className="mt-10 space-y-3">

            <button
              onClick={() => {
                cartStore.addToCart(product);
                showToast("Added to cart 🛒");
              }}
              className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-bold"
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={() => {
                wishlistStore.add(product);
                showToast("Added to wishlist ❤️");
              }}
              className="w-full bg-pink-500 py-4 rounded-2xl font-bold"
            >
              ❤️ Add to Wishlist
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}