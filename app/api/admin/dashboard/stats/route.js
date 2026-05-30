import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { verifyAdmin } from "@/lib/auth";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Category from "@/models/Category";

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    await dbConnect();

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCategories = await Category.countDocuments();

    const revenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("items.product");

    const monthlySales = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        totalOrders,
        totalCategories,
        totalRevenue: revenue[0]?.total || 0,
      },
      recentOrders,
      monthlySales,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
