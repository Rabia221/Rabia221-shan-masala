'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden border border-gray-100 transition-shadow duration-300"
    >
      {/* Image */}
      <Link href={`/products/${product._id}`}>
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
          {product.image && !imgError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-5xl">🌶️</span>
            </div>
          )}

          {/* overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileHover={{ opacity: 1, scale: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow">
                <FiEye size={13} /> Quick View
              </div>
            </motion.div>
          </div>

          {/* stock badge */}
          {product.stock === 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          )}
          {product.stock > 0 && product.stock < 10 && (
            <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Only {product.stock} left
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* category */}
        {product.category?.name && (
          <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
            {product.category.name}
          </span>
        )}

        <Link href={`/products/${product._id}`}>
          <h3 className="text-gray-900 font-bold text-base mt-1 mb-1.5 hover:text-orange-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* stars */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <FiStar key={i} size={12} className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
          ))}
          <span className="text-xs text-gray-400 ml-1">(4.0)</span>
        </div>

        {/* price + cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-extrabold text-orange-600">Rs. {product.price}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product._id)}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm shadow-orange-200"
          >
            <FiShoppingCart size={13} />
            {product.stock === 0 ? 'Sold Out' : 'Add'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
