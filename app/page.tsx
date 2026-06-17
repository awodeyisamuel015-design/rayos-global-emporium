"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import ThemeToggle from "./components/ThemeToggle";
import CartDrawer from "./components/CartDrawer";
import WelcomeScreen from "./components/WelcomeScreen";
import { showToast } from "./components/Toast";

import { productStore, type Product } from "./lib/productStore";
import { cartStore } from "./lib/cartStore";
import { wishlistStore } from "./lib/wishlistStore";

export default function Home() {
  const router = useRouter();

  const [showWelcome, setShowWelcome] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [openCart, setOpenCart] = useState(false);

  useEffect(() => {
    const updateCart = () => {
      setCartCount(cartStore.getCartCount());
    };

    const updateWishlist = () => {
      setWishlistCount(wishlistStore.getAll().length);
    };

    const updateProducts = () => {
      setProducts(productStore.getAll());
    };

    updateCart();
    updateWishlist();
    updateProducts();

    cartStore.subscribe(updateCart);
    wishlistStore.subscribe(updateWishlist);
    productStore.subscribe(updateProducts);

    return () => {
      cartStore.unsubscribe(updateCart);
      wishlistStore.unsubscribe(updateWishlist);
      productStore.unsubscribe(updateProducts);
    };
  }, []);

  if (showWelcome) {
    return <WelcomeScreen onFinish={() => setShowWelcome(false)} />;
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "all" ||
      product.category.toLowerCase() === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen text-black dark:text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/30 dark:bg-black/30 backdrop-blur-md px-6 py-4 border-b border-white/10">

        <div className="flex justify-between items-center">

          <Image
            src="/logo.png"
            alt="Rayos Global"
            width={120}
            height={50}
          />

          <div className="flex gap-3 items-center">

            <ThemeToggle />

            {/* CART */}
            <button
              onClick={() => setOpenCart(true)}
              className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold relative"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* WISHLIST */}
            <button
              onClick={() => router.push("/wishlist")}
              className="bg-pink-500 text-white px-4 py-2 rounded-full font-bold relative"
            >
              ❤️ Wishlist
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center py-16 px-6">
        <h1 className="text-5xl font-bold">Elevate Your Style</h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="mt-6 px-5 py-3 rounded-full border w-full max-w-md"
        />
      </section>

      {/* CATEGORY */}
      <section className="flex justify-center gap-3 flex-wrap mb-10 px-4">

        {["all", "men", "women", "kids"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full ${
              category === cat
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 dark:bg-black/40"
            }`}
          >
            {cat}
          </button>
        ))}

      </section>

      {/* PRODUCTS */}
      <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 pb-20">

        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center">
            No products found
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white/20 dark:bg-black/40 rounded-2xl overflow-hidden"
            >

              <img
                src={product.image}
                className="w-full h-56 object-cover"
                alt={product.name}
              />

              <div className="p-4">

                <h3 className="font-bold">{product.name}</h3>

                <p className="text-yellow-400 font-bold">
                  ₦{product.price.toLocaleString()}
                </p>

                {/* VIEW */}
                <button
                  onClick={() =>
                    router.push(`/product/${product.id}`)
                  }
                  className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg"
                >
                  👀 View Product
                </button>

                {/* WISHLIST */}
                <button
                  onClick={() => {
                    wishlistStore.add(product);
                    showToast("Added to wishlist ❤️");
                  }}
                  className="w-full mt-2 bg-pink-500 text-white py-2 rounded-lg"
                >
                  ❤️ Wishlist
                </button>

                {/* CART */}
                <button
                  onClick={() => {
            cartStore.addToCart({
               id: product.id,
               name: product.name,
               price: product.price,
               image: product.image,
});
                 showToast("Added to cart 🛒");
                  }}
                  className="w-full mt-2 bg-yellow-400 text-black py-2 rounded-lg font-bold"
                >
                  🛒 Add to Cart
                </button>

              </div>
            </div>
          ))
        )}

      </section>

      {/* ADMIN */}
      <Link
        href="/admin/login"
        className="fixed bottom-6 left-6 bg-yellow-400 text-black px-5 py-3 rounded-full font-bold"
      >
        🔐 Admin
      </Link>

      {/* FOOTER */}
      <footer className="text-center py-8 opacity-70 border-t">
        © 2024 Rayos Global Emporium
      </footer>

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />

    </main>
  );
}