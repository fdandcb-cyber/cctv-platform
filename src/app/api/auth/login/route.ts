import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { db } from "@/lib/db";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "connectzsalesandservices@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "CCTV@Admin2024!Secure";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password required" }, { status: 400 });
    }

    // Check if admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = signToken({ email, role: "admin" });
      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: { id: "admin", email, name: "Admin", role: "admin", phone: "" },
        token,
      });
    }

    // Check user in database
    const user = await db.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken({ email: user.email, role: user.role });
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, email: user.email, name: user.name || email.split("@")[0], role: user.role, phone: user.phone || "" },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}