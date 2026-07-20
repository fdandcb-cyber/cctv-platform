import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with ConnectZ for CCTV security solutions. Call 7809465102, email connectzsalesandservices@gmail.com, or WhatsApp us.",
};

export default function ContactRoute() {
  return <ContactPage />;
}