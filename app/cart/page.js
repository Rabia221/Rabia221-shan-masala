"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem, getCartTotal } = useCart();
  const items = cart?.items || [];
  const total = getCartTotal();
  const shipping = total > 2000 ? 0 : 200;
  const grandTotal = total + shipping;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-28 h-28 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag size={48} className="text-orange-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Add some delicious spices to get started!</p>
          <Link href="/products">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-bold transition shadow-lg shadow-orange-200">
              Browse Products <FiArrowRight />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-400 text-sm mt-1">{items.length} item{items.length !== 1 ? "s" : ""} in your cart</p>
          </div>
          <Link href="/products" className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition font-medium">
            <FiArrowLeft size={15} /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div key={item.product._id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center">

                  {/* image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-orange-50 flex-shrink-0">
                    {item.product.image ? (
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-3xl">🌶️</div>
                    )}
                  </div>

                  {/* info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{item.product.name}</h3>
                    {item.product.category?.name && (
                      <p className="text-xs text-orange-500 font-medium mt-0.5">{item.product.category.name}</p>
                    )}
                    <p className="text-orange-600 font-extrabold text-base mt-1">Rs. {item.product.price}</p>
                  </div>

                  {/* quantity */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                    <button onClick={() => item.quantity === 1 ? removeItem(item.product._id) : updateQuantity(item.product._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-orange-500 hover:shadow transition">
                      <FiMinus size={13} />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-orange-500 hover:shadow transition">
                      <FiPlus size={13} />
                    </button>
                  </div>

                  {/* subtotal */}
                  <div className="text-right min-w-[80px]">
                    <p className="font-extrabold text-gray-900">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>

                  {/* remove */}
                  <button onClick={() => removeItem(item.product._id)}
                    className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition">
                    <FiTrash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-extrabold text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-gray-800">Rs. {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-green-500" : "text-gray-800"}`}>
                    {shipping === 0 ? "FREE" : `Rs. ${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-orange-500 bg-orange-50 rounded-lg px-3 py-2">
                    Add Rs. {(2000 - total).toLocaleString()} more for free shipping!
                  </p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-extrabold text-gray-900">Total</span>
                  <span className="font-extrabold text-orange-600 text-lg">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <Link href="/checkout">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-base transition shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
                  Proceed to Checkout <FiArrowRight />
                </motion.button>
              </Link>

              {/* secure badge */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure checkout powered by Stripe
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
