import type { Metadata } from "next";
import { CartPage } from "@/components/pages/cart-page";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your selected CCTV products and proceed to checkout.",
};

export default function CartRoute() {
  return <CartPage />;
}