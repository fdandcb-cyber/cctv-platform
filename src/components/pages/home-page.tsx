"use client";

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
} from "lucide-react";

// ─── Price formatter ───
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
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
    icon: <Wrench className="h-6 w-6" />,
    title: "Expert Installation",
    desc: "Professional setup by certified technicians for optimal camera placement and performance.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Quality Brands",
    desc: "Only trusted, industry-leading brands like Hikvision, Dahua, and CP Plus.",
  },
  {
    icon: <IndianRupee className="h-6 w-6" />,
    title: "Competitive Pricing",
    desc: "Best-in-market prices with transparent quotations and no hidden charges.",
  },
  {
    icon: <ClipboardCheck className="h-6 w-6" />,
    title: "Free Site Survey",
    desc: "Complimentary on-site assessment to determine the perfect security solution.",
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: "24/7 Support",
    desc: "Round-the-clock technical support and troubleshooting whenever you need it.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Warranty Coverage",
    desc: "Full manufacturer warranty on all products plus our own installation guarantee.",
  },
];

// ─── Animation variants ───
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.5 },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true } as const,
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

// ═══════════════════════════════════════════════════════════════
// SECTION 1 — Hero
// ═══════════════════════════════════════════════════════════════

function HeroSection() {
  const { setView } = useAppStore();

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
              "bg-emerald-50 border border-emerald-200/60",
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
          Professional CCTV solutions for homes, businesses &amp; industries.
          Expert installation, competitive pricing.
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
            onClick={() => setView("products")}
            className="gap-2 text-base px-8"
          >
            <Eye className="h-5 w-5" />
            Browse Products
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setView("builder")}
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
            "500+ Installations",
            "10+ Brands",
            "Free Site Survey",
            "After-Sales Support",
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
  const { setView, setSelectedProduct } = useStore();

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
        onClick={() => {
          setSelectedProduct(product);
          setView("product-detail");
        }}
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
            onClick={() => {
              setSelectedProduct(product);
              setView("product-detail");
            }}
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
  const { products, setView } = useStore();
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
            onClick={() => setView("products")}
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
    <section className="py-16 sm:py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Why Choose <span className="text-emerald-600">ConnectZ</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Trusted by hundreds of customers for reliable security solutions
          </p>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className={cn(
            "grid gap-4 sm:gap-6",
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {WHY_CHOOSE.map((item) => (
            <motion.div key={item.title} {...staggerItem}>
              <Card className="h-full gap-4 py-0">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
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
  const { setView } = useAppStore();

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
                  ease: "easeInOut",
                }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 text-base px-8"
                  onClick={() => setView("builder")}
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
  const { setView } = useAppStore();

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
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
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
                  <div className="p-3 rounded-xl bg-sky-50 text-sky-600">
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
            onClick={() => setView("builder")}
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
// MAIN — HomePage
// ═══════════════════════════════════════════════════════════════

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturedProducts />
      <WhyChooseSection />
      <BrandsSection />
      <BuilderCtaSection />
      <ContactSection />
    </div>
  );
}