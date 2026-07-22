"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  FileText,
  Search,
  Printer,
  Download,
  Calendar,
  Tag,
  ScrollText,
  IndianRupee,
  CreditCard,
  RotateCcw,
  AlertTriangle,
  Shield,
  UserCheck,
  Mail,
  GitBranch,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Sections Data                                                      */
/* ------------------------------------------------------------------ */
const TERMS_SECTIONS = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: <ScrollText className="h-5 w-5" />,
    summary: "By using our platform, you agree to these terms.",
    content: `By accessing and using the ConnectZ Sales & Services website and platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our services. We reserve the right to modify these terms at any time, and continued use of our platform constitutes acceptance of the updated terms.

We will notify users of significant changes via email or through a prominent notice on our website. Your continued use of the platform after such changes constitutes your acceptance of the revised terms. It is your responsibility to review these terms periodically.`,
  },
  {
    id: "products",
    title: "Products and Pricing",
    icon: <IndianRupee className="h-5 w-5" />,
    summary: "INR pricing, taxes, and promotional offers.",
    content: `All product prices displayed on our platform are in Indian Rupees (INR) and include applicable taxes unless otherwise stated. Prices are subject to change without prior notice. We strive to ensure accuracy in product descriptions and images, but minor variations may occur due to manufacturer updates.

Sale prices and promotional offers are available for limited periods and may be withdrawn at any time without prior notice. The price applicable to your order will be the price at the time of order placement. We reserve the right to correct any pricing errors and will notify you before processing an order with a corrected price.`,
  },
  {
    id: "orders",
    title: "Orders and Payment",
    icon: <CreditCard className="h-5 w-5" />,
    summary: "Order acceptance, Razorpay payments, and order cancellation.",
    content: `When you place an order, you are making an offer to purchase the selected products. All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including but not limited to product unavailability, pricing errors, or suspected fraudulent activity.

Payments are processed securely through Razorpay, and we do not store your payment card details on our servers. An order confirmation will be sent to your registered email upon successful placement. We accept UPI, credit cards, debit cards, net banking, and EMI through our payment partner.`,
  },
  {
    id: "warranty",
    title: "Warranty and Returns",
    icon: <RotateCcw className="h-5 w-5" />,
    summary: "Manufacturer warranty and 7-day return policy.",
    content: `All products come with the manufacturer warranty as specified by the brand (typically 1-2 years). Warranty claims must be made directly through us with proof of purchase. Returns are accepted within 7 days of delivery for manufacturing defects only, provided the product is in its original packaging and unused condition.

Shipping charges for returns are the responsibility of the customer unless the return is due to our error or a defective product. Products that have been installed, used, or damaged by the customer are not eligible for return. For warranty service, contact our support team with your order details and a description of the issue.`,
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    icon: <AlertTriangle className="h-5 w-5" />,
    summary: "Scope of our liability and disclaimers.",
    content: `ConnectZ shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our products. Our total liability for any claim shall not exceed the amount you paid for the specific product giving rise to the claim.

We are not responsible for any loss or damage resulting from unauthorized access to your surveillance system, improper installation, or failure to follow product instructions. We recommend professional installation for all security systems. Our liability does not extend to third-party products or services integrated with our products.`,
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    icon: <Shield className="h-5 w-5" />,
    summary: "Proper and lawful use of our platform and products.",
    content: `You agree to use our platform and products only for lawful purposes and in compliance with all applicable laws and regulations. Surveillance equipment must be used in accordance with local, state, and national laws, including privacy laws. You are solely responsible for ensuring that your use of any CCTV equipment complies with all applicable legal requirements.

You may not use our platform to distribute malicious software, attempt to gain unauthorized access to our systems, or use automated tools to scrape our content. We reserve the right to terminate accounts that violate these terms. Any illegal use of surveillance equipment is the sole responsibility of the purchaser.`,
  },
  {
    id: "privacy",
    title: "Privacy and Data",
    icon: <UserCheck className="h-5 w-5" />,
    summary: "How your data is handled and your rights.",
    content: `Your use of our platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our platform, you consent to the collection and use of your information as described in the Privacy Policy.

We take your privacy seriously and implement industry-standard security measures to protect your personal data. Your CCTV footage is never accessed by us and remains entirely on your local system. For complete details on data handling, please refer to our Privacy Policy.`,
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: <Mail className="h-5 w-5" />,
    summary: "How to reach us for questions about these terms.",
    content: `For questions about these Terms of Service, please contact us through any of the following channels:

• Email: connectzsalesandservices@gmail.com
• Phone: 7809465102
• WhatsApp: wa.me/917809465102

We aim to respond to all inquiries within 48 hours during business days.`,
  },
];

const RELATED_POLICIES = [
  { label: "Privacy Policy", href: "/privacy", icon: <Shield className="h-4 w-4" /> },
  { label: "Refund Policy", href: "/refund", icon: <RotateCcw className="h-4 w-4" /> },
  { label: "Warranty Information", href: "/learn", icon: <GitBranch className="h-4 w-4" /> },
];

const VERSION_HISTORY = [
  { version: "2.0", date: "July 2025", changes: "Added acceptable use policy, expanded warranty terms, added data section" },
  { version: "1.0", date: "January 2025", changes: "Initial Terms of Service published" },
];

/* ------------------------------------------------------------------ */
/*  Terms Page                                                         */
/* ------------------------------------------------------------------ */
export function TermsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("");

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return TERMS_SECTIONS;
    const q = searchQuery.toLowerCase();
    return TERMS_SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  /* Scroll spy */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    TERMS_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const text = [
      "CONNECTZ SALES & SERVICES",
      "Terms of Service",
      `Version 2.0 | Effective: July 2025`,
      "=".repeat(50),
      "",
      ...TERMS_SECTIONS.flatMap((s) => [
        s.title.toUpperCase(),
        "-".repeat(40),
        s.content.trim(),
        "",
      ]),
      "Contact: connectzsalesandservices@gmail.com | 7809465102",
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ConnectZ_Terms_of_Service.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-5xl">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 -ml-2 mb-8"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-start gap-5"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Terms of Service
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Effective: July 2025
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  Version 2.0
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Content + Sidebar ── */}
      <section className="px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-5xl flex gap-10">
          {/* Sticky TOC (desktop) */}
          <nav className="hidden xl:block w-56 shrink-0" aria-label="Table of contents">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                On This Page
              </p>
              {TERMS_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={cn(
                    "block text-sm py-1.5 transition-colors duration-200 rounded-lg px-3",
                    activeSection === s.id
                      ? "text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {s.title}
                </a>
              ))}

              {/* Related Policies */}
              <div className="pt-4 mt-4 border-t">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Related Policies
                </p>
                {RELATED_POLICIES.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-1.5 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {p.icon}
                    {p.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4 mt-4 border-t flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-2 text-muted-foreground"
                  onClick={handlePrint}
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Page
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-2 text-muted-foreground"
                  onClick={handleDownload}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl"
              />
            </div>

            {filteredSections.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No sections match &ldquo;{searchQuery}&rdquo;
                </p>
              </div>
            ) : (
              <Accordion
                type="multiple"
                defaultValue={TERMS_SECTIONS.map((s) => s.id)}
                className="space-y-4"
              >
                {filteredSections.map((s) => (
                  <AccordionItem
                    key={s.id}
                    value={s.id}
                    id={s.id}
                    className="rounded-2xl border shadow-sm px-6 data-[state=open]:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5 gap-3">
                      <span className="flex items-center gap-3">
                        <span className="text-sky-600 dark:text-sky-400">
                          {s.icon}
                        </span>
                        <span className="font-semibold">{s.title}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-5 whitespace-pre-line">
                      {s.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {/* Version History */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4">Version History</h3>
              <div className="space-y-3">
                {VERSION_HISTORY.map((v) => (
                  <div
                    key={v.version}
                    className="flex items-start gap-4 p-4 rounded-xl border bg-muted/30"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-xs font-bold">
                      {v.version}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{v.date}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {v.changes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile actions */}
            <div className="flex gap-3 mt-8 xl:hidden">
              <Button
                variant="outline"
                className="gap-2 rounded-xl"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button
                variant="outline"
                className="gap-2 rounded-xl"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
