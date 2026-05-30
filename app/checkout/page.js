"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FiArrowLeft, FiLock, FiCreditCard, FiDollarSign } from "react-icons/fi";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CARD_STYLE = {
  style: {
    base: { fontSize: "15px", color: "#1f2937", fontFamily: "inherit", "::placeholder": { color: "#9ca3af" } },
    invalid: { color: "#ef4444" },
  },
};

function CheckoutForm({ items, total, shipping, grandTotal }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardComplete, setCardComplete] = useState(false);
  const [details, setDetails] = useState({ name: "", email: "", phone: "", address: "", city: "" });

  const set = (f) => (e) => setDetails((d) => ({ ...d, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (paymentMethod === "cod") {
        await axios.post("/api/orders", {
          customerDetails: details,
          paymentIntentId: "COD-" + Date.now(),
          paymentMethod: "cod",
          items: items.map((i) => ({ product: i.product._id, name: i.product.name, quantity: i.quantity, price: i.product.price })),
        });
        clearCart();
        toast.success("Order placed! Pay on delivery.");
        router.push("/checkout/success");
      } else {
        if (!stripe || !elements) return;
        const { data } = await axios.post("/api/payment/create-payment-intent", {
          items: items.map((i) => ({ price: i.product.price, quantity: i.quantity })),
        });
        const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: { card: elements.getElement(CardElement), billing_details: { name: details.name, email: details.email } },
        });
        if (error) { toast.error(error.message); setProcessing(false); return; }
        await axios.post("/api/orders", {
          customerDetails: details,
          paymentIntentId: paymentIntent.id,
          paymentMethod: "card",
          items: items.map((i) => ({ product: i.product._id, name: i.product.name, quantity: i.quantity, price: i.product.price })),
        });
        clearCart();
        toast.success("Payment successful! Order placed.");
        router.push("/checkout/success");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong. Please try again.");
      setProcessing(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition";
  const canSubmit = paymentMethod === "cod" || cardComplete;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name *</label>
                <input required value={details.name} onChange={set("name")} placeholder="Muhammad Ali" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email *</label>
                <input required type="email" value={details.email} onChange={set("email")} placeholder="ali@example.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone *</label>
                <input required value={details.phone} onChange={set("phone")} placeholder="03XX-XXXXXXX" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Street Address *</label>
                <input required value={details.address} onChange={set("address")} placeholder="House #, Street, Area" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">City *</label>
                <input required value={details.city} onChange={set("city")} placeholder="Karachi" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
              Payment Method
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <button type="button" onClick={() => setPaymentMethod("cod")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition text-left ${paymentMethod === "cod" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === "cod" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                  <FiDollarSign size={18} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${paymentMethod === "cod" ? "text-orange-700" : "text-gray-700"}`}>Cash on Delivery</p>
                  <p className="text-xs text-gray-400">Pay when delivered</p>
                </div>
              </button>

              <button type="button" onClick={() => setPaymentMethod("card")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition text-left ${paymentMethod === "card" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === "card" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                  <FiCreditCard size={18} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${paymentMethod === "card" ? "text-orange-700" : "text-gray-700"}`}>Credit / Debit Card</p>
                  <p className="text-xs text-gray-400">Powered by Stripe</p>
                </div>
              </button>
            </div>

            <AnimatePresence>
              {paymentMethod === "cod" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💵</span>
                    <div>
                      <p className="text-sm font-bold text-green-800">Cash on Delivery Selected</p>
                      <p className="text-xs text-green-600 mt-1">You will pay Rs. {grandTotal.toLocaleString()} in cash when delivered.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {paymentMethod === "card" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <div className="flex items-center gap-2 mb-3">
                    <FiLock size={12} className="text-green-500" />
                    <span className="text-xs text-gray-400">256-bit SSL encrypted</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
                    <CardElement options={CARD_STYLE} onChange={(e) => setCardComplete(e.complete)} />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Test: <span className="font-mono">4242 4242 4242 4242</span></p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="font-extrabold text-gray-900 text-base mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-orange-50 flex-shrink-0">
                    {item.product.image ? (
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    ) : <div className="flex items-center justify-center h-full text-xl">🌶️</div>}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-400">Rs. {item.product.price} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2.5 mb-5">
              <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span className="font-semibold text-gray-700">Rs. {total.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm text-gray-500"><span>Shipping</span><span className={`${shipping === 0 ? "text-green-500" : "text-gray-700"}`}>{shipping === 0 ? "FREE" : `Rs. ${shipping}`}</span></div>
              <div className="flex justify-between pt-3 border-t border-gray-100"><span className="font-extrabold text-gray-900">Total</span><span className="font-extrabold text-orange-600 text-xl">Rs. {grandTotal.toLocaleString()}</span></div>
            </div>

            <motion.button type="submit" disabled={processing || !canSubmit} whileHover={{ scale: processing ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-2xl font-bold text-sm transition shadow-lg">
              {processing ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Processing...</> : paymentMethod === "cod" ? <>💵 Place Order (Pay on Delivery)</> : <><FiLock size={14} /> Pay Rs. {grandTotal.toLocaleString()}</>}
            </motion.button>

            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              <FiLock size={11} /> Secure checkout
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const { cart, loading } = useCart();
  const items = cart?.items || [];
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = total > 2000 ? 0 : 200;
  const grandTotal = total + shipping;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div>;
  if (items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link href="/products" className="text-orange-500 font-bold hover:underline">Browse Products</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
            <p className="text-gray-400 text-sm mt-1">Complete your order securely</p>
          </div>
          <Link href="/cart" className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition font-medium">
            <FiArrowLeft size={15} /> Back to Cart
          </Link>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm items={items} total={total} shipping={shipping} grandTotal={grandTotal} />
        </Elements>
      </div>
    </div>
  );
}