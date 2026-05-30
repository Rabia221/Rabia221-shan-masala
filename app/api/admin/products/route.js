import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { verifyAdmin } from "@/lib/auth";
import Product from "@/models/Product";
import "@/models/Category"; // register Category schema for populate
import { getPaginationParams, paginationResult } from "@/utils/pagination";
import { saveImage } from "@/utils/upload";

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
    const search = request.nextUrl.searchParams.get("search") || "";

    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const products = await Product.find(query)
      .populate("category")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);
    const pagination = paginationResult(total, page, limit);

    return NextResponse.json({ products, pagination });
  } catch (error) {
    console.error("Get products error:", error);
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

    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price"));
    const category = formData.get("category");
    const stock = parseInt(formData.get("stock"));
    const image = formData.get("image");

    // validation
    if (!name || !description || isNaN(price) || !category || isNaN(stock)) {
      return NextResponse.json({ error: "Please fill all required fields" }, { status: 400 });
    }

    let imagePath = "/uploads/default.jpg";
    if (image && image.size > 0) {
      imagePath = await saveImage(image, name);
    }

    await dbConnect();

    const product = new Product({ name, description, price, category, stock, image: imagePath });
    await product.save();

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
