"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "@/components/ui/ProductCard";
import {
  FiArrowRight,
  FiStar,
  FiShield,
  FiTruck,
  FiRefreshCw,
} from "react-icons/fi";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/products?page=1&limit=6")
      .then(({ data }) => setFeaturedProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* HERO — bg1.jpg + parallax */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden pt-20">
        <Image
          src="/images/bg1.jpg"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="relative z-10 container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="inline-flex items-center gap-2 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 shadow-lg"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Premium Quality Spices
            </motion.span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6">
              Authentic
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                Pakistani
              </span>
              <br />
              Spices
            </h1>

            <p className="text-gray-200 text-lg md:text-xl mb-10 leading-relaxed max-w-lg">
              Discover the true essence of Pakistani cuisine with Shan Masala's
              premium quality spices — trusted by millions worldwide.
            </p>

            <div className="flex flex-wrap gap-4 mb-14">
              <Link href="/products">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(249,115,22,0.4)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-lg shadow-orange-500/30 transition"
                >
                  Shop Now <FiArrowRight />
                </motion.button>
              </Link>
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/25 px-8 py-4 rounded-2xl font-bold text-base transition"
                >
                  View All Products
                </motion.button>
              </Link>
            </div>

            <div className="flex gap-8">
              {[
                ["50+", "Products"],
                ["1M+", "Customers"],
                ["30+", "Countries"],
              ].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="text-2xl md:text-3xl font-extrabold text-orange-400">
                    {n}
                  </p>
                  <p className="text-gray-300 text-xs font-medium mt-0.5">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BADGES — bg2.jpg */}
      <section className="relative py-16 overflow-hidden">
        <Image src="/images/bg2.jpg" alt="bg" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <FiTruck size={28} />,
                title: "Free Shipping",
                desc: "On orders over Rs. 2000",
              },
              {
                icon: <FiShield size={28} />,
                title: "100% Authentic",
                desc: "Genuine premium spices",
              },
              {
                icon: <FiRefreshCw size={28} />,
                title: "Easy Returns",
                desc: "30-day return policy",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="flex items-center gap-5 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-5 hover:bg-white/15 transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">{f.title}</h3>
                  <p className="text-gray-300 text-sm mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Best Sellers
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Our most popular masalas loved by millions of families
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-52 bg-gray-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-14">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold text-base shadow-lg shadow-orange-200 transition"
              >
                View All Products <FiArrowRight />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE — Shan Zafrani image */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                The Secret Behind
                <br />
                <span className="text-orange-500">Every Great Dish</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                For over 40 years, Shan Masala has been crafting the finest
                spice blends using traditional recipes and the highest quality
                ingredients sourced from around the world.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  "Hand-picked premium ingredients",
                  "Traditional recipes perfected over decades",
                  "No artificial colors or preservatives",
                  "Trusted by over 1 million families",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold text-sm transition"
                >
                  Explore Products <FiArrowRight />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ x: 60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/Shan Zafrani Garam Taaza Masala Spices.jpg"
                  alt="Shan Spices"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    4.9 / 5 Rating
                  </p>
                  <p className="text-gray-400 text-xs">10,000+ reviews</p>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5 }}
                className="absolute -top-6 -right-6 bg-orange-500 rounded-2xl shadow-xl p-4 text-white"
              >
                <p className="font-extrabold text-2xl">50+</p>
                <p className="text-orange-100 text-xs font-medium">Products</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA — bg3.jpg */}
      <section className="relative py-28 overflow-hidden">
        <Image src="/images/bg3.jpg" alt="CTA" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/85 via-black/70 to-black/80" />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-8">
              <Image
                src="/images/logo.jpg"
                alt="Logo"
                width={60}
                height={60}
                className="rounded-2xl object-cover shadow-xl border-2 border-white/20"
              />
            </div>
            <span className="inline-block bg-orange-500/80 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Limited Time Offer
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Taste the
              <br />
              <span className="text-orange-400">Tradition</span>
            </h2>
            <p className="text-gray-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              From our kitchen to yours — experience the authentic flavors of
              Pakistan with every dish you cook.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold text-base shadow-lg shadow-orange-500/30 transition"
                >
                  Shop Now <FiArrowRight />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}