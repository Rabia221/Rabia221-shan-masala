import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

function generateOrderNumber() {
  return (
    "SHAN-" +
    Date.now() +
    "-" +
    Math.random().toString(36).substring(7).toUpperCase()
  );
}

export async function POST(request) {
  try {
    await dbConnect();

    const { customerDetails, paymentIntentId, items } = await request.json();

    // Verify stock availability
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product?.name || "product"}` },
          { status: 400 },
        );
      }
    }

    // Update stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const orderNumber = generateOrderNumber();
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = new Order({
      orderNumber,
      items,
      totalAmount,
      customerDetails,
      paymentIntentId,
      paymentStatus: "paid",
      status: "pending",
    });

    await order.save();

    // Clear cart
    const sessionId = request.headers.get("cart-session");
    if (sessionId) {
      await Cart.findOneAndDelete({ sessionId });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
