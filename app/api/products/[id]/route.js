import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import "@/models/Category";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const product = await Product.findOne({ _id: params.id, isActive: true }).populate("category");
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}