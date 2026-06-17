"use client";

import { useEffect, useState } from "react";
import { wishlistStore } from "../lib/wishlistStore";
import type { Product } from "../lib/productStore";

export default function HeartButton({
  product,
}: {
  product: Product;
}) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const updateState = () => {
      const exists = wishlistStore
        .getAll()
        .some((p) => p.id === product.id);

      setLiked(exists);
    };

    updateState();

    wishlistStore.subscribe(updateState);

    return () => {
      wishlistStore.unsubscribe(updateState);
    };
  }, [product.id]);

  const toggle = () => {
    const exists = wishlistStore
      .getAll()
      .some((p) => p.id === product.id);

    if (exists) {
      wishlistStore.remove(product.id);
    } else {
      wishlistStore.add(product);
    }
  };

  return (
    <button onClick={toggle} className="text-2xl transition">
      {liked ? "❤️" : "🤍"}
    </button>
  );
}