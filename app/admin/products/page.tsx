"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  productStore,
  type Product,
} from "../../lib/productStore";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("men");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

  // 📸 SELECT IMAGE FROM GALLERY
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  // ☁️ UPLOAD TO CLOUDINARY
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    setUploading(true);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      return res.data.secure_url;
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // ➕ ADD PRODUCT
  const handleAdd = async () => {
    if (!name || !price || !description || !imageFile) {
      alert("Please fill all fields");
      return;
    }

    const imageUrl = await uploadImage();
    if (!imageUrl) return;

    productStore.addProduct({
      id: Date.now().toString(),
      name,
      price: Number(price),
      description,
      category,
      image: imageUrl,
    });

    setName("");
    setPrice("");
    setDescription("");
    setCategory("men");
    setImageFile(null);

    alert("Product added successfully!");
  };

  // ❌ DELETE
  const handleDelete = (id: string) => {
    if (confirm("Delete this product?")) {
      productStore.removeProduct(id);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl font-bold mb-8">
        🛍 Admin Product Manager (Amazon Style)
      </h1>

      {/* FORM */}
      <div className="bg-white/10 p-6 rounded-xl max-w-lg space-y-4">

        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded bg-black/40"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 rounded bg-black/40"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded bg-black/40"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded bg-black/40"
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>

        {/* IMAGE PICKER */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {imageFile && (
          <p className="text-green-400 text-sm">
            ✔ Image selected: {imageFile.name}
          </p>
        )}

        <button
          onClick={handleAdd}
          disabled={uploading}
          className="w-full bg-yellow-400 text-black py-3 rounded font-bold"
        >
          {uploading ? "Uploading..." : "Add Product"}
        </button>

      </div>

      {/* PRODUCT LIST */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white/10 p-4 rounded-xl"
          >

            <img
              src={product.image}
              className="h-48 w-full object-cover rounded"
            />

            <h2 className="font-bold mt-2">
              {product.name}
            </h2>

            <p className="text-yellow-400">
              ₦{product.price.toLocaleString()}
            </p>

            <p className="text-sm opacity-70">
              {product.category}
            </p>

            <button
              onClick={() => handleDelete(product.id)}
              className="mt-3 w-full bg-red-500 py-2 rounded"
            >
              Delete
            </button>

          </div>
        ))}

      </div>
    </main>
  );
}