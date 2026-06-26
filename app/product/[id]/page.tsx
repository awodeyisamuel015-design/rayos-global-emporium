"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productStore } from "../../lib/productStore";
import { cartStore } from "../../lib/cartStore";
import { wishlistStore } from "../../lib/wishlistStore";
import type { Product } from "../../lib/productStore";

export default function ProductPage() {
const params = useParams();
const id = params?.id as string;

const [product, setProduct] = useState<Product | null>(null);
const [loading, setLoading] = useState(true);
const [selectedColor, setSelectedColor] = useState("");
const [selectedSize, setSelectedSize] = useState("");
const [quantity, setQuantity] = useState(1);

useEffect(() => {
const loadProduct = async () => {
try {
const data = await productStore.getById(id);
setProduct(data);
} catch (err) {
console.error(err);
} finally {
setLoading(false);
}
};

if (id) loadProduct();

}, [id]);

if (loading) {
return ( <main className="min-h-screen bg-black text-white flex items-center justify-center">
Loading product... </main>
);
}

if (!product) {
return ( <main className="min-h-screen bg-black text-white flex items-center justify-center">
Product Not Found 😢 </main>
);
}

return ( <main className="min-h-screen bg-black text-white p-6"> <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

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

     <div>
  <div className="flex items-center gap-3">

    <span className="text-yellow-400 text-3xl font-bold">
      ₦{Number(product.price || 0).toLocaleString()}
    </span>

    {product.old_price && product.old_price > product.price && (
      <span className="line-through text-gray-500 text-xl">
        ₦{Number(product.old_price).toLocaleString()}
      </span>
    )}

  </div>

  {product.old_price && product.old_price > product.price && (
    <span className="inline-block mt-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
      {Math.round(
        ((product.old_price - product.price) /
          product.old_price) *
          100
      )}
      % OFF
    </span>
  )}
</div>

<div className="flex items-center gap-2">

  <span className="text-yellow-400">
    ⭐⭐⭐⭐⭐
  </span>

  <span className="text-gray-400">
    ({product.reviews || 0} reviews)
  </span>

</div>

      <p className="text-gray-300">
        {product.description}
      </p>

      <p className="text-gray-400 capitalize">
        Category: {product.category}
      </p>
     <p className="text-green-400 font-semibold">
         {product.stock || 0} items remaining
    </p>



    {product.colors?.length ? (
  <div>

    <h3 className="font-semibold mb-2">
      Color
    </h3>

    <div className="flex gap-2">

      {product.colors.map((color) => (
        <button
          key={color}
          onClick={() => setSelectedColor(color)}
          className={`px-4 py-2 rounded-lg border ${
            selectedColor === color
              ? "border-yellow-400 bg-yellow-400 text-black"
              : "border-white/20"
          }`}
        >
          {color}
        </button>
      ))}

    </div>

  </div>
) : null}
  


  {product.sizes?.length ? (
  <div>

    <h3 className="font-semibold mb-2">
      Size
    </h3>

    <div className="flex gap-2">

      {product.sizes.map((size) => (
        <button
          key={size}
          onClick={() => setSelectedSize(size)}
          className={`px-4 py-2 rounded-lg border ${
            selectedSize === size
              ? "border-yellow-400 bg-yellow-400 text-black"
              : "border-white/20"
          }`}
        >
          {size}
        </button>
      ))}

    </div>

  </div>
) : null}

<div>

  <h3 className="font-semibold mb-2">
    Quantity
  </h3>

  <div className="flex items-center gap-3">

    <button
      onClick={() =>
        setQuantity(Math.max(1, quantity - 1))
      }
      className="px-4 py-2 bg-white/10 rounded-lg"
    >
      -
    </button>

    <span>{quantity}</span>

    <button
      onClick={() =>
        setQuantity(quantity + 1)
      }
      className="px-4 py-2 bg-white/10 rounded-lg"
    >
      +
    </button>

  </div>

</div>
      {/* BUTTONS */}
      <div className="flex flex-col gap-3 mt-6">

        <button
          onClick={() =>
           cartStore.addToCart({
           id: product.id,
           name: product.name,
           price: product.price,
           image: product.image,
           quantity,
           color: selectedColor,
           size: selectedSize,
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

        <button className="bg-green-500 text-white py-3 rounded-xl font-bold">
          Buy Now
        </button>

      </div>
    </div>
  </div>
</main>
);
}
