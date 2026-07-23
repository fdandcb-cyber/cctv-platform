"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Wrench,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Zap,
  Headphones,
  ShieldAlert,
  Send,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const SUBJECT_OPTIONS = [
  { value: "general", label: "General Inquiry" },
  { value: "quote", label: "Product Quote" },
  { value: "support", label: "Product Support" },
  { value: "partnership", label: "Partnership" },
  { value: "installation", label: "Installation Request" },
];

const CONTACT_CARDS = [
  {
    icon: <Phone className="h-5 w-5" />,      
    title: "Phone",
    detail: BRAND.phone,
    href: `tel:${BRAND.phoneRaw}`,    
    color: "emerald",    
    response: "Instant during business hours",
  },
  {
    icon: <Mail className="h-5 w-5" />,       
    title: "Email",
    detail: BRAND.email,
    href: `mailto:${BRAND.email}`,
    color: "sky",
    response: "Response within 2 hours",
  },
  {
    icon: <MessageCircle className="h-5 w-5" />,
    title: "WhatsApp",
    detail: "Chat with us instantly",
    href: BRAND.whatsapp,
    color: "green",
    response: "Average reply: 5 minutes",
    external: true,
  },
];

const FAQ_ITEMS = [
  {
    q: "What brands do you sell?",
    a: "We are authorized dealers for Hikvision, Dahua, Ezviz, Imou, CP Plus, and Godrej. All products are 100% genuine with full manufacturer warranty.",
  },
  {
    q: "Do you provide installation services?",
    a: "Yes, we offer professional CCTV installation services across India. Our certified technicians ensure proper setup and configuration for optimal performance.",
  },
  {
    q: "How can I get a custom quote?",
    a: "You can use our CCTV Builder tool for an instant online quote, or contact us directly via phone, email, or WhatsApp for a personalized consultation.",
  },
  {
    q: "What is your return policy?",
    a: "Returns are accepted within 7 days of delivery for manufacturing defects only, provided the product is in its original packaging and unused condition.",
  },
  {
    q: "Do you offer EMI or financing options?",
    a: "Yes, we offer EMI options through Razorpay for eligible orders. You can select the EMI option during checkout.",
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-600 dark:text-sky-400",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/40",
    text: "text-green-600 dark:text-green-400",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-600 dark:text-rose-400",
  },
};

/* ------------------------------------------------------------------ */
/*  Contact Page                                                       */
/* ------------------------------------------------------------------ */
export function ContactPage() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you soon.");
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-background">
      Section
      <section className="relative overflow-hidden px-6 lg:px-8 py-24 sm:py-28">
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background via-background/95 to-background/80 before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,oklch(0.6_0.15_160/0.12),transparent_70%)]"
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6"
          >
            <Headphones className="h-4 w-4" />
            We&apos;re Here to Help
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          >
            Get In <span className="text-primary">Touch</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto"
          >
            Have a question, need a quote, or want a free security consultation?
            Reach out through any channel — our team responds within minutes.
          </motion.p>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-emerald-600" />
              Avg. reply: 5 min
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-600" />
              Mon-Sat 9AM-8PM
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Free consultation
            </span>
          </motion.div>
        </div>
      </section>

          QUICK ACTION BUTTONS
      Section
      <section className="px-6 lg:px-8 -mt-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            {...fadeUp}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <a href={`tel:${BRAND.phoneRaw}`}>
              <Card className="rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Call Now</p>
                    <p className="text-sm text-muted-foreground">{BRAND.phone}</p>
                  </div>
                </CardContent>
              </Card>
            </a>

            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">Chat instantly</p>
                  </div>
                </CardContent>
              </Card>
            </a>

            <a href={`mailto:${BRAND.email}`}>
              <Card className="rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Email Us</p>
                    <p className="text-sm text-muted-foreground">Quick response</p>
                  </div>
                </CardContent>
              </Card>
            </a>
          </motion.div>
        </div>
      </section>

          CONTACT INFO + FORM
      Section
      <section className="px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-5">
          
          <motion.div
            {...staggerContainer}
            className="lg:col-span-2 space-y-4"
          >
            {CONTACT_CARDS.map((card) => {
              const colors = COLOR_MAP[card.color] || COLOR_MAP.emerald;
              return (
                <motion.div key={card.title} {...staggerItem}>
                  <a
                    href={card.href}
                    target={card.external ? "_blank" : undefined}
                    rel={card.external ? "noopener noreferrer" : undefined}
                    className="block"
                  >
                    <Card className="rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div
                          className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                            colors.bg,
                            colors.text
                          )}
                        >
                          {card.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold">{card.title}</p>
                          <p className="text-sm text-muted-foreground break-all mt-0.5">
                            {card.detail}
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            {card.response}
                          </p>
                        </div>
                        {card.external && (
                          <ExternalLink className="h-4 w-4 text-muted-foreground/50 flex-shrink-0 mt-1" />
                        )}
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              );
            })}

            
            <motion.div {...staggerItem}>
              <Card className="rounded-2xl border shadow-sm">
                <CardContent className="p-5 flex items-start gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      COLOR_MAP.amber.bg,
                      COLOR_MAP.amber.text
                    )}
                  >
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Business Hours</p>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p className="flex justify-between gap-8">
                        <span>Monday – Saturday</span>
                        <span className="font-medium text-foreground">9:00 AM – 8:00 PM</span>
                      </p>
                      <p className="flex justify-between gap-8">
                        <span>Sunday</span>
                        <span className="font-medium text-foreground">10:00 AM – 6:00 PM</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            
            <motion.div {...staggerItem}>
              <Card className="rounded-2xl border shadow-sm">
                <CardContent className="p-5 flex items-start gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      COLOR_MAP.rose.bg,
                      COLOR_MAP.rose.text
                    )}
                  >
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      ConnectZ Sales & Services, India
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            
            <motion.div {...staggerItem}>
              <Card className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="p-5 flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-amber-800 dark:text-amber-300">
                      Emergency Support
                    </p>
                    <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1 leading-relaxed">
                      For urgent security system issues, call us directly. We prioritize
                      emergency requests and provide same-day remote troubleshooting support.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          
          <motion.div {...fadeUp} className="lg:col-span-3">
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader className="px-8 pt-8 pb-0">
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <CardDescription className="text-base">
                  Fill out the form and we&apos;ll respond within 2 hours during business hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold">Message Sent!</h3>
                      <p className="text-muted-foreground mt-2 max-w-sm">
                        Thank you for reaching out. Our team will get back to you shortly.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Full Name *</Label>
                          <Input
                            id="contact-name"
                            type="text"
                            placeholder="Rahul Sharma"
                            required
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            className="h-11 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-email">Email Address *</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            placeholder="rahul@example.com"
                            required
                            value={form.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            className="h-11 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="contact-phone">Phone Number</Label>
                          <Input
                            id="contact-phone"
                            type="tel"
                            placeholder="9876543210"
                            value={form.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            className="h-11 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-subject">Subject *</Label>
                          <Select
                            value={form.subject}
                            onValueChange={(val) => updateField("subject", val)}
                            required
                          >
                            <SelectTrigger className="h-11 w-full rounded-xl">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {SUBJECT_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-message">Message *</Label>
                        <Textarea
                          id="contact-message"
                          placeholder="Tell us how we can help you..."
                          rows={5}
                          required
                          value={form.message}
                          onChange={(e) => updateField("message", e.target.value)}
                          className="rounded-xl"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 text-base gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

          GOOGLE MAP
      Section
      <section className="px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp}>
            <Card className="rounded-2xl border shadow-sm overflow-hidden">
              <div className="p-6 pb-4">
                <h2 className="text-2xl font-bold">Find Us</h2>
                <p className="text-muted-foreground mt-1">
                  Visit our office or reach out — we&apos;re always happy to help.
                </p>
              </div>
              <div className="h-[350px] sm:h-[400px] bg-muted">
                <iframe
                  title="ConnectZ Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.84916296526!2d77.49085452149588!3d12.95451701349421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      Section
      <section className="px-6 lg:px-8 pb-24 bg-muted/30">
        <div className="mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-3 text-muted-foreground">
              Quick answers to common questions
            </p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-2xl border shadow-sm px-6 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

          BUILDER CTA
      Section
      <section className="px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeUp}>
            <Card className="rounded-2xl border shadow-sm overflow-hidden">
              <CardContent className="p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <Wrench className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      Or Build Your Own CCTV Setup
                    </h3>
                    <p className="text-muted-foreground mt-1 leading-relaxed">
                      Use our interactive builder to design a custom security
                      system and get an instant quote in minutes.
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="gap-2 shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition-all duration-200 hover:shadow-md hover:scale-[1.03]"
                  onClick={() => router.push("/builder")}
                >
                  Open Builder
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
