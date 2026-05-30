"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiShoppingCart, FiStar, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data.product || data);
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Product not found</h2>
        <Link href="/products" className="bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-orange-600 transition">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6 font-medium">
          <FiArrowLeft size={18} /> Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="relative h-96 bg-white rounded-2xl overflow-hidden shadow-lg">
              {product.image ? (
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-7xl">🌶️</span>
                </div>
              )}
              {product.stock === 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {product.category?.name && (
              <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">
                {product.category.name}
              </span>
            )}
            <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>

            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={16} className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'} />
              ))}
              <span className="text-sm text-gray-500">(4.0) 128 reviews</span>
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <span className="text-3xl font-extrabold text-orange-600">Rs. {product.price}</span>
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Stock: {product.stock} units available</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addToCart(product._id)}
              disabled={product.stock === 0}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-orange-200"
            >
              <FiShoppingCart size={18} />
              {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}