import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "connectzsalesandservices@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "CCTV@Admin2024!Secure";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password required" }, { status: 400 });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ email, role: "admin" });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: { email, role: "admin" },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}