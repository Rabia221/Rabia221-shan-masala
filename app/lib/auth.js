import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "./dbConnect";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export async function verifyAdmin(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return { success: false, error: "Unauthorized" };
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    await dbConnect();
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Invalid token" };
  }
}

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}
