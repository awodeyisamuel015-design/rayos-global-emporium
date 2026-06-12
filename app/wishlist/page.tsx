"use client";

import { useEffect, useState } from "react";
import { wishlistStore } from "../wishlistStore";

export default function WishlistPage() {
  const [items, setItems] = useState(
    wishlistStore.getAll()
  );

  useEffect(() => {
    const updateWishlist = () => {
      setItems([...wishlistStore.getAll()]);
    };

    wishlistStore.subscribe(updateWishlist);

    return () => {
      wishlistStore.unsubscribe(updateWishlist);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl font-bold mb-8">
        ❤️ My Wishlist
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-400">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">

          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 rounded-xl overflow-hidden"
            >

              <img
                src={item.image}
                alt={item.name}
                className="w-full h-60 object-cover"
              />

              <div className="p-4">

                <h2 className="font-bold text-lg">
                  {item.name}
                </h2>

                <p className="text-yellow-400 font-semibold">
                  ₦{item.price.toLocaleString()}
                </p>

                <button
                  onClick={() =>
                    wishlistStore.remove(item.id)
                  }
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg transition"
                >
                  Remove
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}