'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const cartCount = getCartCount();

  const isAdminPage = pathname.startsWith('/admin');
  const isCheckoutPage =
    pathname.startsWith('/checkout') || pathname.startsWith('/cart');

  const isDark = !(scrolled || isAdminPage || isCheckoutPage);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-lg'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo2.jpg"
              alt="Shan"
              width={42}
              height={42}
              className="rounded-xl object-cover shadow"
            />
            <span
              className={`text-xl font-extrabold tracking-tight transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Shan <span className="text-orange-500">Masala</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors relative group ${
                  pathname === link.href
                    ? 'text-orange-500'
                    : isDark
                    ? 'text-white/90 hover:text-white'
                    : 'text-gray-700 hover:text-orange-500'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${
                    pathname === link.href
                      ? 'w-full'
                      : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}

            {/* Auth */}
            {user ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`text-sm font-semibold transition-colors ${
                    isDark
                      ? 'text-white/90 hover:text-white'
                      : 'text-gray-700 hover:text-orange-500'
                  }`}
                >
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className={`text-sm font-semibold transition-colors ${
                    isDark
                      ? 'text-white/90 hover:text-white'
                      : 'text-gray-700 hover:text-orange-500'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/admin/login"
                className={`text-sm font-semibold transition-colors ${
                  isDark
                    ? 'text-white/90 hover:text-white'
                    : 'text-gray-700 hover:text-orange-500'
                }`}
              >
                Admin
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2.5 rounded-xl transition-colors ${
                  isDark
                    ? 'bg-white/15 text-white hover:bg-white/25'
                    : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                }`}
              >
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/cart" className="relative p-2">
              <FiShoppingCart
                size={22}
                className={isDark ? 'text-white' : 'text-gray-700'}
              />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={isDark ? 'text-white' : 'text-gray-700'}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-xl"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 text-sm font-semibold border-b border-gray-50 ${
                    pathname === link.href
                      ? 'text-orange-500'
                      : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 text-sm font-semibold text-gray-700 border-b border-gray-50"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block py-3 text-sm font-semibold text-gray-700 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-sm font-semibold text-gray-700"
                >
                  Admin
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}