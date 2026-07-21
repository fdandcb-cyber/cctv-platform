import type { Metadata } from "next";
import { ProductsPage } from "@/components/pages/products-page";

export const metadata: Metadata = {
  title: "CCTV Cameras & Security Systems",
  description:
    "Browse our complete range of CCTV security cameras — Hikvision, Dahua, Ezviz, Imou. Dome, bullet, PTZ, WiFi, 4G cameras. Genuine products with warranty.",
};

export default function ProductsRoute() {
  return <ProductsPage />;
}