"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "@/components/admin/Sidebar";
import ProductForm from "@/components/forms/ProductForm";

export default function NewProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/admin/categories");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Fetch categories error:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post("/api/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        toast.success("Product created successfully");
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Create product error:", error);
      toast.error(error.response?.data?.error || "Failed to create product");
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Add New Product
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <ProductForm
              categories={categories}
              onSubmit={handleSubmit}
              buttonText="Create Product"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
