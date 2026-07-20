import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: NextRequest) {
  try {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, message: "Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env" },
        { status: 500 }
      );
    }

    const { amount, customerName, customerEmail, customerPhone, quoteData } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid amount" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `cctv_${Date.now()}`,
      notes: {
        customerName: customerName || "",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
      },
    });

    // Store order in database
    const { db } = await import("@/lib/db");
    const dbOrder = await db.order.create({
      data: {
        razorpayOrderId: order.id,
        customerName: customerName || "Walk-in Customer",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
        quoteData: JSON.stringify(quoteData || {}),
        totalAmount: amount,
        status: "pending",
        paymentMethod: "razorpay",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      dbOrderId: dbOrder.id,
      key: RAZORPAY_KEY_ID,
    });
  } catch (error: unknown) {
    console.error("Razorpay order error:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}