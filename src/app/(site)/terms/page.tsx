import type { Metadata } from "next";
import { TermsPage } from "@/components/pages/terms-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read ConnectZ Sales & Services terms and conditions for CCTV product purchases and services.",
};

export default function TermsRoute() {
  return <TermsPage />;
}