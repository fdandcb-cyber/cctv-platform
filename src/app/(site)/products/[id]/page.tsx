import type { Metadata } from "next";
import { ProductDetailClient } from "./product-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Loading Product...",
    description: `View product details on ConnectZ — CCTV security cameras and systems.`,
  };
}

export default function ProductDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProductDetailClient />;
}