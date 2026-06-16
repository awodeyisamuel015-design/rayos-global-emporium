"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { productStore, type Product } from "../../lib/productStore";

export default function AdminProducts() {
const [products, setProducts] = useState<Product[]>([]);

const [name, setName] = useState("");
const [price, setPrice] = useState("");
const [description, setDescription] = useState("");
const [category, setCategory] = useState("men");

const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [preview, setPreview] = useState("");
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

const handleImageChange = (
e: React.ChangeEvent<HTMLInputElement>
) => {
const file = e.target.files?.[0];


if (!file) return;

setSelectedFile(file);
setPreview(URL.createObjectURL(file));

};

const uploadImage = async () => {
if (!selectedFile) return "";

setUploading(true);

const formData = new FormData();

formData.append("file", selectedFile);
formData.append(
  "upload_preset",
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
);

try {
  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData
  );

  return response.data.secure_url;
} catch (error) {
  console.error(error);
  alert("Image upload failed.");
  return "";
} finally {
  setUploading(false);
}


};

const handleAdd = async () => {
if (
!name ||
!price ||
!description ||
!selectedFile
) {
alert("Please fill all fields.");
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

setSelectedFile(null);
setPreview("");

alert("Product added successfully!");


};

const handleDelete = (id: string) => {
if (confirm("Delete this product?")) {
productStore.removeProduct(id);
}
};

return ( <main className="min-h-screen bg-black text-white p-6"> <h1 className="text-3xl font-bold mb-8">
📦 Product Management </h1>

  <div className="bg-white/10 rounded-xl p-6 max-w-lg mb-10 space-y-4">

    <input
      type="text"
      placeholder="Product Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full p-3 rounded bg-white/10"
    />

    <input
      type="number"
      placeholder="Price"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      className="w-full p-3 rounded bg-white/10"
    />

    <textarea
      placeholder="Description"
      rows={4}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full p-3 rounded bg-white/10"
    />

    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="w-full p-3 rounded bg-white/10"
    >
      <option value="men">Men</option>
      <option value="women">Women</option>
      <option value="kids">Kids</option>
    </select>

    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
    />

    {preview && (
      <img
        src={preview}
        alt="Preview"
        className="w-full h-48 object-cover rounded"
      />
    )}

    <button
      onClick={handleAdd}
      disabled={uploading}
      className="w-full bg-yellow-400 text-black py-3 rounded font-bold"
    >
      {uploading
        ? "Uploading..."
        : "Add Product"}
    </button>

  </div>

  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

    {products.map((product) => (
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

          <p>
            ₦{product.price.toLocaleString()}
          </p>

          <p className="text-sm mt-2">
            {product.description}
          </p>

          <p className="capitalize mt-2">
            {product.category}
          </p>

          <button
            onClick={() =>
              handleDelete(product.id)
            }
            className="mt-4 w-full bg-red-500 py-2 rounded"
          >
            Delete Product
          </button>

        </div>
      </div>
    ))}

  </div>
</main>


);
}
