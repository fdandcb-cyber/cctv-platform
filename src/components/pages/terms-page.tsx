"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/app-store";
import { ArrowLeft, FileText } from "lucide-react";

export function TermsPage() {
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
              <div className={cn("p-2.5 rounded-xl bg-sky-50 text-sky-600")}>
                <FileText className="h-6 w-6" />
              </div>
              <h1 className={cn("text-3xl font-extrabold tracking-tight sm:text-4xl")}>
                Terms of Service
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
                  <h2 className={cn("text-lg font-semibold text-foreground")}>1. Acceptance of Terms</h2>
                  <p>By accessing and using the ConnectZ Sales &amp; Services website and platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our services. We reserve the right to modify these terms at any time, and continued use of our platform constitutes acceptance of the updated terms.</p>
                </div>

                <Separator />

                <div className={cn("space-y-3")}>
                  <h2 className={cn("text-lg font-semibold text-foreground")}>2. Products and Pricing</h2>
                  <p>All product prices displayed on our platform are in Indian Rupees (INR) and include applicable taxes unless otherwise stated. Prices are subject to change without prior notice. We strive to ensure accuracy in product descriptions and images, but minor variations may occur. Sale prices and promotional offers are available for limited periods and may be withdrawn at any time.</p>
                </div>

                <Separator />

                <div className={cn("space-y-3")}>
                  <h2 className={cn("text-lg font-semibold text-foreground")}>3. Orders and Payment</h2>
                  <p>When you place an order, you are making an offer to purchase the selected products. All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including but not limited to product unavailability, pricing errors, or suspected fraudulent activity. Payments are processed securely through Razorpay, and we do not store your payment card details on our servers.</p>
                </div>

                <Separator />

                <div className={cn("space-y-3")}>
                  <h2 className={cn("text-lg font-semibold text-foreground")}>4. Installation Services</h2>
                  <p>CCTV installation services are quoted separately based on the site survey and system requirements. Installation timelines are estimates and may vary based on project complexity, weather conditions, and material availability. Our technicians are certified professionals, and we guarantee quality workmanship. Any damage caused during installation due to our negligence will be repaired at our cost.</p>
                </div>

                <Separator />

                <div className={cn("space-y-3")}>
                  <h2 className={cn("text-lg font-semibold text-foreground")}>5. Warranty and Returns</h2>
                  <p>All products come with the manufacturer warranty as specified by the brand (typically 1-2 years). Our installation work is guaranteed for 1 year from the date of installation. Returns are accepted within 7 days of delivery for manufacturing defects only, provided the product is in its original packaging and unused condition. Installation charges are non-refundable once the service has been completed.</p>
                </div>

                <Separator />

                <div className={cn("space-y-3")}>
                  <h2 className={cn("text-lg font-semibold text-foreground")}>6. Limitation of Liability</h2>
                  <p>ConnectZ Sales &amp; Services shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our products or services. Our total liability for any claim shall not exceed the amount you paid for the specific product or service giving rise to the claim. We are not responsible for any loss or damage resulting from unauthorized access to your surveillance system.</p>
                </div>

                <Separator />

                <div className={cn("space-y-3")}>
                  <h2 className={cn("text-lg font-semibold text-foreground")}>7. Contact</h2>
                  <p>For questions about these Terms of Service, please contact us:</p>
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