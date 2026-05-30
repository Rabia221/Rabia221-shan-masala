'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter, FiArrowRight } from 'react-icons/fi';

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-gray-950 text-white">

      {/* Top strip */}
      <div className="bg-orange-500">
        <div className="container mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white text-sm font-semibold">🚚 Free shipping on orders over Rs. 2000</p>
          <p className="text-orange-100 text-xs">Authentic Pakistani spices since 1981</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Image src="/images/logo2.jpg" alt="Shan Masala Logo" width={52} height={52} className="rounded-xl object-cover" />
              <div>
                <p className="font-extrabold text-white text-lg leading-tight">Shan Masala</p>
                <p className="text-orange-400 text-xs font-medium">Since 1981</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Pakistan's most trusted spice brand. We bring authentic flavors to your kitchen using traditional recipes and premium quality ingredients sourced from around the world.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FiFacebook, href: '#', label: 'Facebook' },
                { icon: FiInstagram, href: '#', label: 'Instagram' },
                { icon: FiTwitter, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'All Products' },
                { href: '/cart', label: 'Shopping Cart' },
                { href: '/checkout', label: 'Checkout' },
                { href: '/admin/login', label: 'Admin Panel' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-orange-400 text-sm transition flex items-center gap-2 group">
                    <FiArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FiMail size={15} className="text-orange-400 mt-0.5 flex-shrink-0" />
                <span>info@shanmasala.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FiPhone size={15} className="text-orange-400 mt-0.5 flex-shrink-0" />
                <span>+92 21 111-742-611</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FiMapPin size={15} className="text-orange-400 mt-0.5 flex-shrink-0" />
                <span>Shan Foods, Karachi, Pakistan</span>
              </li>
            </ul>

            <div className="mt-6 bg-gray-900 rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">Business Hours</p>
              <p className="text-sm text-gray-300 font-medium">Mon – Sat: 9am – 6pm</p>
              <p className="text-xs text-gray-500 mt-1">Sunday: Closed</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5">Newsletter</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Subscribe to get exclusive recipes, special offers and new product announcements straight to your inbox.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
              />
              <button
                onClick={() => { if (email) { setEmail(''); } }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
              >
                Subscribe <FiArrowRight size={14} />
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Shan Masala. All rights reserved. Premium Pakistani Spices & Masalas.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((item) => (
              <a key={item} href="#" className="text-gray-600 hover:text-gray-400 text-xs transition">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
