import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { verifyAdmin } from "@/lib/auth";
import Category from "@/models/Category";

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    await dbConnect();

    const categories = await Category.find().sort({ createdAt: -1 });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { name, description } = await request.json();

    await dbConnect();

    const category = new Category({ name, description });
    await category.save();

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
