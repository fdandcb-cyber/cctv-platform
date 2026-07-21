"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  Eye,
  Heart,
  ShieldCheck,
  ArrowRight,
  Users,
  Building2,
  Clock,
  ThumbsUp
} from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Animation helpers ───
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.5 }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true } as const
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// ─── Data ───
const PILLARS = [
  {
    icon: <Target className={cn("h-7 w-7")} />,
    title: "Our Mission",
    description:
      "To provide reliable, affordable, and cutting-edge CCTV security solutions that protect homes, businesses, and communities across India."
  },
  {
    icon: <Eye className={cn("h-7 w-7")} />,
    title: "Our Vision",
    description:
      "To become India's most trusted name in electronic security — known for quality products, expert installation, and unwavering customer support."
  },
  {
    icon: <Heart className={cn("h-7 w-7")} />,
    title: "Our Values",
    description:
      "Integrity, transparency, and customer-first approach drive everything we do. We believe in delivering real value, not just products."
  },
];

const STATS = [
  {
    icon: <ShieldCheck className={cn("h-6 w-6")} />,
    value: "500+",
    label: "Installations"
  },
  {
    icon: <Building2 className={cn("h-6 w-6")} />,
    value: "10+",
    label: "Brand Partners"
  },
  {
    icon: <Clock className={cn("h-6 w-6")} />,
    value: "5+",
    label: "Years Experience"
  },
  {
    icon: <ThumbsUp className={cn("h-6 w-6")} />,
    value: "98%",
    label: "Customer Satisfaction"
  },
];

const TEAM = [
  { name: "Rajesh Kumar", role: "Founder & CEO", initials: "RK" },
  { name: "Priya Sharma", role: "Operations Head", initials: "PS" },
  { name: "Amit Verma", role: "Lead Technician", initials: "AV" },
  { name: "Sneha Patel", role: "Customer Support Lead", initials: "SP" },
];

export function AboutPage() {
  const { } = useAppStore();
  const router = useRouter();

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
            About{" "}
            <span className={cn("text-primary")}>ConnectZ</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className={cn(
              "mt-6 text-lg leading-relaxed text-muted-foreground"
            )}
          >
            ConnectZ Sales &amp; Services is a professional security solutions
            provider specializing in CCTV camera systems, access control, and
            remote monitoring. We serve residential, commercial, and industrial
            clients with customized security setups backed by expert
            installation and after-sales support.
          </motion.p>
        </div>
      </section>

      {/* ── Mission / Vision / Values ── */}
      <section className={cn("px-4 py-16 sm:py-20")}>
        <div className={cn("mx-auto max-w-6xl")}>
          <motion.div {...fadeUp} className={cn("text-center mb-12")}>
            <h2 className={cn("text-3xl font-bold sm:text-4xl")}>
              What Drives Us
            </h2>
            <p className={cn("mt-2 text-muted-foreground")}>
              The principles behind everything we do
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className={cn(
              "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {PILLARS.map((item) => (
              <motion.div key={item.title} {...staggerItem}>
                <Card className={cn("h-full gap-4 py-0")}>
                  <CardContent className={cn("p-6 space-y-4")}>
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      {item.icon}
                    </div>
                    <h3 className={cn("text-xl font-semibold")}>
                      {item.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm leading-relaxed text-muted-foreground"
                      )}
                    >
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section
        className={cn("px-4 py-16 sm:py-20 bg-muted/30")}
      >
        <div className={cn("mx-auto max-w-3xl")}>
          <motion.div {...fadeUp} className={cn("space-y-5")}>
            <h2 className={cn("text-3xl font-bold sm:text-4xl text-center")}>
              Who We Are
            </h2>
            <p className={cn("text-muted-foreground leading-relaxed")}>
              ConnectZ Sales &amp; Services was founded with a single goal: to
              make professional-grade security accessible to everyone. Based in
              India, we work with homeowners, business owners, and industrial
              clients to design and install CCTV systems tailored to their
              specific needs.
            </p>
            <p className={cn("text-muted-foreground leading-relaxed")}>
              With over 5 years of experience in the electronic security
              industry, our team of certified technicians has completed more
              than 500 successful installations. We are authorized dealers for
              top brands including Hikvision, Dahua, CP Plus, Ezviz, Imou, and
              Godrej, ensuring our customers get genuine products with full
              warranty coverage.
            </p>
            <p className={cn("text-muted-foreground leading-relaxed")}>
              Beyond product sales, we offer end-to-end services — from free
              site surveys and custom system design to professional
              installation, remote monitoring setup, and annual maintenance
              contracts. Our commitment to quality and customer satisfaction
              has earned us a 98% satisfaction rate among our clients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={cn("px-4 py-16 sm:py-20")}>
        <div className={cn("mx-auto max-w-6xl")}>
          <motion.div
            {...staggerContainer}
            className={cn(
              "grid gap-6 grid-cols-2 lg:grid-cols-4"
            )}
          >
            {STATS.map((stat) => (
              <motion.div key={stat.label} {...staggerItem}>
                <Card className={cn("h-full gap-4 py-0 text-center")}>
                  <CardContent className={cn("p-6 space-y-3")}>
                    <div
                      className={cn(
                        "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
                      )}
                    >
                      {stat.icon}
                    </div>
                    <p className={cn("text-3xl font-extrabold")}>
                      {stat.value}
                    </p>
                    <p className={cn("text-sm text-muted-foreground")}>
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className={cn("px-4 py-16 sm:py-20 bg-muted/30")}>
        <div className={cn("mx-auto max-w-6xl")}>
          <motion.div {...fadeUp} className={cn("text-center mb-12")}>
            <h2 className={cn("text-3xl font-bold sm:text-4xl")}>
              Meet Our Team
            </h2>
            <p className={cn("mt-2 text-muted-foreground")}>
              Dedicated professionals behind ConnectZ
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className={cn(
              "grid gap-6 grid-cols-2 lg:grid-cols-4"
            )}
          >
            {TEAM.map((member) => (
              <motion.div key={member.name} {...staggerItem}>
                <Card className={cn("h-full gap-4 py-0 text-center")}>
                  <CardContent className={cn("p-6 space-y-3")}>
                    <div
                      className={cn(
                        "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold"
                      )}
                    >
                      {member.initials}
                    </div>
                    <h3 className={cn("font-semibold")}>{member.name}</h3>
                    <p className={cn("text-sm text-muted-foreground")}>
                      {member.role}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={cn("px-4 py-16 sm:py-20")}>
        <div className={cn("mx-auto max-w-4xl")}>
          <motion.div {...fadeUp}>
            <Card
              className={cn(
                "bg-primary text-primary-foreground overflow-hidden py-0 gap-0 border-0"
              )}
            >
              <CardContent
                className={cn("p-8 sm:p-12 text-center space-y-6")}
              >
                <div className={cn("flex justify-center")}>
                  <div
                    className={cn(
                      "p-3 rounded-xl bg-primary-foreground/10"
                    )}
                  >
                    <Users className={cn("h-10 w-10")} />
                  </div>
                </div>
                <div className={cn("space-y-2")}>
                  <h2 className={cn("text-2xl font-bold sm:text-3xl")}>
                    Ready to Secure Your Property?
                  </h2>
                  <p
                    className={cn(
                      "text-primary-foreground/80 text-lg"
                    )}
                  >
                    Get in touch for a free consultation and customized quote
                    tailored to your security needs.
                  </p>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  className={cn("gap-2 text-base px-8")}
                  onClick={() => router.push("/contact")}
                >
                  Get a Free Quote
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