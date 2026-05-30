"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/signup", { email, password });
      toast.success("Admin account created successfully!");
      router.push("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  const EyeBtn = ({ show, toggle }) => (
    <button type="button" onClick={toggle}
      className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-orange-500 transition">
      {show ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/form.jpg"
          alt="Shan Masala Register"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-red-900/50 to-black/60" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          {/* logos */}
          <div className="flex items-center gap-4">
            <Image src="/images/logo.jpg" alt="Logo" width={56} height={56} className="rounded-xl object-cover shadow-lg" />
            <Image src="/images/logo2.jpg" alt="Logo 2" width={56} height={56} className="rounded-xl object-cover shadow-lg" />
          </div>

          {/* center text */}
          <div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Join the<br />
              <span className="text-orange-400">Shan Masala</span><br />
              Admin Team
            </h2>
            <p className="text-gray-300 text-base leading-relaxed max-w-sm">
              Create your admin account to start managing products, categories and orders with ease.
            </p>

            {/* feature list */}
            <div className="mt-8 space-y-3">
              {[
                "Full product management",
                "Category & inventory control",
                "Order tracking & updates",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-200 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* bottom badge */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 w-fit">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-sm font-medium">Secure Registration</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">

          {/* mobile logos */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <Image src="/images/logo.jpg" alt="Logo" width={48} height={48} className="rounded-xl object-cover shadow" />
            <Image src="/images/logo2.jpg" alt="Logo 2" width={48} height={48} className="rounded-xl object-cover shadow" />
          </div>

          {/* heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Set up your admin account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shanmasala.com"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition shadow-sm"
                />
                <EyeBtn show={showPassword} toggle={() => setShowPassword(!showPassword)} />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full pl-11 pr-11 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition shadow-sm ${
                    passwordsMismatch
                      ? "border-red-300 focus:ring-red-300"
                      : passwordsMatch
                      ? "border-green-300 focus:ring-green-300"
                      : "border-gray-200 focus:ring-orange-400"
                  }`}
                />
                <EyeBtn show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
              </div>

              {/* match indicator */}
              {confirmPassword && (
                <p className={`flex items-center gap-1.5 text-xs font-medium mt-1.5 ${passwordsMatch ? "text-green-500" : "text-red-400"}`}>
                  {passwordsMatch ? (
                    <><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Passwords match</>
                  ) : (
                    <><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> Passwords do not match</>
                  )}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-orange-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-1 text-sm tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating Account...
                </span>
              ) : "Create Account →"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/admin/login" className="text-orange-500 font-semibold hover:text-orange-600 transition">
                Sign In
              </a>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            © {new Date().getFullYear()} Shan Masala. All rights reserved.
          </p>
        </div>
      </div>

    </div>
  );
}
