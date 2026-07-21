import type { Metadata } from "next";
import { TermsPage } from "@/components/pages/terms-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read ConnectZ terms and conditions for CCTV product purchases.",
};

export default function TermsRoute() {
  return <TermsPage />;
}