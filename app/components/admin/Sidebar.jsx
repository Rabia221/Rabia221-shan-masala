'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiHome, FiPackage, FiShoppingBag, FiTag, FiLogOut, FiExternalLink } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { href: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
  { href: '/admin/products', icon: FiPackage, label: 'Products' },
  { href: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { href: '/admin/categories', icon: FiTag, label: 'Categories' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-64 bg-gray-950 min-h-screen flex flex-col shadow-2xl flex-shrink-0"
    >
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-800 flex items-center gap-3">
        <Image src="/images/logo.jpg" alt="Shan Logo" width={36} height={36} className="rounded-xl object-cover flex-shrink-0" />
        <div>
          <p className="text-white font-extrabold text-sm leading-tight">Shan Masala</p>
          <p className="text-orange-400 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest px-3 mb-3">Main Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white/20' : 'bg-gray-800'}`}>
                  <Icon size={16} />
                </div>
                <span className="text-sm font-semibold">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 pb-6 space-y-2 border-t border-gray-800 pt-4">
        <Link href="/" target="_blank">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
              <FiExternalLink size={15} />
            </div>
            <span className="text-sm font-semibold">View Website</span>
          </div>
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition">
          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
            <FiLogOut size={15} />
          </div>
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
}
