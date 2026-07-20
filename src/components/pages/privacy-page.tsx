"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/app-store";
import { ArrowLeft, Shield } from "lucide-react";

export function PrivacyPolicyPage() {
  const { setView } = useAppStore();

  return (
    <div className={cn("min-h-screen bg-background")}>
      <section className={cn("px-4 py-20 sm:py-28")}>
        <div className={cn("mx-auto max-w-3xl")}>
          <Button
            variant="ghost"
            size="sm"
            className={cn("gap-1.5 -ml-2 mb-8")}
            onClick={() => setView("home")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={cn("flex items-center gap-3 mb-6")}>
              <div className={cn("p-2.5 rounded-xl bg-emerald-50 text-emerald-600")}>
                <Shield className="h-6 w-6" />
              </div>
              <h1 className={cn("text-3xl font-extrabold tracking-tight sm:text-4xl")}>
                Privacy Policy
              </h1>
            </div>
            <p className={cn("text-sm text-muted-foreground mb-8")}>
              Last updated: July 2025
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn("space-y-6")}
          >
            <Card className={cn("py-0 gap-0")}>
              <CardContent className={cn("p-6 sm:p-8 space-y-6 text-sm leading-relaxed text-muted-foreground")}>
                <div className={cn("space-y-3")}>
                  <h2 className={cn("text-lg font-semibold text-foreground")}>1. Information We Collect</h2>
                  <p>We collect information you provide directly to us, including your name, email address, phone number, shipping address, and payment information when you place an order or create an account. We also collect information about your browsing behavior and preferences on our platform.</p>
                </div>

                <Separator />

                <div className={cn("space-y-3")}>
                  <h2 className={cn("text-lg font-semibold text-foreground")}>2. How We Use Your Information</h2>
                  <p>We use the information we collect to process your orders, communicate with you about products and services, provide customer support, improve our website and services, send you promotional communications (with your consent), and comply with legal obligations. Your security camera footage and surveillance data remain entirely on your local system and are never accessed by us.</p>
                </div>

                <Separator />

                <div className={cn("space-y-3")}>
                  <h2 className={cn("text-lg font-semibold text-foreground")}>3. Information Sharing</h2>
                  <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, processing payments, or delivering orders. We may also share information when required by law or to protect our legal rights.</p>
                </div>

                <Separator />

                <div className={cn("space-y-3")}>
                  <h2 className={cn("text-lg font-semibold text-foreground")}>4. Data Security</h2>
                  <p>We implement industry-standard security measures to protect your personal information, including SSL encryption, secure payment processing through Razorpay, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
                </div>

                <Separator />

                <div className={cn("space-y-3")}>
                  <h2 className={cn("text-lg font-semibold text-foreground")}>5. Cookies</h2>
                  <p>We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, analyze site traffic, and deliver personalized content. You can control cookies through your browser settings, though disabling cookies may affect site functionality.</p>
                </div>

                <Separator />

                <div className={cn("space-y-3")}>
                  <h2 className={cn("text-lg font-semibold text-foreground")}>6. Your Rights</h2>
                  <p>You have the right to access, correct, or delete your personal information. You may update your account details at any time through your dashboard. To request deletion of your account and associated data, please contact us at connectzsalesandservices@gmail.com.</p>
                </div>

                <Separator />

                <div className={cn("space-y-3")}>
                  <h2 className={cn("text-lg font-semibold text-foreground")}>7. Contact Us</h2>
                  <p>If you have questions about this Privacy Policy, please contact us:</p>
                  <ul className={cn("list-disc list-inside space-y-1")}>
                    <li>Email: connectzsalesandservices@gmail.com</li>
                    <li>Phone: 7809465102</li>
                    <li>WhatsApp: wa.me/917809465102</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}