"use client";

import { useEffect, useState } from "react";
import { productStore, type Product } from "../../lib/productStore";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("men");
  const [image, setImage] = useState("");

  useEffect(() => {
    const update = () => {
      setProducts([...productStore.getAll()]);
    };

    update();

    productStore.subscribe(update);

    return () => {
      productStore.unsubscribe(update);
    };
  }, []);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (
      !name ||
      !price ||
      !description ||
      !image
    ) {
      alert("Please fill all fields.");
      return;
    }

    productStore.addProduct({
      id: Date.now().toString(),
      name,
      price: Number(price),
      description,
      image,
      category,
    });

    setName("");
    setPrice("");
    setDescription("");
    setCategory("men");
    setImage("");

    alert("Product added successfully!");
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      productStore.removeProduct(id);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl font-bold mb-8">
        📦 Product Management
      </h1>

      {/* FORM */}
      <div className="bg-white/10 rounded-xl p-6 max-w-lg mb-10 space-y-4">

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full p-3 rounded bg-white/10 border border-white/20"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          className="w-full p-3 rounded bg-white/10 border border-white/20"
        />

        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows={4}
          className="w-full p-3 rounded bg-white/10 border border-white/20 resize-none"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="w-full p-3 rounded bg-white/10 border border-white/20"
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>

        <div>
          <label className="block mb-2">
            Upload Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
        </div>

        {image && (
          <img
            src={image}
            alt="Preview"
            className="w-full h-48 object-cover rounded"
          />
        )}

        <button
          onClick={handleAdd}
          className="w-full bg-yellow-400 text-black py-3 rounded font-bold hover:bg-yellow-300"
        >
          Add Product
        </button>

      </div>

      {/* PRODUCTS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {products.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white/10 rounded-xl overflow-hidden"
            >

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-4">

                <h2 className="font-bold text-lg">
                  {product.name}
                </h2>

                <p className="text-yellow-400 font-semibold mt-1">
                  ₦{product.price.toLocaleString()}
                </p>

                <p className="text-gray-300 mt-2 text-sm">
                  {product.description}
                </p>

                <p className="capitalize text-sm text-gray-500 mt-2">
                  {product.category}
                </p>

                <button
                  onClick={() =>
                    handleDelete(product.id)
                  }
                  className="mt-4 w-full bg-red-500 py-2 rounded hover:bg-red-600"
                >
                  Delete Product
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </main>
  );
}