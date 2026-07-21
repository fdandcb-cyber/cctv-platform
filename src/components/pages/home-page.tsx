"use client";

import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { useStore, type CctvProduct } from "@/store/cctv-store";
import { useBuilderStore } from "@/store/builder-store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Camera,
  Wrench,
  Phone,
  Mail,
  MessageCircle,
  Eye,
  Award,
  IndianRupee,
  ClipboardCheck,
  Headphones,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Star,
  HardDrive,
  Cable,
  Quote,
  GitCompareArrows,
  BookOpen,
  ShoppingCart
} from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Price formatter ───
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(n);

// ─── Constants ───
const COMPANY_NAME =
  process.env.NEXT_PUBLIC_COMPANY_NAME || "ConnectZ Sales & Services";

const BRANDS = [
  { name: "Hikvision", color: "bg-red-600 text-white" },
  { name: "Dahua", color: "bg-blue-600 text-white" },
  { name: "Ezviz", color: "bg-sky-500 text-white" },
  { name: "Imou", color: "bg-emerald-600 text-white" },
  { name: "CP Plus", color: "bg-orange-500 text-white" },
  { name: "Godrej", color: "bg-amber-700 text-white" },
];

const WHY_CHOOSE = [
  {
    icon: <Award className="h-6 w-6" />,
    title: "Genuine Products",
    desc: "Authorized dealer for Hikvision, Dahua, CP Plus, Ezviz, Imou, and more — 100% genuine with full manufacturer warranty."
  },
  {
    icon: <IndianRupee className="h-6 w-6" />,
    title: "Competitive Pricing",
    desc: "Best-in-market prices with transparent quotations and zero hidden charges."
  },
  {
    icon: <GitCompareArrows className="h-6 w-6" />,
    title: "Compare & Decide",
    desc: "Use our built-in comparison tool to evaluate cameras side-by-side and pick the right one."
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    title: "CCTV Builder",
    desc: "Design your complete CCTV setup with our interactive builder and get an instant quote."
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Learning Center",
    desc: "Detailed guides on camera types, resolutions, and buying tips to make informed decisions."
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Warranty Coverage",
    desc: "Full manufacturer warranty on all products from authorized distribution channels."
  },
];

// ─── Animation variants ───
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

// ═══════════════════════════════════════════════════════════════
// SECTION 1 — Hero
// ═══════════════════════════════════════════════════════════════

function HeroSection() {
  const { } = useAppStore();
  const router = useRouter();

  return (
    <section
      className={cn(
        "relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden",
        "bg-background"
      )}
    >
      {/* Gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "bg-gradient-to-b from-background via-background/95 to-background/80",
          "before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,oklch(0.6_0.15_160/0.12),transparent_70%)]",
          "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-32 after:bg-gradient-to-t after:from-background after:to-transparent"
        )}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Animated shield icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div
            className={cn(
              "relative p-4 rounded-2xl",
              "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60",
              "shadow-lg shadow-emerald-200/30"
            )}
          >
            <Shield className="h-14 w-14 text-emerald-600" />
            <Camera className="h-6 w-6 text-emerald-500 absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-emerald-200" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
        >
          Secure What Matters Most
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Your one-stop shop for CCTV security cameras &amp; accessories.
          Compare, learn, and build your perfect setup.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => router.push("/products")}
            className="gap-2 text-base px-8"
          >
            <Eye className="h-5 w-5" />
            Browse Products
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/builder")}
            className="gap-2 text-base px-8"
          >
            <Wrench className="h-5 w-5" />
            Build Your Setup
          </Button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap gap-4 sm:gap-6 justify-center pt-4"
        >
          {[
            "10+ Brands",
            "Genuine Products",
            "Builder Tool",
            "Learning Center",
          ].map((label) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground",
                "bg-muted/50 border border-border/50 rounded-full px-4 py-1.5"
              )}
            >
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 2 — Featured Products
// ═══════════════════════════════════════════════════════════════

function ProductCard({ product }: { product: CctvProduct }) {
  const router = useRouter();

  return (
    <Card
      className={cn(
        "overflow-hidden group transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-lg",
        "py-0 gap-0"
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "aspect-[4/3] bg-muted relative overflow-hidden cursor-pointer"
        )}
        onClick={() => router.push(`/products/${product.id}`)}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.modelName}
            className={cn(
              "w-full h-full object-contain p-4",
              "group-hover:scale-105 transition-transform duration-300"
            )}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}

        {product.salePrice && product.salePrice < product.price && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px]">
            {Math.round(
              ((product.price - product.salePrice) / product.price) * 100
            )}
            % OFF
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-[10px]">
            {product.brand}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {product.resolution}
          </Badge>
        </div>
        <p className="font-semibold text-sm leading-tight">
          {product.modelName}
        </p>

        <div className="flex items-end justify-between pt-1">
          <div>
            {product.salePrice && product.salePrice < product.price ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-emerald-600">
                  {fmt(product.salePrice)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {fmt(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold">{fmt(product.price)}</span>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8 gap-1"
            onClick={() => router.push(`/products/${product.id}`)}
          >
            View Details
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FeaturedProducts() {
  const { products } = useStore();
  const featured = products.slice(0, 8);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold">Popular Products</h2>
          <p className="text-muted-foreground mt-2">
            Top-selling CCTV cameras and security equipment
          </p>
        </motion.div>

        {/* Grid: 2 cols mobile, 3 tablet, 4 desktop */}
        <motion.div
          {...staggerContainer}
          className={cn(
            "grid gap-4 sm:gap-6",
            "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          )}
        >
          {featured.map((product) => (
            <motion.div key={product.id} {...staggerItem}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...fadeUp} className="text-center mt-10">
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => router.push("/products")}
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 3 — Why Choose ConnectZ
// ═══════════════════════════════════════════════════════════════

function WhyChooseSection() {
  return (
    <section className="py-14 sm:py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Why Choose <span className="text-emerald-600">ConnectZ</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-3">
            Trusted by hundreds of customers for reliable security solutions
          </p>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className={cn(
            "grid gap-5 sm:gap-6",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {WHY_CHOOSE.map((item) => (
            <motion.div key={item.title} {...staggerItem} className="h-full">
              <Card className={cn(
                "h-full gap-0 py-0 rounded-2xl",
                "border border-border/60",
                "shadow-sm hover:shadow-xl",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-1.5 hover:border-emerald-500/60",
                "focus-within:ring-2 focus-within:ring-emerald-500/40 focus-within:ring-offset-2",
                "outline-none"
              )}>
                <CardContent className="p-6 sm:p-7 flex flex-col justify-between h-full gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 transition-colors duration-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50">
                    <span className="transition-transform duration-300 [&>*]:hover:scale-105">
                      {item.icon}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 4 — Brands We Offer
// ═══════════════════════════════════════════════════════════════

function BrandsSection() {
  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold">Brands We Offer</h2>
          <p className="text-muted-foreground mt-2">
            Authorized dealer for top CCTV brands in India
          </p>
        </motion.div>

        <motion.div {...fadeUp}>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide justify-start lg:justify-center">
            {BRANDS.map((brand) => (
              <div
                key={brand.name}
                className={cn(
                  "flex-shrink-0 snap-center",
                  "px-8 py-5 rounded-xl border border-border/50",
                  "bg-card shadow-sm",
                  "hover:shadow-md transition-shadow duration-300"
                )}
              >
                <Badge
                  className={cn(
                    "text-base font-bold px-6 py-2 rounded-lg border-0",
                    brand.color
                  )}
                >
                  {brand.name}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 5 — CCTV Builder CTA
// ═══════════════════════════════════════════════════════════════

function BuilderCtaSection() {
  const { } = useAppStore();

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div {...fadeUp}>
          <Card className="bg-primary text-primary-foreground overflow-hidden py-0 gap-0 border-0">
            <CardContent className="p-8 sm:p-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-3 rounded-xl bg-primary-foreground/10">
                  <Wrench className="h-10 w-10" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Not sure what you need?
                </h2>
                <p className="text-primary-foreground/80 text-lg">
                  Use our intelligent builder to design the perfect CCTV setup
                  for your property in minutes.
                </p>
              </div>
              <motion.div
                initial={false}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 text-base px-8"
                  onClick={() => router.push("/builder")}
                >
                  <Wrench className="h-5 w-5" />
                  Build Your Setup
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 6 — Contact
// ═══════════════════════════════════════════════════════════════

function ContactSection() {
  const { } = useAppStore();

  return (
    <section className="py-16 sm:py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div {...fadeUp} className="text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Get In Touch</h2>
          <p className="text-muted-foreground text-lg">
            Have questions? Reach out to us directly — we&apos;re here to help.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mt-10 grid gap-4 sm:grid-cols-3"
        >
          {/* Phone */}
          <a
            href="tel:7809465102"
            className="block"
          >
            <Card className="h-full gap-4 py-0 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">7809465102</p>
                </div>
              </CardContent>
            </Card>
          </a>

          {/* Email */}
          <a
            href="mailto:connectzsalesandservices@gmail.com"
            className="block"
          >
            <Card className="h-full gap-4 py-0 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-sm break-all">
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
            className="block"
          >
            <Card className="h-full gap-4 py-0 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 rounded-xl bg-green-50 text-green-600">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-semibold">Chat with us</p>
                </div>
              </CardContent>
            </Card>
          </a>
        </motion.div>

        <motion.div {...fadeUp} className="text-center mt-10">
          <Button
            size="lg"
            onClick={() => router.push("/builder")}
            className="gap-2 text-base px-8"
          >
            Get a Free Quote
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 6 — How It Works
// ═══════════════════════════════════════════════════════════════

const HOW_IT_WORKS = [
  {
    icon: <Eye className="h-6 w-6" />,
    step: "01",
    title: "Browse Products",
    desc: "Explore our catalog of CCTV cameras, DVRs, NVRs, and accessories from top brands."
  },
  {
    icon: <GitCompareArrows className="h-6 w-6" />,
    step: "02",
    title: "Compare & Learn",
    desc: "Use our comparison tool and learning center to pick the right equipment."
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    step: "03",
    title: "Build Your Setup",
    desc: "Use the CCTV Builder to design your complete system and get an instant quote."
  },
  {
    icon: <ShoppingCart className="h-6 w-6" />,
    step: "04",
    title: "Order & Receive",
    desc: "Place your order online and get genuine products delivered to your doorstep."
  },
];

function HowItWorksSection() {
  return (
    <section className="py-14 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            How It <span className="text-emerald-600">Works</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-3">
            From browsing to ordering in 4 simple steps
          </p>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className={cn(
            "grid gap-5 sm:gap-6",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {HOW_IT_WORKS.map((item) => (
            <motion.div key={item.step} {...staggerItem} className="h-full">
              <Card className={cn(
                "h-full gap-0 py-0 rounded-2xl relative overflow-hidden",
                "border border-border/60",
                "shadow-sm hover:shadow-xl",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-1.5 hover:border-emerald-500/60",
                "focus-within:ring-2 focus-within:ring-emerald-500/40 focus-within:ring-offset-2",
                "outline-none"
              )}>
                {/* Step number watermark */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -top-2 -right-1 text-7xl font-extrabold",
                    "text-emerald-500/[0.06] select-none pointer-events-none leading-none"
                  )}
                >
                  {item.step}
                </span>

                <CardContent className="p-6 sm:p-7 flex flex-col justify-between h-full gap-4 relative z-10">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 7 — Testimonials
// ═══════════════════════════════════════════════════════════════

const TESTIMONIALS = [
  {
    name: "Rajesh M.",
    role: "Homeowner, Bangalore",
    rating: 5,
    text: "Used the ConnectZ builder tool to design a 4-camera setup for my home. The product quality is excellent, everything arrived well-packed, and the learning center helped me set it up myself. Saved a lot compared to getting it done professionally."
  },
  {
    name: "Priya S.",
    role: "Restaurant Owner, Hyderabad",
    rating: 5,
    text: "We ordered 16 cameras for our restaurant through ConnectZ. The comparison tool made it easy to pick the right models, and the prices were genuinely the best we found. The footage quality from the Hikvision cameras is crystal clear."
  },
  {
    name: "Amit K.",
    role: "Warehouse Manager, Chennai",
    rating: 5,
    text: "Got a complete NVR system with 32 cameras for our warehouse. The builder gave us an accurate quote upfront, and all products were genuine with manufacturer warranty. Very smooth ordering experience."
  },
  {
    name: "Sneha R.",
    role: "Boutique Owner, Mumbai",
    rating: 4,
    text: "Love the WiFi cameras I ordered from ConnectZ. The learning center guided me through the setup process, and the motion detection alerts work great through the app. Highly recommend for small businesses."
  },
];

function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">
            What Our <span className="text-emerald-600">Customers</span> Say
          </h2>
          <p className="text-muted-foreground mt-2">
            Trusted by hundreds of satisfied customers across India
          </p>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.name} {...staggerItem}>
              <Card className="h-full gap-4 py-0">
                <CardContent className="p-5 space-y-4">
                  <Quote className="h-6 w-6 text-emerald-600/30" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t.text}
                  </p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < t.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <div className="pt-1">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 8 — FAQ
// ═══════════════════════════════════════════════════════════════

const FAQS = [
  {
    q: "Which CCTV brand is best for home use?",
    a: "For home use, Hikvision or Dahua are great for wired systems, while Ezviz or Imou are ideal for WiFi cameras. The best choice depends on your specific needs like indoor/outdoor usage, night vision range, and budget. Use our Compare tool and Learning Center to decide."
  },
  {
    q: "How do I choose the right camera for my property?",
    a: "Use our CCTV Builder tool — select your property type, number of cameras, and preferred technology. It will recommend a complete setup with compatible recorder, cables, and accessories along with an instant price quote."
  },
  {
    q: "Can I view my cameras remotely on my phone?",
    a: "Yes! Most modern CCTV systems support remote viewing via mobile apps (available for both Android and iOS). Our Learning Center has step-by-step guides to set up remote access on Hikvision, Dahua, and other brands."
  },
  {
    q: "Do products come with warranty?",
    a: "Yes, all products come with full manufacturer warranty (typically 1-2 years depending on the brand). We only stock genuine products from authorized channels, so your warranty is always valid."
  },
  {
    q: "Do I need internet for CCTV to work?",
    a: "CCTV cameras record to a local DVR/NVR and work without internet. However, internet is required for remote viewing via mobile app, cloud backup, and email alerts. A stable broadband connection is recommended for the best experience."
  },
  {
    q: "What is the difference between DVR and NVR?",
    a: "DVR (Digital Video Recorder) works with analog cameras via coaxial cable, while NVR (Network Video Recorder) works with IP cameras via Ethernet cable. NVR systems generally offer higher resolution, better compression, and smart features. Check our Learning Center for a detailed comparison."
  },
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Frequently Asked <span className="text-emerald-600">Questions</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Quick answers to common questions about CCTV systems
          </p>
        </motion.div>

        <motion.div {...staggerContainer} className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div key={i} {...staggerItem}>
              <Card
                className="py-0 gap-0 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-sm leading-relaxed">
                      {faq.q}
                    </h3>
                    <span
                      className={cn(
                        "text-lg text-muted-foreground transition-transform duration-200 shrink-0",
                        openIndex === i && "rotate-45"
                      )}
                    >
                      +
                    </span>
                  </div>
                  {openIndex === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pt-3 mt-3 border-t"
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN — HomePage
// ═══════════════════════════════════════════════════════════════

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturedProducts />
      <HowItWorksSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <BrandsSection />
      <FaqSection />
      <BuilderCtaSection />
      <ContactSection />
    </div>
  );
}