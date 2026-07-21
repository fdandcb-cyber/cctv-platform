"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreditCard, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RazorpayCheckoutProps {
  amount: number;
  quoteData: Record<string, unknown>;
 label?: string;
 className?: string;
 variant?: "default" | "outline" | "secondary";
 size?: "default" | "sm" | "lg";
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: Record<string, string>) => void) => void;
    };
  }
}

export function RazorpayCheckout({
  amount,
  quoteData,
  label = "Pay Now",
  className,
  variant = "default",
  size = "default",
}: RazorpayCheckoutProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const scriptLoaded = useRef(false);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  // Load Razorpay script
  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function handlePay() {
    if (!form.name || !form.phone) return;
    setLoading(true);
    setPaymentStatus("processing");

    try {
      // Create order
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          quoteData,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setPaymentStatus("error");
        setLoading(false);
        alert(data.message || "Failed to create payment order. Is Razorpay configured in .env?");
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: process.env.NEXT_PUBLIC_COMPANY_NAME || "ConnectZ Sales & Services",
        description: "CCTV System Order",
        order_id: data.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        handler: async function (response: Record<string, string>) {
          // Verify payment
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setPaymentStatus("success");
          } else {
            setPaymentStatus("error");
          }
          setLoading(false);
        },
        modal: {
          ondismiss: function () {
            setPaymentStatus("idle");
            setLoading(false);
          },
        },
        theme: { color: "#059669" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setPaymentStatus("error");
        setLoading(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={cn("gap-2", className)}>
          <CreditCard className="h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Complete Payment
          </DialogTitle>
        </DialogHeader>

        {paymentStatus === "success" ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-semibold">Payment Successful!</h3>
            <p className="text-sm text-muted-foreground">
              Your order has been placed. We will contact you shortly.
            </p>
            <Button onClick={() => { setOpen(false); setPaymentStatus("idle"); }} className="mt-2">
              Done
            </Button>
          </div>
        ) : paymentStatus === "error" ? (
          <div className="text-center py-8 space-y-3">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h3 className="text-lg font-semibold">Payment Failed</h3>
            <p className="text-sm text-muted-foreground">
              Please try again or contact us directly.
            </p>
            <Button onClick={() => setPaymentStatus("idle")} variant="outline" className="mt-2">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
              <p className="text-sm text-emerald-700">Total Amount</p>
              <p className="text-3xl font-bold text-emerald-700">{fmt(amount)}</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="rp-name">Full Name *</Label>
                <Input
                  id="rp-name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rp-email">Email (optional)</Label>
                <Input
                  id="rp-email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rp-phone">Phone Number *</Label>
                <Input
                  id="rp-phone"
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handlePay}
              disabled={loading || !form.name || !form.phone}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Pay {fmt(amount)} with Razorpay
                </>
              )}
            </Button>

            <p className="text-[10px] text-center text-muted-foreground">
              Secured by Razorpay. Your payment information is encrypted.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}