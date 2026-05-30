import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { verifyAdmin } from "@/lib/auth";
import Order from "@/models/Order";
import { getPaginationParams, paginationResult } from "@/utils/pagination";

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    await dbConnect();

    const { page, limit, skip } = getPaginationParams(
      request.nextUrl.searchParams,
    );

    const orders = await Order.find()
      .populate("items.product")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments();
    const pagination = paginationResult(total, page, limit);

    return NextResponse.json({ orders, pagination });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
