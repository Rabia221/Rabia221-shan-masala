"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* ───────── LEFT PANEL ───────── */}
      <div className="hidden lg:block lg:w-1/2 relative h-screen">
        <Image
          src="/images/formlogin.jpg"
          alt="Shan Masala"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-orange-900/50 to-black/60" />

        {/* Text */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-12">
          <h2 className="text-5xl font-extrabold text-white leading-tight mb-4">
            Welcome to
            <br />
            <span className="text-orange-400">Shan Masala</span>
            <br />
            Admin Panel
          </h2>

          <p className="text-gray-300 text-lg max-w-md mb-8">
            Manage your products, categories and orders from one powerful
            dashboard.
          </p>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 w-fit">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-sm font-medium">
              Secure Admin Access
            </span>
          </div>
        </div>
      </div>

      {/* ───────── RIGHT PANEL ───────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Sign In</h1>
            <p className="text-gray-500 text-sm mt-1">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                placeholder="admin@shanmasala.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                  placeholder="Enter password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  👁
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
