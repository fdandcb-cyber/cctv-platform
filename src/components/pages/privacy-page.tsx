"use client";

import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft, Shield, Search, Printer, Download,
  Calendar, Tag, Database, Eye, Lock, Cookie, UserCheck, Mail, FileCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

const S1 = "We collect information you provide directly to us, including your name, email address, phone number, shipping address, and payment information when you place an order or create an account. We also collect information about your browsing behavior and preferences on our platform, including pages visited, products viewed, search queries, and device information. This helps us improve our services and provide personalized recommendations tailored to your security needs.\n\nAdditionally, we may collect location data (with your consent) to provide location-specific product availability and delivery estimates. We use cookies and similar technologies to track session information and remember your preferences between visits.";

const S2 = "We use the information we collect to process your orders, communicate with you about products and services, provide customer support, improve our website and services, send you promotional communications (with your consent), and comply with legal obligations. Your security camera footage and surveillance data remain entirely on your local system and are never accessed by us.\n\nWe use aggregated, anonymized data to analyze trends and improve our product offerings. If you opt into marketing communications, we may send you information about new products, special offers, and security tips relevant to your interests. You can unsubscribe from marketing emails at any time through the link provided in each email.";

const S3 = "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, processing payments through Razorpay, or delivering orders through logistics partners. We may also share information when required by law or to protect our legal rights.\n\nOur logistics partners receive only the information necessary for delivery (name, address, phone number). Payment processors receive only the transaction-specific data required to complete your purchase. All third-party service providers are bound by confidentiality agreements and are prohibited from using your data for any purpose other than providing the contracted service.";

const S4 = "We implement industry-standard security measures to protect your personal information, including SSL encryption for all data in transit, secure payment processing through Razorpay (PCI-DSS compliant), and strict access controls limiting who can access your data. We conduct regular security audits and vulnerability assessments to ensure our systems remain secure.\n\nHowever, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security. We encourage you to use strong passwords and to contact us immediately if you suspect any unauthorized access to your account. In the event of a data breach, we will notify affected users within 72 hours as required by applicable laws.";

const S5 = "We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences (such as theme and language settings), analyze site traffic and usage patterns, and deliver personalized content and product recommendations. We use both first-party cookies (set by us) and third-party cookies (set by our analytics and payment partners).\n\nEssential cookies are required for the website to function properly and cannot be disabled. Analytics cookies help us understand how visitors interact with our website. You can control non-essential cookies through your browser settings, though disabling certain cookies may affect site functionality. We respect Do Not Track signals where supported by your browser.";

const S6 = "You have the right to access, correct, or delete your personal information at any time. You may update your account details through your dashboard. To request deletion of your account and associated data, please contact us at connectzsalesandservices@gmail.com. We will process such requests within 30 days.\n\nYou also have the right to data portability. We can provide your data in a machine-readable format upon request. You may withdraw consent for marketing communications at any time. If you believe we have processed your data incorrectly, you have the right to lodge a complaint with the relevant data protection authority.";

const S7 = "If you have questions about this Privacy Policy or how we handle your data, please contact us through any of the following channels:\n\nEmail: connectzsalesandservices@gmail.com\nPhone: 7809465102\nWhatsApp: wa.me/917809465102\n\nWe aim to respond to all privacy-related inquiries within 48 hours during business days.";

const POLICY_SECTIONS = [
  { id: "info-collect", title: "Information We Collect", icon: <Database className="h-5 w-5" />, summary: "Personal details, browsing data, and preferences.", content: S1 },
  { id: "how-we-use", title: "How We Use Your Information", icon: <Eye className="h-5 w-5" />, summary: "Order processing, communication, and service improvement.", content: S2 },
  { id: "data-sharing", title: "Information Sharing", icon: <FileCheck className="h-5 w-5" />, summary: "We never sell your data. Shared only with trusted partners.", content: S3 },
  { id: "data-security", title: "Data Security", icon: <Lock className="h-5 w-5" />, summary: "SSL encryption, secure payments, and access controls.", content: S4 },
  { id: "cookies", title: "Cookies & Tracking", icon: <Cookie className="h-5 w-5" />, summary: "Essential, analytics, and preference cookies.", content: S5 },
  { id: "your-rights", title: "Your Rights", icon: <UserCheck className="h-5 w-5" />, summary: "Access, correct, delete, and export your data.", content: S6 },
  { id: "contact", title: "Contact Us", icon: <Mail className="h-5 w-5" />, summary: "Email, phone, and WhatsApp channels available.", content: S7 },
];

export function PrivacyPolicyPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("");

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return POLICY_SECTIONS;
    const q = searchQuery.toLowerCase();
    return POLICY_SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    POLICY_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleDownload = () => {
    const text = [
      "CONNECTZ SALES & SERVICES",
      "Privacy Policy",
      "Version 2.0 | Last Updated: July 2025",
      "=".repeat(50), "",
      ...POLICY_SECTIONS.flatMap((s) => [s.title.toUpperCase(), "-".repeat(40), s.content.trim(), ""]),
      "Contact: connectzsalesandservices@gmail.com | 7809465102",
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "ConnectZ_Privacy_Policy.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-5xl">
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 mb-8" onClick={() => router.push("/")}> <ArrowLeft className="h-4 w-4" /> Back to Home </Button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"> <Shield className="h-7 w-7" /> </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Last updated: July 2025</span>
                <span className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" />Version 2.0</span>
              </div>
            </div>
          </motion.div>
          {/* Summary cards */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-10">
            {POLICY_SECTIONS.slice(0, 6).map((s) => (
              <a key={s.id} href={`#${s.id}`} className="group">
                <Card className="rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer h-full">
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="mx-auto text-muted-foreground group-hover:text-primary transition-colors">{s.icon}</div>
                    <p className="text-xs font-medium leading-tight">{s.title}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-5xl flex gap-10">
          {/* Sticky TOC - desktop only */}
          <nav className="hidden xl:block w-56 shrink-0" aria-label="Table of contents">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">On This Page</p>
              {POLICY_SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className={cn("block text-sm py-1.5 transition-colors duration-200 rounded-lg px-3", activeSection === s.id ? "text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/30" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>{s.title}</a>
              ))}
              <div className="pt-4 mt-4 border-t flex flex-col gap-2">
                <Button variant="ghost" size="sm" className="justify-start gap-2 text-muted-foreground" onClick={() => window.print()}> <Printer className="h-3.5 w-3.5" /> Print Page </Button>
                <Button variant="ghost" size="sm" className="justify-start gap-2 text-muted-foreground" onClick={handleDownload}> <Download className="h-3.5 w-3.5" /> Download </Button>
              </div>
            </div>
          </nav>
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="relative mb-8">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search policy..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-11 rounded-xl" />
            </div>
            {filteredSections.length === 0 ? (
              <div className="text-center py-16"><Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" /><p className="text-muted-foreground">No sections match &ldquo;{searchQuery}&rdquo;</p></div>
            ) : (
              <Accordion type="multiple" defaultValue={POLICY_SECTIONS.map((s) => s.id)} className="space-y-4">
                {filteredSections.map((s) => (
                  <AccordionItem key={s.id} value={s.id} id={s.id} className="rounded-2xl border shadow-sm px-6 data-[state=open]:shadow-md transition-shadow">
                    <AccordionTrigger className="text-left hover:no-underline py-5 gap-3">
                      <span className="flex items-center gap-3"><span className="text-emerald-600 dark:text-emerald-400">{s.icon}</span><span className="font-semibold">{s.title}</span></span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-5 whitespace-pre-line">{s.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            <div className="flex gap-3 mt-8 xl:hidden">
              <Button variant="outline" className="gap-2 rounded-xl" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print </Button>
              <Button variant="outline" className="gap-2 rounded-xl" onClick={handleDownload}><Download className="h-4 w-4" /> Download </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
