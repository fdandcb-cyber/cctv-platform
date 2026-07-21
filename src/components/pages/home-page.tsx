"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { useStore, type CctvProduct } from "@/store/cctv-store";
import { useBuilderStore } from "@/store/builder-store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  ShoppingCart,
  Heart,
  MapPin,
  Clock,
  Search,
  ArrowUp,
  Users,
  Package,
  BadgeCheck,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Price formatter ───
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

// ─── Constants ───
const BRANDS = [
  { name: "Hikvision", color: "bg-red-600 text-white", desc: "World's #1 CCTV brand" },
  { name: "Dahua", color: "bg-blue-600 text-white", desc: "Professional surveillance" },
  { name: "Ezviz", color: "bg-sky-500 text-white", desc: "Smart home security" },
  { name: "Imou", color: "bg-emerald-600 text-white", desc: "Affordable WiFi cameras" },
  { name: "CP Plus", color: "bg-orange-500 text-white", desc: "Indian security leader" },
  { name: "Godrej", color: "bg-amber-700 text-white", desc: "Trusted Indian brand" },
];

const STATS = [
  { value: "500+", label: "Happy Customers", icon: Users },
  { value: "15+", label: "Top Brands", icon: BadgeCheck },
  { value: "1000+", label: "Products", icon: Package },
  { value: "24/7", label: "Support", icon: Headphones },
];

const WHY_CHOOSE = [
  {
    icon: <Award className="h-6 w-6" />,
    title: "Genuine Products",
    desc: "Authorized dealer for Hikvision, Dahua, CP Plus, Ezviz, Imou, and more — 100% genuine with full manufacturer warranty.",
  },
  {
    icon: <IndianRupee className="h-6 w-6" />,
    title: "Competitive Pricing",
    desc: "Best-in-market prices with transparent quotations and zero hidden charges across all categories.",
  },
  {
    icon: <GitCompareArrows className="h-6 w-6" />,
    title: "Compare & Decide",
    desc: "Use our built-in comparison tool to evaluate cameras side-by-side and pick the right one for your needs.",
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    title: "CCTV Builder",
    desc: "Design your complete CCTV setup with our interactive builder and get an instant itemized quote.",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Learning Center",
    desc: "Detailed guides on camera types, resolutions, and buying tips to help you make informed decisions.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Warranty Coverage",
    desc: "Full manufacturer warranty on all products sourced through authorized distribution channels.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: <Eye className="h-6 w-6" />,
    step: "01",
    title: "Browse Products",
    desc: "Explore our catalog of CCTV cameras, DVRs, NVRs, and accessories from top brands.",
  },
  {
    icon: <GitCompareArrows className="h-6 w-6" />,
    step: "02",
    title: "Compare & Learn",
    desc: "Use our comparison tool and learning center to pick the right equipment.",
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    step: "03",
    title: "Build Your Setup",
    desc: "Use the CCTV Builder to design your complete system and get an instant quote.",
  },
  {
    icon: <ShoppingCart className="h-6 w-6" />,
    step: "04",
    title: "Order & Receive",
    desc: "Place your order online and get genuine products delivered to your doorstep.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rajesh M.",
    role: "Homeowner",
    city: "Bangalore",
    rating: 5,
    product: "Hikvision 4-Camera Kit",
    text: "Used the ConnectZ builder tool to design a 4-camera setup for my home. The product quality is excellent, everything arrived well-packed, and the learning center helped me set it up myself.",
  },
  {
    name: "Priya S.",
    role: "Restaurant Owner",
    city: "Hyderabad",
    rating: 5,
    product: "Dahua 16-Camera System",
    text: "We ordered 16 cameras for our restaurant through ConnectZ. The comparison tool made it easy to pick the right models, and the prices were genuinely the best we found.",
  },
  {
    name: "Amit K.",
    role: "Warehouse Manager",
    city: "Chennai",
    rating: 5,
    product: "32-Ch NVR System",
    text: "Got a complete NVR system with 32 cameras for our warehouse. The builder gave us an accurate quote upfront, and all products were genuine with manufacturer warranty.",
  },
  {
    name: "Sneha R.",
    role: "Boutique Owner",
    city: "Mumbai",
    rating: 4,
    product: "Imou WiFi Camera",
    text: "Love the WiFi cameras I ordered from ConnectZ. The learning center guided me through the setup process, and the motion detection alerts work great through the app.",
  },
];

const FAQS = [
  {
    q: "Which CCTV brand is best for home use?",
    a: "For home use, Hikvision or Dahua are great for wired systems, while Ezviz or Imou are ideal for WiFi cameras. The best choice depends on your specific needs like indoor/outdoor usage, night vision range, and budget. Use our Compare tool and Learning Center to decide.",
  },
  {
    q: "How do I choose the right camera for my property?",
    a: "Use our CCTV Builder tool — select your property type, number of cameras, and preferred technology. It will recommend a complete setup with compatible recorder, cables, and accessories along with an instant price quote.",
  },
  {
    q: "Can I view my cameras remotely on my phone?",
    a: "Yes! Most modern CCTV systems support remote viewing via mobile apps (available for both Android and iOS). Our Learning Center has step-by-step guides to set up remote access on Hikvision, Dahua, and other brands.",
  },
  {
    q: "Do products come with warranty?",
    a: "Yes, all products come with full manufacturer warranty (typically 1-2 years depending on the brand). We only stock genuine products from authorized channels, so your warranty is always valid.",
  },
  {
    q: "Do I need internet for CCTV to work?",
    a: "CCTV cameras record to a local DVR/NVR and work without internet. However, internet is required for remote viewing via mobile app, cloud backup, and email alerts. A stable broadband connection is recommended for the best experience.",
  },
  {
    q: "What is the difference between DVR and NVR?",
    a: "DVR (Digital Video Recorder) works with analog cameras via coaxial cable, while NVR (Network Video Recorder) works with IP cameras via Ethernet cable. NVR systems generally offer higher resolution, better compression, and smart features. Check our Learning Center for a detailed comparison.",
  },
];

// ─── Animation variants ───
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true, margin: "-40px" } as const,
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" },
};

// ─── Reusable premium card class ───
const premiumCard = cn(
  "h-full gap-0 py-0 rounded-2xl",
  "border border-border/60 shadow-sm",
  "hover:shadow-xl hover:-translate-y-1",
  "transition-all duration-300 ease-out",
  "hover:border-emerald-500/50",
  "outline-none"
);

// ═══════════════════════════════════════════════════════════════
// SECTION 1 — Hero
// ═══════════════════════════════════════════════════════════════

function HeroSection() {
  const router = useRouter();

  return (
    <section
      className={cn(
        "relative min-h-[90vh] flex flex-col items-center justify-center px-6 lg:px-8 py-24 overflow-hidden"
      )}
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-emerald-400/[0.05] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Decorative grid dots */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Shield icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <div
            className={cn(
              "relative p-5 rounded-2xl",
              "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60",
              "shadow-xl shadow-emerald-500/10"
            )}
          >
            <Shield className="h-16 w-16 text-emerald-600" />
            <div className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-background rounded-full border border-emerald-200 dark:border-emerald-700 shadow-md">
              <Camera className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <span className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium",
            "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400",
            "border border-emerald-200/60 dark:border-emerald-800/60"
          )}>
            <ShieldCheck className="h-4 w-4" />
            Trusted by 500+ customers across India
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
        >
          Secure What Matters{" "}
          <span className="text-emerald-600">Most</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mt-6"
        >
          Your one-stop shop for professional CCTV security cameras & accessories.
          Compare, learn, and build your perfect surveillance setup — all in one place.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <Button
            size="lg"
            onClick={() => router.push("/products")}
            className={cn(
              "gap-2.5 text-base px-8 py-6 rounded-xl",
              "bg-emerald-600 text-white hover:bg-emerald-700",
              "shadow-lg shadow-emerald-600/20",
              "transition-all duration-300 hover:shadow-xl hover:shadow-emerald-600/30 hover:scale-[1.03]"
            )}
          >
            Browse Products
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/builder")}
            className={cn(
              "gap-2.5 text-base px-8 py-6 rounded-xl",
              "transition-all duration-300 hover:scale-[1.03]"
            )}
          >
            <Wrench className="h-5 w-5" />
            Build Your Setup
          </Button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex flex-wrap gap-3 sm:gap-4 justify-center mt-12"
        >
          {[
            { icon: ShieldCheck, label: "Authorized Dealer" },
            { icon: Award, label: "Genuine Products" },
            { icon: ClipboardCheck, label: "Installation Support" },
            { icon: Shield, label: "Manufacturer Warranty" },
          ].map((badge) => (
            <div
              key={badge.label}
              className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground",
                "bg-muted/40 border border-border/40 rounded-full px-4 py-2"
              )}
            >
              <badge.icon className="h-4 w-4 text-emerald-600" />
              {badge.label}
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
  const discount =
    product.salePrice && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <Card
      className={cn(
        "overflow-hidden group py-0 gap-0 rounded-2xl",
        "border border-border/60 shadow-sm",
        "hover:shadow-xl hover:-translate-y-1",
        "transition-all duration-300 ease-out"
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "aspect-[4/3] bg-muted/50 relative overflow-hidden cursor-pointer"
        )}
        onClick={() => router.push(`/products/${product.id}`)}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.modelName}
            className={cn(
              "w-full h-full object-contain p-5",
              "group-hover:scale-105 transition-transform duration-500"
            )}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg shadow-sm">
            {discount}% OFF
          </Badge>
        )}

        {/* Brand badge */}
        <Badge
          variant="outline"
          className="absolute top-3 right-3 text-[10px] bg-background/80 backdrop-blur-sm"
        >
          {product.brand}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-sm leading-snug line-clamp-2">
          {product.modelName}
        </h3>

        {/* Spec badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.resolution && (
            <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
              {product.resolution}
            </span>
          )}
          {product.cameraType && (
            <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
              {product.cameraType}
            </span>
          )}
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between pt-1">
          <div className="flex items-baseline gap-2">
            {product.salePrice && product.salePrice < product.price ? (
              <>
                <span className="text-lg font-bold text-emerald-600">
                  {fmt(product.salePrice)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {fmt(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold">{fmt(product.price)}</span>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8 gap-1 rounded-lg"
            onClick={() => router.push(`/products/${product.id}`)}
          >
            Details
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FeaturedProducts() {
  const router = useRouter();
  const { products } = useStore();
  const featured = products.slice(0, 8);

  if (featured.length === 0) return null;

  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Popular <span className="text-emerald-600">Products</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mt-4">
            Top-selling CCTV cameras and security equipment from authorized brands
          </p>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className={cn(
            "grid gap-5 sm:gap-6",
            "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          )}
        >
          {featured.map((product) => (
            <motion.div key={product.id} {...staggerItem}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...fadeUp} className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "gap-2 rounded-xl px-8",
              "transition-all duration-300 hover:scale-[1.02]"
            )}
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
// SECTION 3 — How It Works
// ═══════════════════════════════════════════════════════════════

function HowItWorksSection() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            How It <span className="text-emerald-600">Works</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mt-4">
            From browsing to ordering in 4 simple steps
          </p>
        </motion.div>

        {/* Connecting line */}
        <div className="hidden lg:block absolute" />

        <motion.div
          {...staggerContainer}
          className={cn(
            "grid gap-5 sm:gap-6 relative",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-14 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-300 opacity-40 z-0" />

          {HOW_IT_WORKS.map((item) => (
            <motion.div key={item.step} {...staggerItem} className="h-full relative z-10">
              <Card className={cn(premiumCard, "relative overflow-hidden")}>
                {/* Step badge */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -top-2 -right-1 text-7xl font-extrabold",
                    "text-emerald-500/[0.06] select-none pointer-events-none leading-none"
                  )}
                >
                  {item.step}
                </span>

                <CardContent className="p-6 sm:p-7 flex flex-col h-full gap-4 relative z-10">
                  <div className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-xl",
                    "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
                    "border border-emerald-100 dark:border-emerald-800/60",
                    "transition-transform duration-300 group-hover:scale-110"
                  )}>
                    {item.icon}
                  </div>
                  <div className="space-y-2.5 flex-1 flex flex-col justify-end">
                    <h3 className="text-xl font-semibold leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-7">
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
// SECTION 4 — Stats
// ═══════════════════════════════════════════════════════════════

function StatsRow() {
  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
        >
          {STATS.map((stat) => (
            <motion.div key={stat.label} {...staggerItem} className="text-center">
              <div className="flex justify-center mb-3">
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl",
                  "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
                  "border border-emerald-100 dark:border-emerald-800/60"
                )}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 5 — Why Choose ConnectZ
// ═══════════════════════════════════════════════════════════════

function WhyChooseSection() {
  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Why Choose <span className="text-emerald-600">ConnectZ</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mt-4">
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
              <Card className={cn(premiumCard)}>
                <CardContent className="p-6 sm:p-7 flex flex-col h-full gap-5">
                  <div className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-xl",
                    "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
                    "border border-emerald-100 dark:border-emerald-800/60",
                    "transition-transform duration-300 group-hover:scale-110"
                  )}>
                    {item.icon}
                  </div>
                  <div className="space-y-2.5">
                    <h3 className="text-xl font-semibold leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-7 line-clamp-3">
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
// SECTION 6 — Testimonials
// ═══════════════════════════════════════════════════════════════

function TestimonialsSection() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            What Our <span className="text-emerald-600">Customers</span> Say
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mt-4">
            Trusted by hundreds of satisfied customers across India
          </p>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.name} {...staggerItem} className="h-full">
              <Card className={cn(premiumCard)}>
                <CardContent className="p-6 flex flex-col h-full gap-4">
                  {/* Quote icon */}
                  <Quote className="h-8 w-8 text-emerald-600/20 shrink-0" />

                  {/* Review text */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-7 flex-1">
                    {t.text}
                  </p>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < t.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted-foreground/20"
                        )}
                      />
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border/50" />

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400",
                      "text-sm font-bold"
                    )}>
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-sm truncate">{t.name}</p>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      </div>
                      <p className="text-xs text-gray-500 truncate">{t.role}, {t.city}</p>
                    </div>
                  </div>

                  {/* Product tag */}
                  <Badge variant="outline" className="w-fit text-[11px] rounded-lg">
                    <Camera className="h-3 w-3 mr-1" />
                    {t.product}
                  </Badge>
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
// SECTION 7 — Brands
// ═══════════════════════════════════════════════════════════════

function BrandsSection() {
  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-4">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Authorized <span className="text-emerald-600">Brands</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mt-4">
            100% genuine products with full manufacturer warranty
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div {...fadeUp} className="flex flex-wrap gap-3 justify-center mb-10">
          {[
            "Authorized Dealer",
            "100% Genuine Products",
            "Manufacturer Warranty",
          ].map((label) => (
            <span
              key={label}
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400",
                "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40",
                "rounded-full px-3 py-1"
              )}
            >
              <ShieldCheck className="h-3 w-3" />
              {label}
            </span>
          ))}
        </motion.div>

        <motion.div
          {...staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {BRANDS.map((brand) => (
            <motion.div key={brand.name} {...staggerItem}>
              <Card className={cn(
                "py-0 gap-0 rounded-2xl border border-border/60 shadow-sm",
                "hover:shadow-lg hover:scale-105 hover:border-emerald-500/50",
                "transition-all duration-300 cursor-pointer"
              )}>
                <CardContent className="p-5 text-center space-y-2.5">
                  <Badge
                    className={cn(
                      "text-sm font-bold px-4 py-1.5 rounded-lg border-0",
                      brand.color
                    )}
                  >
                    {brand.name}
                  </Badge>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {brand.desc}
                  </p>
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

function FaqSection() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? FAQS.filter(
        (f) =>
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase())
      )
    : FAQS;

  return (
    <section className="py-24 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Frequently Asked <span className="text-emerald-600">Questions</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mt-4">
            Quick answers to common questions about CCTV systems
          </p>
        </motion.div>

        {/* Search */}
        <motion.div {...fadeUp} className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
            className="pl-11 h-12 rounded-xl bg-background border-border/60 focus:border-emerald-500/50"
          />
        </motion.div>

        <motion.div {...staggerContainer} className="space-y-3">
          {filtered.map((faq, i) => {
            const realIndex = FAQS.indexOf(faq);
            return (
              <motion.div key={realIndex} {...staggerItem}>
                <Card
                  className={cn(
                    "py-0 gap-0 cursor-pointer rounded-2xl",
                    "border border-border/60 shadow-sm",
                    "hover:shadow-md transition-all duration-300",
                    openIndex === realIndex && "shadow-md border-emerald-500/30"
                  )}
                  onClick={() => setOpenIndex(openIndex === realIndex ? null : realIndex)}
                  onKeyDown={(e) => e.key === "Enter" && setOpenIndex(openIndex === realIndex ? null : realIndex)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={openIndex === realIndex}
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-sm sm:text-base leading-relaxed">
                        {faq.q}
                      </h3>
                      <span
                        className={cn(
                          "text-xl text-muted-foreground transition-transform duration-200 shrink-0 mt-0.5",
                          openIndex === realIndex && "rotate-45"
                        )}
                      >
                        +
                      </span>
                    </div>
                    <AnimatePresence>
                      {openIndex === realIndex && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="pt-4 mt-4 border-t border-border/50">
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-7">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No questions match your search. Try a different keyword.
          </p>
        )}

        {/* Still have questions */}
        <motion.div {...fadeUp} className="text-center mt-10">
          <p className="text-sm text-gray-500 mb-3">Still have questions?</p>
          <Button
            variant="outline"
            className={cn(
              "gap-2 rounded-xl",
              "transition-all duration-300 hover:scale-[1.02]"
            )}
            onClick={() => router.push("/contact")}
          >
            Contact our experts
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 9 — CTA
// ═══════════════════════════════════════════════════════════════

function BuilderCtaSection() {
  const router = useRouter();

  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUp}>
          <div className={cn(
            "relative overflow-hidden rounded-3xl p-10 sm:p-14 lg:p-16",
            "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800",
            "text-white"
          )}>
            {/* Decorative blurs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/[0.03] rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
              {/* Icon */}
              <div className="flex justify-center">
                <div className={cn(
                  "p-4 rounded-2xl",
                  "bg-white/10 border border-white/10",
                  "shadow-lg"
                )}>
                  <Wrench className="h-12 w-12" />
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Not sure what you need?
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Use our intelligent builder to design the perfect CCTV setup
                for your property in minutes. Get an instant, detailed quote.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button
                  size="lg"
                  className={cn(
                    "gap-2.5 text-base px-8 py-6 rounded-xl",
                    "bg-emerald-600 text-white hover:bg-emerald-700",
                    "shadow-lg shadow-emerald-600/20",
                    "transition-all duration-300 hover:shadow-xl hover:shadow-emerald-600/30 hover:scale-[1.03]"
                  )}
                  onClick={() => router.push("/builder")}
                >
                  <Wrench className="h-5 w-5" />
                  Build Your Setup
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={cn(
                    "gap-2.5 text-base px-8 py-6 rounded-xl",
                    "border-white/20 text-white hover:bg-white/10",
                    "transition-all duration-300"
                  )}
                  onClick={() => router.push("/contact")}
                >
                  <Phone className="h-5 w-5" />
                  Contact Expert
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 10 — Contact
// ═══════════════════════════════════════════════════════════════

const CONTACT_CARDS = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 78094 65102",
    href: "tel:+917809465102",
    color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Mail,
    label: "Email",
    value: "connectzsalesandervices@gmail.com",
    href: "mailto:connectzsalesandservices@gmail.com",
    color: "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    href: "https://wa.me/917809465102",
    external: true,
    color: "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "ConnectZ Sales & Services, India",
    href: undefined,
    color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
  },
];

function ContactSection() {
  const router = useRouter();

  return (
    <section className="py-24 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Get In <span className="text-emerald-600">Touch</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mt-4">
            Have questions? Reach out to us directly — we&apos;re here to help.
          </p>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {CONTACT_CARDS.map((card) => {
            const Wrapper = card.href ? (card.external ? "a" : "a") : "div";
            const props = card.href
              ? {
                  href: card.href,
                  target: card.external ? "_blank" : undefined,
                  rel: card.external ? "noopener noreferrer" : undefined,
                }
              : {};

            return (
              <motion.div key={card.label} {...staggerItem}>
                <Wrapper
                  {...props}
                  className="block h-full"
                >
                  <Card className={cn(premiumCard, "h-full")}>
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="flex justify-center">
                        <div className={cn(
                          "p-3.5 rounded-xl",
                          card.color,
                          "border border-border/30"
                        )}>
                          <card.icon className="h-6 w-6" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                          {card.label}
                        </p>
                        <p className={cn(
                          "font-semibold text-sm",
                          card.label === "Email" && "break-all"
                        )}>
                          {card.value}
                          {card.external && (
                            <ExternalLink className="inline h-3 w-3 ml-1.5 opacity-50" />
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Wrapper>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Business hours + response time */}
        <motion.div
          {...fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10"
        >
          <div className={cn(
            "flex items-center gap-2 text-sm text-muted-foreground",
            "bg-background border border-border/60 rounded-xl px-5 py-3 shadow-sm"
          )}>
            <Clock className="h-4 w-4 text-emerald-600" />
            Mon – Sat: 9 AM – 7 PM
          </div>
          <div className={cn(
            "flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400",
            "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40",
            "rounded-xl px-5 py-3"
          )}>
            <Headphones className="h-4 w-4" />
            Avg. response: under 30 minutes
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// BACK TO TOP
// ═══════════════════════════════════════════════════════════════

function BackToTop() {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 600);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className={cn(
            "fixed bottom-24 right-6 z-40",
            "flex h-11 w-11 items-center justify-center rounded-xl",
            "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20",
            "hover:bg-emerald-700 hover:shadow-xl hover:scale-110",
            "transition-all duration-200"
          )}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
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
      <StatsRow />
      <WhyChooseSection />
      <TestimonialsSection />
      <BrandsSection />
      <FaqSection />
      <BuilderCtaSection />
      <ContactSection />
      <BackToTop />
    </div>
  );
}