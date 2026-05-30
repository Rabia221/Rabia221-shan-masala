import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    await User.deleteMany({ role: "admin" });
    return NextResponse.json({ success: true, message: "All admin accounts deleted. You can now register a new admin." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
