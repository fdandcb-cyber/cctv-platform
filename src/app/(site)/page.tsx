import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home-page";

export const metadata: Metadata = {
  title: "ConnectZ Sales & Services — Professional CCTV Security Solutions",
  description:
    "ConnectZ Sales & Services offers professional CCTV security camera systems for homes, businesses & industries. Browse Hikvision, Dahua, Ezviz products. Free site survey, expert installation.",
};

export default function HomeRoute() {
  return <HomePage />;
}