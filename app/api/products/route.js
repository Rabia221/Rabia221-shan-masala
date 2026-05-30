import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import "@/models/Category";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;
    const limit    = parseInt(searchParams.get("limit") || "12");
    const page     = parseInt(searchParams.get("page")  || "1");
    const skip     = (page - 1) * limit;
    const search   = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort     = searchParams.get("sort") || "newest";

    const query = { isActive: true };
    if (search)   query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;

    const sortObj = sort === "price_asc" ? { price: 1 } : sort === "price_desc" ? { price: -1 } : { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(query).populate("category").sort(sortObj).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
