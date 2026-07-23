"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
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
  ThumbsUp,
 Award,
  Quote,
  Star,
  CheckCircle2,
 Phone,
  TrendingUp,
  MapPin,
  Briefcase,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Animated Counter                                                   */
/* ------------------------------------------------------------------ */
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const PILLARS = [
  {
    icon: <Target className="h-7 w-7" />,
    title: "Our Mission",
    description:
      "To provide reliable, affordable, and cutting-edge CCTV security solutions that protect homes, businesses, and communities across India. We strive to democratize access to professional-grade surveillance technology, ensuring that every property owner can benefit from advanced security regardless of their technical expertise or budget constraints.",
  },
  {
    icon: <Eye className="h-7 w-7" />,
    title: "Our Vision",
    description:
      "To become India's most trusted CCTV equipment supplier — known for genuine products, competitive pricing, and tools that help customers make informed decisions. We envision a future where security technology is seamlessly integrated into every home and business, powered by expert guidance and transparent practices.",
  },
  {
    icon: <Heart className="h-7 w-7" />,
    title: "Our Values",
    description:
      "Integrity, transparency, and a customer-first approach drive everything we do. We believe in delivering real value, not just products. Every interaction is guided by our commitment to honest advice, genuine products, and long-term relationships built on trust and reliability.",
  },
];

const STATS = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    value: 500,
    suffix: "+",
    label: "Products Delivered",
    description: "Security systems installed nationwide",
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    value: 10,
    suffix: "+",
    label: "Brand Partners",
    description: "Authorized dealer partnerships",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    value: 5,
    suffix: "+",
    label: "Years Experience",
    description: "In electronic security industry",
  },
  {
    icon: <ThumbsUp className="h-6 w-6" />,
    value: 98,
    suffix: "%",
    label: "Customer Satisfaction",
    description: "Based on post-installation surveys",
  },
];

const TIMELINE = [
  {
    year: "2020",
    title: "Founded",
    description:
      "ConnectZ was established with a vision to make professional CCTV security accessible to everyone in India, starting as a small local supplier.",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    year: "2021",
    title: "Brand Partnerships",
    description:
      "Secured authorized dealer partnerships with Hikvision, Dahua, Ezviz, and Imou, expanding our product catalog significantly.",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    year: "2023",
    title: "Digital Platform Launch",
    description:
      "Launched our e-commerce platform with the interactive CCTV Builder tool and comprehensive Learning Center for customer education.",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    year: "2024",
    title: "500+ Installations",
    description:
      "Crossed the milestone of 500 successful security system deliveries with a 98% customer satisfaction rate across India.",
    icon: <Award className="h-5 w-5" />,
  },
  {
    year: "2025",
    title: "AI-Powered Solutions",
    description:
      "Expanded into AI-powered surveillance with smart analytics, and introduced advanced comparison tools and consultation services.",
    icon: <Star className="h-5 w-5" />,
  },
];

const TEAM = [
  {
    name: "Rajesh Kumar",
    role: "Founder & CEO",
    initials: "RK",
    bio: "15+ years in electronic security. Founded ConnectZ to bridge the gap between quality CCTV products and Indian customers.",
  },
  {
    name: "Priya Sharma",
    role: "Operations Head",
    initials: "PS",
    bio: "Expert in supply chain management ensuring genuine products reach customers with full warranty coverage.",
  },
  {
    name: "Amit Verma",
    role: "Lead Technician",
    initials: "AV",
    bio: "Certified CCTV installation specialist with 10+ years of hands-on experience in residential and commercial setups.",
  },
  {
    name: "Sneha Patel",
    role: "Customer Support Lead",
    initials: "SP",
    bio: "Passionate about customer experience, ensuring every query is resolved within 24 hours with personalized solutions.",
  },
];

const TESTIMONIALS = [
  {
    name: "Vikram Reddy",
    role: "Homeowner, Hyderabad",
    text: "ConnectZ helped me design the perfect 4-camera system for my home. The Builder tool was incredibly easy to use, and the team ensured seamless installation. Highly recommended!",
    rating: 5,
  },
  {
    name: "Anita Deshmukh",
    role: "Restaurant Owner, Pune",
    text: "We needed a comprehensive CCTV system for our restaurant. ConnectZ provided genuine Hikvision cameras at the best price, and their after-sales support has been outstanding.",
    rating: 5,
  },
  {
    name: "Suresh Menon",
    role: "Warehouse Manager, Chennai",
    text: "As a business owner, security is paramount. ConnectZ understood our requirements and delivered a 16-camera setup that covers every corner of our warehouse. Professional service!",
    rating: 5,
  },
];

const BRANDS = ["Hikvision", "Dahua", "Ezviz", "Imou", "CP Plus", "Godrej"];

const CERTIFICATIONS = [
  "Authorized Hikvision Dealer",
  "Authorized Dahua Partner",
  "Certified CCTV Installer",
  "Razorpay Verified Merchant",
];

/* ------------------------------------------------------------------ */
/*  About Page                                                         */
/* ------------------------------------------------------------------ */
export function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden px-6 lg:px-8 py-24 sm:py-32">
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background via-background/95 to-background/80 before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,oklch(0.6_0.15_160/0.12),transparent_70%)]"
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6"
          >
            <ShieldCheck className="h-4 w-4" />
            Trusted Since 2020
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          >
            About{" "}
            <span className="text-primary">ConnectZ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto"
          >
            ConnectZ is a trusted CCTV equipment supplier specializing in
            security cameras, recorders, and accessories. We provide genuine
            products from top brands along with interactive tools like our CCTV
            Builder and Learning Center to help you design the perfect security
            setup.
          </motion.p>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              100% Genuine
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Full Warranty
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-emerald-600" />
              Expert Support
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Pan-India Delivery
            </span>
          </motion.div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl font-bold sm:text-4xl">What Drives Us</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              The principles behind everything we do
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {PILLARS.map((item) => (
              <motion.div key={item.title} {...staggerItem}>
                <Card className="h-full rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardContent className="p-8 space-y-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-24 bg-muted/30">
        <div className="mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="space-y-6">
            <h2 className="text-3xl font-bold sm:text-4xl text-center">
              Who We Are
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              ConnectZ was founded with a single goal: to make professional-grade
              CCTV equipment accessible to everyone. Based in India, we supply
              homeowners, business owners, and industrial clients with genuine
              security products from authorized channels. Our journey began with
              a small shop and has grown into a trusted online platform serving
              customers across the nation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              With over 5 years of experience in the electronic security
              industry, we have served more than 500 customers across India. We
              are authorized dealers for top brands including Hikvision, Dahua,
              CP Plus, Ezviz, Imou, and Godrej, ensuring every product we sell
              is 100% genuine with full manufacturer warranty coverage. Our team
              carefully vets every supplier and product before it reaches our
              catalog.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Beyond just selling products, we provide powerful tools — our CCTV
              Builder helps you design a complete security system with an instant
              quote, the Learning Center teaches you everything about camera types
              and setup, and the Compare tool lets you evaluate cameras
              side-by-side. Our commitment to quality and transparency has earned
              us a 98% satisfaction rate, making us one of the most trusted names
              in Indian CCTV retail.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl font-bold sm:text-4xl">By The Numbers</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Our growth reflects our commitment to excellence
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid gap-8 grid-cols-2 lg:grid-cols-4"
          >
            {STATS.map((stat) => (
              <motion.div key={stat.label} {...staggerItem}>
                <Card className="h-full rounded-2xl border shadow-sm text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardContent className="p-8 space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {stat.icon}
                    </div>
                    <p className="text-4xl font-extrabold">
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                      />
                    </p>
                    <p className="font-semibold">{stat.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-24 bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl font-bold sm:text-4xl">Our Journey</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Key milestones in ConnectZ&apos;s growth
            </p>
          </motion.div>

          <div className="relative">
            
            <div className="absolute left-6 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 bg-border" aria-hidden="true" />

            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={cn(
                  "relative flex items-start gap-6 sm:gap-0 pb-12 last:pb-0",
                  i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                )}
              >
                
                <div
                  className={cn(
                    "absolute left-6 sm:left-1/2 -translate-x-1/2 z-10",
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    "bg-background border-2 border-primary text-primary"
                  )}
                >
                  {item.icon}
                </div>

                
                <div
                  className={cn(
                    "ml-16 sm:ml-0 sm:w-[calc(50%-2rem)]",
                    i % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8 sm:text-left"
                  )}
                >
                  <span className="text-sm font-bold text-primary">{item.year}</span>
                  <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl font-bold sm:text-4xl">Our Partners</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Authorized dealer for industry-leading brands
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid gap-6 grid-cols-3 sm:grid-cols-6"
          >
            {BRANDS.map((brand) => (
              <motion.div key={brand} {...staggerItem}>
                <Card className="rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-4 sm:p-6 flex items-center justify-center h-20 sm:h-24">
                    <span className="text-sm sm:text-base font-bold text-muted-foreground/70 text-center">
                      {brand}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          
          <motion.div
            {...fadeUp}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-sm font-medium"
              >
                <Award className="h-4 w-4" />
                {cert}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl font-bold sm:text-4xl">Meet Our Team</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Dedicated professionals behind ConnectZ
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {TEAM.map((member) => (
              <motion.div key={member.name} {...staggerItem}>
                <Card className="h-full rounded-2xl border shadow-sm text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardContent className="p-8 space-y-4">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold ring-4 ring-primary/10">
                      {member.initials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-primary font-medium mt-0.5">
                        {member.role}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl font-bold sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Real feedback from our valued customers
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid gap-8 md:grid-cols-3"
          >
            {TESTIMONIALS.map((t) => (
              <motion.div key={t.name} {...staggerItem}>
                <Card className="h-full rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardContent className="p-8 space-y-5">
                    <Quote className="h-8 w-8 text-primary/20" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                        {t.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl font-bold sm:text-4xl">Why Choose ConnectZ</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              What sets us apart from the rest
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                icon: <ShieldCheck className="h-6 w-6" />,
                title: "100% Genuine Products",
                desc: "Every product comes with manufacturer warranty and is sourced through authorized channels only.",
              },
              {
                icon: <Target className="h-6 w-6" />,
                title: "Expert Guidance",
                desc: "Our CCTV Builder and Learning Center help you make informed decisions tailored to your needs.",
              },
              {
                icon: <Truck className="h-6 w-6" />,
                title: "Pan-India Delivery",
                desc: "Fast and reliable shipping across India with real-time tracking and secure packaging.",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Dedicated Support",
                desc: "Our team of experts is available 7 days a week via phone, email, and WhatsApp for any assistance.",
              },
              {
                icon: <Award className="h-6 w-6" />,
                title: "Best Prices",
                desc: "Competitive pricing with regular deals and discounts, ensuring maximum value for your investment.",
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: "Quick Installation",
                desc: "Professional installation services available to get your security system up and running fast.",
              },
            ].map((item) => (
              <motion.div key={item.title} {...staggerItem}>
                <div className="flex items-start gap-4 p-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeUp}>
            <Card className="bg-primary text-primary-foreground overflow-hidden rounded-2xl border-0 shadow-xl">
              <CardContent className="p-10 sm:p-14 text-center space-y-8">
                <div className="flex justify-center">
                  <div className="p-4 rounded-2xl bg-primary-foreground/10">
                    <Users className="h-12 w-12" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Ready to Secure Your Property?
                  </h2>
                  <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto leading-relaxed">
                    Get in touch for a free consultation and customized quote
                    tailored to your security needs. Our experts are ready to
                    help you design the perfect system.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="gap-2 text-base px-8 rounded-xl"
                    onClick={() => router.push("/contact")}
                  >
                    Book Free Consultation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 text-base px-8 rounded-xl border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => router.push("/builder")}
                  >
                    <Target className="h-4 w-4" />
                    Try CCTV Builder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
