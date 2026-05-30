"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiTag } from "react-icons/fi";
import Sidebar from "@/components/admin/Sidebar";

const EMPTY_FORM = { name: "", description: "" };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/categories");
      setCategories(data.categories);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModal(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || "" });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await axios.put(`/api/admin/categories/${editing._id}`, form);
        toast.success("Category updated successfully!");
      } else {
        await axios.post("/api/admin/categories", form);
        toast.success("Category added successfully!");
      }
      setModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`/api/admin/categories/${id}`);
      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <FiPlus /> Add Category
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FiTag className="text-orange-600" size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{cat.description || "No description"}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <FiEdit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${cat.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {cat.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </motion.div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-3 text-center py-16 text-gray-400">
                <FiTag size={40} className="mx-auto mb-3 opacity-30" />
                <p>No categories found</p>
              </div>
            )}
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  {editing ? "Edit Category" : "Add New Category"}
                </h2>
                <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g. Masala, Spices"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    placeholder="Category description..."
                  />
                </div>
                <div className="flex gap-3 pt-1">
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
                    {saving ? "Saving..." : editing ? "Update" : "Add Category"}
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
