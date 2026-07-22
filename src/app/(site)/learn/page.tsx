import type { Metadata } from "next";
import { LearningSystem } from "@/components/learning-system";

export const metadata: Metadata = {
  title: "CCTV Learning Center | ConnectZ - Free CCTV Education Hub",
  description:
    "Master CCTV security systems with our free learning center. Learn camera types, DVR vs NVR, installation guides, compatibility, mobile viewing setup, and budget planning from ConnectZ experts.",
  openGraph: {
    title: "CCTV Learning Center | ConnectZ",
    description: "Free comprehensive CCTV education — camera types, installation, compatibility, mobile viewing, and budget guides.",
    type: "website",
    url: "https://connectz.in/learn",
  },
  twitter: {
    card: "summary_large_image",
    title: "CCTV Learning Center | ConnectZ",
    description: "Free comprehensive CCTV education — camera types, installation, compatibility, mobile viewing, and budget guides.",
  },
};

export default function LearnRoute() {
  return (
    <>
      <LearningSystem />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: "ConnectZ CCTV Learning Center",
            description: "Comprehensive free CCTV security education covering camera types, DVR vs NVR, installation, compatibility, mobile viewing, and budget planning.",
            provider: {
              "@type": "Organization",
              name: "ConnectZ",
              url: "https://connectz.in",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-7809465102",
                contactType: "sales",
              },
            },
            educationalLevel: "Beginner to Advanced",
            inLanguage: "en",
            learningResourceType: "educational article",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://connectz.in" },
              { "@type": "ListItem", position: 2, name: "Learning Center", item: "https://connectz.in/learn" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Can I use a Hikvision camera with a Dahua DVR?", acceptedAnswer: { "@type": "Answer", text: "In most cases, NO. Hikvision cameras use HD-TVI technology and Dahua DVRs use HD-CVI technology. They are different signal standards. However, IP-based cameras + NVRs usually work via ONVIF protocol." } },
              { "@type": "Question", name: "Do I need internet for CCTV to work?", acceptedAnswer: { "@type": "Answer", text: "No! Your CCTV system works perfectly without internet. Internet is only needed for remote mobile viewing and cloud backup." } },
              { "@type": "Question", name: "How long does CCTV footage get stored?", acceptedAnswer: { "@type": "Answer", text: "With motion-only recording on a 1TB HDD with 4 cameras (2MP): approximately 15-20 days. With 24/7 recording: approximately 7-10 days." } },
            ],
          }),
        }}
      />
    </>
  );
}
