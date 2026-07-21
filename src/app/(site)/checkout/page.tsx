import type { Metadata } from "next";
import { CheckoutPage } from "@/components/pages/checkout-page";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your CCTV security system purchase with secure Razorpay payment.",
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}