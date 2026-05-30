"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiTrash2, FiX, FiShoppingBag } from "react-icons/fi";
import Sidebar from "@/components/admin/Sidebar";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchOrders = async (p = page) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/admin/orders?page=${p}`);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const openStatusModal = (order) => {
    setStatusModal(order);
    setNewStatus(order.status);
  };

  const handleStatusUpdate = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/admin/orders/${statusModal._id}`, { status: newStatus });
      toast.success("Status updated successfully!");
      setStatusModal(null);
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`/api/admin/orders/${id}`);
      toast.success("Order deleted successfully!");
      fetchOrders();
    } catch {
      toast.error("Failed to delete order");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {["Order #", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-orange-50 transition">
                    <td className="px-5 py-4 font-mono text-sm font-medium text-gray-800">{order.orderNumber}</td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-gray-800">{order.customerDetails?.name}</div>
                      <div className="text-xs text-gray-400">{order.customerDetails?.email}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{order.items?.length} items</td>
                    <td className="px-5 py-4 font-semibold text-gray-800">Rs. {order.totalAmount}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => openStatusModal(order)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition ${STATUS_COLORS[order.status]}`}
                      >
                        {order.status}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      <FiShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
                      <p>No orders found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => { setPage(p); fetchOrders(p); }}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${p === page ? "bg-orange-600 text-white" : "bg-white text-gray-600 border hover:bg-orange-50"}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View Order Modal */}
      <AnimatePresence>
        {viewOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setViewOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                <button onClick={() => setViewOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Order Number</p>
                  <p className="font-mono font-bold text-gray-800">{viewOrder.orderNumber}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-2">Customer Info</p>
                  <p className="font-semibold text-gray-800">{viewOrder.customerDetails?.name}</p>
                  <p className="text-sm text-gray-500">{viewOrder.customerDetails?.email}</p>
                  <p className="text-sm text-gray-500">{viewOrder.customerDetails?.phone}</p>
                  <p className="text-sm text-gray-500">{viewOrder.customerDetails?.address}, {viewOrder.customerDetails?.city}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Items</p>
                  <div className="space-y-2">
                    {viewOrder.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2">
                        <span className="text-sm text-gray-700">{item.name} × {item.quantity}</span>
                        <span className="text-sm font-semibold text-gray-800">Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center bg-orange-50 rounded-xl px-4 py-3">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="font-bold text-orange-600 text-lg">Rs. {viewOrder.totalAmount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[viewOrder.status]}`}>
                    {viewOrder.status}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Update Modal */}
      <AnimatePresence>
        {statusModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setStatusModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-bold text-gray-800">Update Order Status</h2>
                <button onClick={() => setStatusModal(null)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-6 space-y-3">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setNewStatus(s)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition font-medium capitalize ${
                      newStatus === s ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStatusModal(null)}
                    className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={saving}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg transition font-medium disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Update Status"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
