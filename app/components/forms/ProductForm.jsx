'use client';

import { useState, useRef } from 'react';
import { FiImage } from 'react-icons/fi';

export default function ProductForm({ categories, product, onSubmit, buttonText = "Save Product" }) {
  const [form, setForm] = useState(product || {
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });
  const [preview, setPreview] = useState(product?.image || null);
  const fileRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("category", form.category);
    fd.append("stock", form.stock);
    if (form.image) fd.append("image", form.image);
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        onClick={() => fileRef.current.click()}
        className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-orange-400 transition"
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-lg" />
        ) : (
          <div className="py-6 text-gray-400">
            <FiImage size={32} className="mx-auto mb-2" />
            <p className="text-sm">Click to select an image</p>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="e.g. Shan Biryani Masala"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            placeholder="Product description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="0"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg transition font-medium"
      >
        {buttonText}
      </button>
    </form>
  );
}