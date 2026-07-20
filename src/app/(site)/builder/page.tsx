import type { Metadata } from "next";
import { CctvBuilder } from "@/components/cctv-builder";

export const metadata: Metadata = {
  title: "CCTV System Builder",
  description:
    "Design your custom CCTV security system with our interactive builder. Get a personalized quote instantly.",
};

export default function BuilderRoute() {
  return <CctvBuilder />;
}