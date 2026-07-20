"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { motion } from "framer-motion";
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
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Wrench,
  ArrowRight,
  Loader2,
} from "lucide-react";

// ─── Animation helpers ───
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.5 },
};

const SUBJECT_OPTIONS = [
  { value: "general", label: "General Inquiry" },
  { value: "quote", label: "Product Quote" },
  { value: "installation", label: "Installation" },
  { value: "support", label: "Support" },
  { value: "partnership", label: "Partnership" },
];

export function ContactPage() {
  const { setView } = useAppStore();

  const [submitting, setSubmitting] = useState(false);
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

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitting(false);
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  }

  return (
    <div className={cn("min-h-screen bg-background")}>
      {/* ── Hero ── */}
      <section className={cn("relative overflow-hidden px-4 py-20 sm:py-28")}>
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            "bg-gradient-to-b from-background via-background/95 to-background/80",
            "before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,oklch(0.6_0.15_160/0.1),transparent_70%)]"
          )}
        />
        <div className={cn("relative z-10 mx-auto max-w-3xl text-center")}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("text-4xl font-extrabold tracking-tight sm:text-5xl")}
          >
            Get In{" "}
            <span className={cn("text-primary")}>Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className={cn("mt-6 text-lg text-muted-foreground")}
          >
            Have a question or need a quote? We&apos;re here to help.
            Reach out through any channel below or fill in the form.
          </motion.p>
        </div>
      </section>

      {/* ── Contact Content: Two columns ── */}
      <section className={cn("px-4 pb-16 sm:pb-20")}>
        <div
          className={cn(
            "mx-auto max-w-6xl grid gap-8 lg:grid-cols-2"
          )}
        >
          {/* ── Left: Contact Info Cards ── */}
          <motion.div
            {...fadeUp}
            className={cn("space-y-4")}
          >
            {/* Phone */}
            <a href="tel:7809465102" className={cn("block")}>
              <Card className={cn("h-full gap-4 py-0 hover:shadow-md transition-shadow cursor-pointer")}>
                <CardContent className={cn("p-5 flex items-start gap-4")}>
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    <Phone className={cn("h-5 w-5")} />
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium")}>Phone</p>
                    <p className={cn("text-sm text-muted-foreground")}>
                      7809465102
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* Email */}
            <a
              href="mailto:connectzsalesandservices@gmail.com"
              className={cn("block")}
            >
              <Card className={cn("h-full gap-4 py-0 hover:shadow-md transition-shadow cursor-pointer")}>
                <CardContent className={cn("p-5 flex items-start gap-4")}>
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400"
                    )}
                  >
                    <Mail className={cn("h-5 w-5")} />
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium")}>Email</p>
                    <p className={cn("text-sm text-muted-foreground break-all")}>
                      connectzsalesandservices@gmail.com
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/917809465102"
              target="_blank"
              rel="noopener noreferrer"
              className={cn("block")}
            >
              <Card className={cn("h-full gap-4 py-0 hover:shadow-md transition-shadow cursor-pointer")}>
                <CardContent className={cn("p-5 flex items-start gap-4")}>
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400"
                    )}
                  >
                    <MessageCircle className={cn("h-5 w-5")} />
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium")}>WhatsApp</p>
                    <p className={cn("text-sm text-muted-foreground")}>
                      Chat with us instantly
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* Business Hours */}
            <Card className={cn("h-full gap-4 py-0")}>
              <CardContent className={cn("p-5 flex items-start gap-4")}>
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                  )}
                >
                  <Clock className={cn("h-5 w-5")} />
                </div>
                <div>
                  <p className={cn("text-sm font-medium")}>Business Hours</p>
                  <p className={cn("text-sm text-muted-foreground")}>
                    Mon – Sat: 9 AM – 8 PM
                  </p>
                  <p className={cn("text-sm text-muted-foreground")}>
                    Sun: 10 AM – 6 PM
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className={cn("h-full gap-4 py-0")}>
              <CardContent className={cn("p-5 flex items-start gap-4")}>
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                  )}
                >
                  <MapPin className={cn("h-5 w-5")} />
                </div>
                <div>
                  <p className={cn("text-sm font-medium")}>Location</p>
                  <p className={cn("text-sm text-muted-foreground")}>India</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Right: Contact Form ── */}
          <motion.div {...fadeUp}>
            <Card className={cn("gap-0 py-0")}>
              <CardHeader className={cn("px-6 pt-6 pb-0")}>
                <CardTitle className={cn("text-xl")}>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form and we&apos;ll get back to you as soon as
                  possible.
                </CardDescription>
              </CardHeader>
              <CardContent className={cn("p-6")}>
                <form onSubmit={handleSubmit} className={cn("space-y-4")}>
                  {/* Name */}
                  <div className={cn("space-y-2")}>
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      type="text"
                      placeholder="Your full name"
                      required
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>

                  {/* Email */}
                  <div className={cn("space-y-2")}>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>

                  {/* Phone */}
                  <div className={cn("space-y-2")}>
                    <Label htmlFor="contact-phone">Phone</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                  </div>

                  {/* Subject */}
                  <div className={cn("space-y-2")}>
                    <Label htmlFor="contact-subject">Subject</Label>
                    <Select
                      value={form.subject}
                      onValueChange={(val) => updateField("subject", val)}
                    >
                      <SelectTrigger className={cn("w-full")}>
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

                  {/* Message */}
                  <div className={cn("space-y-2")}>
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Tell us how we can help..."
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className={cn("w-full gap-2")}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className={cn("h-4 w-4 animate-spin")} />
                    ) : null}
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── Builder CTA ── */}
      <section className={cn("px-4 pb-16 sm:pb-20")}>
        <div className={cn("mx-auto max-w-4xl")}>
          <motion.div {...fadeUp}>
            <Card
              className={cn(
                "bg-muted/50 overflow-hidden py-0 gap-0"
              )}
            >
              <CardContent
                className={cn("p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6")}
              >
                <div className={cn("flex items-center gap-4")}>
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
                    )}
                  >
                    <Wrench className={cn("h-6 w-6")} />
                  </div>
                  <div>
                    <h3 className={cn("text-lg font-semibold")}>
                      Or build your own CCTV setup
                    </h3>
                    <p className={cn("text-sm text-muted-foreground")}>
                      Use our interactive builder to design a custom security
                      system in minutes.
                    </p>
                  </div>
                </div>
                <Button
                  variant="default"
                  className={cn("gap-2 shrink-0")}
                  onClick={() => setView("builder")}
                >
                  Open Builder
                  <ArrowRight className={cn("h-4 w-4")} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}