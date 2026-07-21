import type { Metadata } from "next";
import { DashboardPage } from "@/components/pages/dashboard-page";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "View your orders, profile, and cart on ConnectZ.",
};

export default function DashboardRoute() {
  return <DashboardPage />;
}