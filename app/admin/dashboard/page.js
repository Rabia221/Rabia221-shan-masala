"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Sidebar from "@/components/admin/Sidebar";
import { FiPackage, FiShoppingBag, FiTag, FiTrendingUp, FiClock, FiCheckCircle } from "react-icons/fi";

const STATUS_COLORS = { pending: "bg-yellow-100 text-yellow-700", processing: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-600" };
const PIE_COLORS = ["#f97316", "#ef4444", "#fb923c", "#fbbf24"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/admin/dashboard/stats")
      .then(({ data }) => {
        setStats(data.stats || {});
        setRecentOrders(data.recentOrders || []);
        setMonthlySales(data.monthlySales || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Products", value: stats.totalProducts || 0, icon: FiPackage, color: "bg-blue-500", light: "bg-blue-50 text-blue-600" },
    { label: "Total Orders", value: stats.totalOrders || 0, icon: FiShoppingBag, color: "bg-green-500", light: "bg-green-50 text-green-600" },
    { label: "Categories", value: stats.totalCategories || 0, icon: FiTag, color: "bg-purple-500", light: "bg-purple-50 text-purple-600" },
    { label: "Total Revenue", value: `Rs. ${(stats.totalRevenue || 0).toLocaleString()}`, icon: FiTrendingUp, color: "bg-orange-500", light: "bg-orange-50 text-orange-600" },
  ];

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">

        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Dashboard</h1>
            <p className="text-gray-400 text-xs mt-0.5">Welcome back — here's what's happening today</p>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-600">Live</span>
          </div>
        </div>

        <div className="p-8 space-y-8">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.light}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-xs text-green-500 font-bold bg-green-50 px-2 py-1 rounded-full">+12%</span>
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">{card.value}</p>
                  <p className="text-gray-400 text-xs font-medium mt-1">{card.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bar chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-extrabold text-gray-900">Monthly Sales</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Revenue overview by month</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlySales} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="total" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Pie chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="mb-6">
                <h2 className="font-extrabold text-gray-900">Revenue Split</h2>
                <p className="text-gray-400 text-xs mt-0.5">Products vs Orders</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={[{ name: "Revenue", value: stats.totalRevenue || 1 }, { name: "Orders", value: stats.totalOrders || 1 }]}
                    cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {[0, 1].map((i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {["Revenue", "Orders"].map((l, i) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-xs text-gray-500">{l}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Orders */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-gray-900">Recent Orders</h2>
                <p className="text-gray-400 text-xs mt-0.5">Latest customer orders</p>
              </div>
              <a href="/admin/orders" className="text-xs text-orange-500 font-bold hover:text-orange-600 transition">View All →</a>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {["Order #", "Customer", "Total", "Status", "Date"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No orders yet</td></tr>
                  ) : recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-mono font-bold text-gray-800">{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-800">{order.customerDetails?.name}</p>
                        <p className="text-xs text-gray-400">{order.customerDetails?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">Rs. {order.totalAmount?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-US")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
