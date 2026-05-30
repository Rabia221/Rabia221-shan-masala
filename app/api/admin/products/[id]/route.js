import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { verifyAdmin } from "@/lib/auth";
import Product from "@/models/Product";
import "@/models/Category";
import { saveImage } from "@/utils/upload";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id).populate("category");
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.success) return NextResponse.json({ error: auth.error }, { status: 401 });

    await dbConnect();

    const formData = await request.formData();
    const updateData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      category: formData.get("category"),
      stock: parseInt(formData.get("stock")),
    };

    const image = formData.get("image");
    if (image && image.size > 0) {
      updateData.image = await saveImage(image, updateData.name);
    }

    const product = await Product.findByIdAndUpdate(params.id, updateData, { new: true });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.success) return NextResponse.json({ error: auth.error }, { status: 401 });

    await dbConnect();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
