"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiCheckCircle, FiShoppingBag, FiHome } from "react-icons/fi";

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle size={40} className="text-green-500" />
        </motion.div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Thank you for your order. We've received your payment and will process your order shortly. You'll receive a confirmation email soon.
        </p>

        <div className="bg-orange-50 rounded-2xl p-4 mb-8">
          <p className="text-xs text-orange-600 font-semibold">Estimated Delivery</p>
          <p className="text-gray-800 font-bold mt-1">3–5 Business Days</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/products">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-bold transition shadow-lg shadow-orange-200">
              <FiShoppingBag size={16} /> Continue Shopping
            </motion.button>
          </Link>
          <Link href="/">
            <button className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 py-3 text-sm font-medium transition">
              <FiHome size={15} /> Back to Home
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
