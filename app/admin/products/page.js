"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiImage } from "react-icons/fi";
import Sidebar from "@/components/admin/Sidebar";
import Image from "next/image";

const EMPTY_FORM = { name: "", description: "", price: "", category: "", stock: "", image: null };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const fetchProducts = async (p = page, s = search) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/admin/products?page=${p}&search=${s}`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/admin/categories");
      setCategories(data.categories);
    } catch {}
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setPreview(null);
    setModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || product.category,
      stock: product.stock,
      image: null,
    });
    setPreview(product.image);
    setModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("category", form.category);
      fd.append("stock", form.stock);
      if (form.image) fd.append("image", form.image);

      if (editing) {
        await axios.put(`/api/admin/products/${editing._id}`, fd);
        toast.success("Product updated successfully!");
      } else {
        await axios.post("/api/admin/products", fd);
        toast.success("Product added successfully!");
      }
      setModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/admin/products/${id}`);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1, search);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <FiPlus /> Add Product
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
            Search
          </button>
        </form>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {["Image", "Name", "Category", "Price", "Stock", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-orange-50 transition">
                    <td className="px-5 py-3">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg border" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FiImage className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="px-5 py-3 text-gray-500">{p.category?.name || "—"}</td>
                    <td className="px-5 py-3 text-gray-700 font-semibold">Rs. {p.price}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">No products found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => { setPage(p); fetchProducts(p, search); }}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${p === page ? "bg-orange-600 text-white" : "bg-white text-gray-600 border hover:bg-orange-50"}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  {editing ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Image Upload */}
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

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModal(false)}
                    className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg transition font-medium disabled:opacity-60"
                  >
                    {saving ? "Saving..." : editing ? "Update" : "Add Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
