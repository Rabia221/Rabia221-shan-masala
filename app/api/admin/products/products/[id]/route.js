import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { verifyAdmin } from "@/lib/auth";
import Product from "@/models/Product";
import { saveImage } from "@/utils/upload";

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;
    const formData = await request.formData();

    const updates = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      category: formData.get("category"),
      stock: parseInt(formData.get("stock")),
    };

    const image = formData.get("image");
    if (image && image.size > 0) {
      updates.image = await saveImage(image, updates.name);
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
