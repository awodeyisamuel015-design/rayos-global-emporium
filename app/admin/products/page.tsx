"use client";

import { useEffect, useState } from "react";
import { productStore, type Product } from "../../lib/productStore";

export default function AdminProducts() {
const [products, setProducts] = useState<Product[]>([]);

const [name, setName] = useState("");
const [price, setPrice] = useState("");
const [description, setDescription] = useState("");
const [category, setCategory] = useState("men");

const [image, setImage] = useState<string>("");
const [uploading, setUploading] = useState(false);

// LOAD PRODUCTS (SUPABASE)
useEffect(() => {
const load = async () => {
const data = await productStore.getAll();
setProducts(data);
};


load();

productStore.subscribe(load);

return () => {
  productStore.unsubscribe(load);
};

}, []);

// CLOUDINARY UPLOAD
const handleImageUpload = async (
e: React.ChangeEvent<HTMLInputElement>
) => {
const file = e.target.files?.[0];
if (!file) return;

setUploading(true);

try {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary env variables");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Upload failed");
  }

  if (!data.secure_url) {
    throw new Error("No image URL returned");
  }

  setImage(data.secure_url);
  alert("✅ Image uploaded successfully!");
} catch (err: any) {
  console.error("UPLOAD ERROR:", err);
  alert(err.message || "Upload failed");
} finally {
  setUploading(false);
}

};

// ADD PRODUCT (SUPABASE)
const handleAddProduct = async () => {
if (!name || !price || !description || !image) {
alert("Please fill all fields");
return;
}

await productStore.addProduct({
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

const data = await productStore.getAll();
setProducts(data);

alert("✅ Product added successfully!");
};

// DELETE PRODUCT (SUPABASE)
const handleDelete = async (id: string) => {
if (!confirm("Delete this product?")) return;

await productStore.removeProduct(id);

const data = await productStore.getAll();
setProducts(data);
};

return ( <main className="min-h-screen bg-black text-white p-6"> <h1 className="text-3xl font-bold mb-8">
Product Management </h1>

  {/* FORM */}
  <div className="bg-white/10 p-6 rounded-xl mb-10 space-y-4 max-w-xl">
    <input
      type="text"
      placeholder="Product Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full p-3 rounded bg-black border"
    />

    <input
      type="number"
      placeholder="Price"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      className="w-full p-3 rounded bg-black border"
    />

    <textarea
      placeholder="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full p-3 rounded bg-black border"
    />

    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="w-full p-3 rounded bg-black border"
    >
      <option value="men">Men</option>
      <option value="women">Women</option>
      <option value="kids">Kids</option>
    </select>

    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
    />

    {uploading && <p>Uploading image...</p>}

    {image && (
      <img
        src={image}
        alt="Preview"
        className="w-full h-60 object-cover rounded"
      />
    )}

    <button
      onClick={handleAddProduct}
      disabled={uploading}
      className="w-full bg-yellow-500 text-black py-3 rounded font-bold"
    >
      Add Product
    </button>
  </div>

  {/* PRODUCTS GRID */}
  <div className="grid md:grid-cols-3 gap-6">
    {products.length === 0 ? (
      <p>No products found</p>
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
            <h2 className="font-bold">
              {product.name}
            </h2>

            <p className="text-yellow-400">
              ₦{product.price.toLocaleString()}
            </p>

            <p className="text-sm mt-2">
              {product.description}
            </p>

            <button
              onClick={() => handleDelete(product.id)}
              className="mt-4 w-full bg-red-500 py-2 rounded"
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
