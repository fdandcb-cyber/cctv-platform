import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home-page";

export const metadata: Metadata = {
  title: "ConnectZ — Buy CCTV Security Cameras & Accessories",
  description:
    "ConnectZ is your one-stop shop for genuine CCTV cameras, DVRs, NVRs & accessories. Use our Builder tool, compare cameras, and learn from our guides."
};

export default function HomeRoute() {
  return <HomePage />;
}