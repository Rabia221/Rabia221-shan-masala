import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.success) {
      return NextResponse.json({
        success: true,
        user: { email: auth.user.email, role: auth.user.role },
      });
    } else {
      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
