"use client";

import { useEffect, useState } from "react";
import { wishlistStore } from "@/app/wishlistStore";
import type { Product } from "@/app/cartstore";

export default function HeartButton({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const exists = wishlistStore
      .getAll()
      .some((p) => p.id === product.id);

    setLiked(exists);
  }, [product.id]);

  const toggle = () => {
    if (liked) {
      wishlistStore.removeById(product.id);
    } else {
      wishlistStore.add(product);
    }

    setLiked(!liked);
  };

  return (
    <button onClick={toggle} className="text-2xl">
      {liked ? "❤️" : "🤍"}
    </button>
  );
}