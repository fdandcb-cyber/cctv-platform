import type { Metadata } from "next";
import { ServicesPage } from "@/components/pages/services-page";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Professional CCTV installation, site survey, AMC support, remote monitoring, and access control services by ConnectZ.",
};

export default function ServicesRoute() {
  return <ServicesPage />;
}