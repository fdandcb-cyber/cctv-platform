import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });
    }
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 409 });
    }
    const user = await db.user.create({
      data: { email, name, password, role: "customer", phone },
    });
    const token = signToken({ email: user.email, role: user.role });
    return NextResponse.json({
      success: true,
      message: "Account created",
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone || "" },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
