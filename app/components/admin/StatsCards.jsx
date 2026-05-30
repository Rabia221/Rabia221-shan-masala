'use client';

import { motion } from 'framer-motion';
import { FiPackage, FiShoppingBag, FiTag, FiDollarSign } from 'react-icons/fi';

const statsConfig = [
  { key: 'totalProducts', icon: FiPackage, label: 'Total Products', color: 'from-blue-500 to-blue-600' },
  { key: 'totalOrders', icon: FiShoppingBag, label: 'Total Orders', color: 'from-green-500 to-green-600' },
  { key: 'totalCategories', icon: FiTag, label: 'Categories', color: 'from-purple-500 to-purple-600' },
  { key: 'totalRevenue', icon: FiDollarSign, label: 'Total Revenue', color: 'from-orange-500 to-red-600', prefix: '$' },
];

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((config, index) => {
        const Icon = config.icon;
        const value = stats[config.key] || 0;
        
        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`bg-gradient-to-r ${config.color} rounded-lg shadow-lg p-6 text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">{config.label}</p>
                <p className="text-3xl font-bold">
                  {config.prefix}{typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </div>
              <Icon size={40} className="opacity-80" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}