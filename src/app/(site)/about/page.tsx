import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about-page";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about ConnectZ Sales & Services — our mission, team, and 5+ years of expertise in CCTV security solutions across India.",
};

export default function AboutRoute() {
  return <AboutPage />;
}