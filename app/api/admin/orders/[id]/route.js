import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { verifyAdmin } from "@/lib/auth";
import Order from "@/models/Order";

export async function GET(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.success) return NextResponse.json({ error: auth.error }, { status: 401 });

    await dbConnect();
    const order = await Order.findById(params.id).populate("items.product");
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.success) return NextResponse.json({ error: auth.error }, { status: 401 });

    await dbConnect();
    const { status } = await request.json();
    const order = await Order.findByIdAndUpdate(params.id, { status }, { new: true });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.success) return NextResponse.json({ error: auth.error }, { status: 401 });

    await dbConnect();
    const order = await Order.findByIdAndDelete(params.id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
