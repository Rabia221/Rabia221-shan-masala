import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { cookies } from "next/headers";

function getSessionId() {
  let sessionId = cookies().get("cart_session")?.value;
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(7);
    cookies().set("cart_session", sessionId);
  }
  return sessionId;
}

export async function GET(request) {
  try {
    await dbConnect();
    const sessionId = getSessionId();

    let cart = await Cart.findOne({ sessionId }).populate("items.product");

    if (!cart) {
      cart = { items: [], sessionId };
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const sessionId = getSessionId();
    const { productId, quantity } = await request.json();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const sessionId = getSessionId();
    const { productId, quantity } = await request.json();

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter(
          (item) => item.product.toString() !== productId,
        );
      } else {
        item.quantity = quantity;
      }
    }

    await cart.save();
    await cart.populate("items.product");

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
