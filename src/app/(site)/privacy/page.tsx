import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/pages/privacy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read ConnectZ Sales & Services privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyRoute() {
  return <PrivacyPolicyPage />;
}