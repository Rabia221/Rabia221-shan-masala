"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { FiSearch, FiFilter, FiX, FiGrid, FiList } from "react-icons/fi";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?page=${currentPage}&limit=12`;
      if (selectedCategory) url += `&category=${selectedCategory}`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (sortBy) url += `&sort=${sortBy}`;
      const { data } = await axios.get(url);
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/admin/categories");
      setCategories(data.categories || []);
    } catch {}
  };

  useEffect(() => { fetchProducts(); }, [currentPage, selectedCategory, searchTerm, sortBy]);
  useEffect(() => { fetchCategories(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchTerm(searchInput);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchTerm("");
    setSearchInput("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const hasFilters = selectedCategory || searchTerm || sortBy !== "newest";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Banner ── */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image src="/images/bg2.jpg" alt="Products" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-orange-900/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-orange-500/90 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Our Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">All Products</h1>
            <p className="text-gray-200 text-base max-w-md">
              Explore our full range of authentic Pakistani spices and masalas
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-10">

        {/* ── Search + Sort Bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
              />
            </div>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl text-sm font-bold transition shadow-sm">
              Search
            </button>
          </form>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm font-medium text-gray-700"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 shadow-sm"
            >
              <FiFilter size={15} /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8">

          {/* ── Sidebar Filters (desktop) ── */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Categories</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1">
                    <FiX size={12} /> Clear
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory(""); setCurrentPage(1); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    !selectedCategory ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  All Products
                  <span className={`float-right text-xs ${!selectedCategory ? "text-orange-100" : "text-gray-400"}`}>
                    {products.length > 0 ? pagination.total || "" : ""}
                  </span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => { setSelectedCategory(cat._id); setCurrentPage(1); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                      selectedCategory === cat._id ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Mobile Filter Drawer ── */}
          <AnimatePresence>
            {showMobileFilter && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setShowMobileFilter(false)}>
                <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
                  className="absolute left-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-800">Categories</h3>
                    <button onClick={() => setShowMobileFilter(false)}><FiX size={20} /></button>
                  </div>
                  <div className="space-y-1">
                    <button onClick={() => { setSelectedCategory(""); setCurrentPage(1); setShowMobileFilter(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition ${!selectedCategory ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-orange-50"}`}>
                      All Products
                    </button>
                    {categories.map((cat) => (
                      <button key={cat._id}
                        onClick={() => { setSelectedCategory(cat._id); setCurrentPage(1); setShowMobileFilter(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition ${selectedCategory === cat._id ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-orange-50"}`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Products Grid ── */}
          <div className="flex-1 min-w-0">
            {/* result count */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {loading ? "Loading..." : `${products.length} products found`}
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1">
                  <FiX size={12} /> Clear filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-52 bg-gray-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🌶️</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <motion.div key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="mt-10">
                    <Pagination currentPage={currentPage} totalPages={pagination.totalPages} onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
