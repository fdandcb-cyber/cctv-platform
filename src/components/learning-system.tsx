"use client";

import { useState } from "react";
import { useStore } from "@/store/cctv-store";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Camera, Wifi, Radio, Signal, MonitorPlay, ChevronRight,
  BookOpen, GraduationCap, ShieldCheck, Smartphone, DollarSign,
  Zap, AlertTriangle, CheckCircle2, XCircle, Info, ArrowRight,
  Sun, Moon, Droplets, Cable, HardDrive, Cloud, Settings,
  Eye, ScanLine, RotateCcw, Move, Battery, Router,
  HelpCircle, Lightbulb, Wrench, Users, Building2, Home,
  TreePine, Video, MonitorSpeaker, Cpu, Tag,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// LEARNING DATA
// ═══════════════════════════════════════════════════════════════

const cameraTypesData = [
  {
    id: "dome",
    name: "Dome Camera",
    icon: <Camera className="h-6 w-6" />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "bg-emerald-600",
    image: "/cctv-guide-images/dome_camera.png",
    tagline: "Indoor champion with a vandal-proof dome cover",
    description: `Dome cameras get their name from their dome-shaped housing. They are the most popular choice for indoor installations like homes, offices, shops, and restaurants. The dome cover makes it very difficult for anyone to tell which direction the camera lens is pointing, which acts as a natural deterrent. Most dome cameras are designed for ceiling mounting and offer a clean, professional appearance that blends into any interior decor. They are available in both fixed and PTZ (pan-tilt-zoom) versions, with resolutions ranging from 2MP (1080p) to 4K (8MP). Many models now come with built-in infrared for night vision up to 20-30 meters, and some premium models feature ColorVu technology that can record in full color even in near-total darkness.`,
    bestFor: ["Indoor home security", "Office & retail shops", "Reception areas & lobbies", "Restaurants & hotels", "Schools & hospitals"],
    pros: ["Vandal-resistant dome cover", "Direction of lens is hidden", "Clean professional look", "Easy ceiling mount", "Wide field of view (80-110°)"],
    cons: ["Limited outdoor use (non-weatherproof models)", "Shorter IR range than bullet cameras", "Harder to aim precisely after installation"],
    specs: { resolution: "2MP / 4MP / 5MP / 8MP", nightVision: "IR 20-30m or ColorVu", weatherRating: "IP66 (outdoor) / Indoor", fieldOfView: "80° - 110°", price: "₹1,200 - ₹6,000" },
  },
  {
    id: "bullet",
    name: "Bullet Camera",
    icon: <Camera className="h-6 w-6" />,
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    accent: "bg-sky-600",
    image: "/cctv-guide-images/bullet_camera.png",
    tagline: "Long-range outdoor performer with powerful night vision",
    description: `Bullet cameras are cylindrical in shape and are designed primarily for outdoor surveillance. They are mounted on walls or ceilings using a bracket and their elongated body houses a larger lens assembly that provides superior long-range vision. This makes them ideal for monitoring driveways, parking lots, perimeters, and large open areas. Bullet cameras typically have a longer infrared (IR) range compared to dome cameras — often reaching 40-80 meters — making them excellent for nighttime surveillance. Their visible, deterrent appearance also makes them great for areas where you want potential intruders to clearly see that the premises are under surveillance. They are available with HD-TVI, HD-CVI, and IP technologies from brands like Hikvision and Dahua.`,
    bestFor: ["Outdoor perimeter monitoring", "Driveways & gate entry", "Parking lots & garages", "Long corridors & hallways", "Warehouses & factories"],
    pros: ["Long IR night vision range (40-80m)", "Visible deterrent effect", "Weatherproof (IP66/IP67)", "Easy to install and aim", "Longer detection distance"],
    cons: ["More noticeable / less discreet", "Can be tampered with (vandalism risk)", "Not ideal for tight indoor spaces", "Larger physical size"],
    specs: { resolution: "2MP / 4MP / 5MP / 8MP", nightVision: "IR 40-80m or ColorVu", weatherRating: "IP66 / IP67", fieldOfView: "60° - 90°", price: "₹1,000 - ₹8,000" },
  },
  {
    id: "wifi",
    name: "WiFi Camera",
    icon: <Wifi className="h-6 w-6" />,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    accent: "bg-violet-600",
    image: "/cctv-guide-images/wifi_camera.png",
    tagline: "No cables needed — plug, connect WiFi, and watch from anywhere",
    description: `WiFi cameras (also called wireless IP cameras) connect to your home or office WiFi network instead of requiring a cable run back to a DVR/NVR. This makes them incredibly easy to install — you just need a power outlet near the camera. Most WiFi cameras store footage on a MicroSD card and/or upload to cloud storage, so you don't even need a separate DVR or NVR. They are perfect for renters, apartments, and small setups where running cables through walls is not possible. Popular models like Hikvision's Ezviz series and Dahua's Imou series come with dedicated mobile apps for live viewing, motion detection alerts, and two-way audio. Keep in mind that WiFi cameras require a strong, stable WiFi signal at the camera location for reliable performance.`,
    bestFor: ["Apartments & rental homes", "Quick DIY installation", "Baby monitoring & pet watching", "Small shops & offices", "Indoor spaces where cabling is hard"],
    pros: ["No cable running needed (only power)", "Easy DIY installation", "Works with MicroSD + Cloud storage", "Mobile app with instant alerts", "Two-way audio communication"],
    cons: ["Depends on WiFi signal strength", "Limited range from router", "May have lag/delay on live view", "Higher bandwidth consumption", "Less reliable than wired systems"],
    specs: { resolution: "2MP / 3MP / 4MP", nightVision: "IR 10-15m or ColorVu", weatherRating: "IP65 (outdoor) / Indoor", fieldOfView: "90° - 130°", price: "₹1,500 - ₹7,000" },
  },
  {
    id: "ptz",
    name: "PTZ Camera",
    icon: <Radio className="h-6 w-6" />,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    accent: "bg-amber-600",
    image: "/cctv-guide-images/ptz_camera.png",
    tagline: "One camera that can pan, tilt, and zoom to cover a huge area",
    description: `PTZ stands for Pan-Tilt-Zoom. These cameras can rotate horizontally (pan up to 360°), move vertically (tilt up to 90° to 180°), and optically zoom in on distant objects (up to 20x, 30x, or even 40x magnification). A single PTZ camera can replace 4-8 fixed cameras because it can monitor a very large area and zoom in on specific points of interest. They can be controlled manually via a DVR/NVR joystick, mobile app, or set to auto-tour/patrol a predefined pattern automatically. PTZ cameras also support auto-tracking, where the camera automatically follows moving objects like people or vehicles. They are commonly used in large premises like shopping malls, parking lots, airports, warehouses, and large factory floors. They are more expensive than fixed cameras but offer unmatched flexibility and coverage.`,
    bestFor: ["Large open areas", "Parking lots & malls", "Warehouses & factories", "Traffic monitoring", "Any area needing 360° coverage"],
    pros: ["360° pan + vertical tilt + optical zoom", "One camera covers a huge area", "Auto-tracking moving objects", "Remote controlled via app/Joystick", "Auto-tour / patrol mode"],
    cons: ["More expensive (₹8,000 - ₹50,000+)", "Complex installation and setup", "Only records where it's pointing", "Moving parts can wear out", "Requires skilled operator for best use"],
    specs: { resolution: "2MP / 4MP / 8MP", nightVision: "IR 100-200m", weatherRating: "IP66 / IP67", fieldOfView: "360° pan, 90° tilt, 20-40x zoom", price: "₹8,000 - ₹50,000+" },
  },
  {
    id: "4g",
    name: "4G LTE / Solar Camera",
    icon: <Signal className="h-6 w-6" />,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    accent: "bg-rose-600",
    image: "/cctv-guide-images/4g_camera.png",
    tagline: "Works anywhere with a 4G signal — no WiFi, no power needed",
    description: `4G LTE cameras are the ultimate solution for locations where neither WiFi nor power cables are available. They connect to the mobile 4G network using a SIM card (just like your phone) and many models come with a built-in solar panel that charges the internal battery during the day. This means you can install them literally anywhere — farm fields, construction sites, remote gates, forest areas, highway projects, or any off-grid location. The camera sends live video and motion alerts directly to your phone via the 4G network. You need an active 4G SIM card with a data plan (typically 30-50GB/month). Popular brands include Reolink, Ebitcam, and Hikvision's 4G series. The main ongoing cost is the monthly 4G data recharge. Battery/solar models can run 24/7 with just a few hours of sunlight per day.`,
    bestFor: ["Farm fields & agriculture", "Construction sites", "Remote gates & entry points", "Highway & road projects", "Any place without WiFi/electricity"],
    pros: ["Works without WiFi or electricity", "Solar powered (no electricity bill)", "Install anywhere with 4G signal", "Instant mobile alerts via 4G", "Truly wireless installation"],
    cons: ["Requires 4G SIM + monthly data plan", "Higher initial cost", "Depends on 4G network coverage", "Limited bandwidth may reduce video quality", "Battery degrades over 2-3 years"],
    specs: { resolution: "2MP / 4MP", nightVision: "IR 15-30m + Color", weatherRating: "IP66 / IP67", fieldOfView: "100° - 130°", price: "₹5,000 - ₹20,000" },
  },
];

const dvrNvrData = {
  dvr: {
    name: "DVR (Digital Video Recorder)",
    icon: <HardDrive className="h-5 w-5" />,
    description: `A DVR records video from analog cameras connected via coaxial cable (the same type of cable used for TV connections). DVRs are used with HD-TVI (Hikvision), HD-CVI (Dahua), or AHD technology cameras. The coaxial cable carries both video signal and power (when using a power-over-coax setup), which simplifies wiring. DVRs are the most cost-effective solution for standard home and small business security. They come in 4-channel, 8-channel, and 16-channel versions, meaning you can connect 4, 8, or 16 cameras respectively. Setup involves running a coaxial cable from each camera back to the DVR and connecting each camera to power.`,
    technology: "HD-TVI / HD-CVI / AHD",
    cable: "Coaxial (RG59 / RG6) + Power cable",
    maxResolution: "8MP (4K) on supported models",
    channels: "4 / 8 / 16 channels",
    brands: "Hikvision (HD-TVI), Dahua (HD-CVI), CP Plus",
    priceRange: "₹2,500 - ₹15,000",
    compatibility: "CRITICAL: Hikvision HD-TVI cameras work with Hikvision DVRs. Dahua HD-CVI cameras work with Dahua DVRs. They are NOT cross-compatible in most cases. Always match the camera technology with the DVR brand.",
  },
  nvr: {
    name: "NVR (Network Video Recorder)",
    icon: <Cloud className="h-5 w-5" />,
    description: `An NVR records video from IP (network) cameras connected via Ethernet cable (Cat5e/Cat6). NVRs are the modern standard for high-resolution surveillance. They support Power over Ethernet (PoE), meaning a single Ethernet cable carries both video data and power to each camera — no separate power cable needed. NVRs support higher resolutions (up to 4K and beyond), offer better video compression (H.265+), and provide more advanced features like smart motion detection, face detection, and line-crossing alerts. They are ideal for larger installations, offices, and anyone who wants the best image quality and smartest features. The main drawback is that Ethernet cable runs are limited to 100 meters per segment (can be extended with switches).`,
    technology: "IP (Internet Protocol)",
    cable: "Ethernet (Cat5e / Cat6) with PoE",
    maxResolution: "4K (8MP) and higher",
    channels: "4 / 8 / 16 / 32 channels",
    brands: "Hikvision, Dahua, Reolink, Uniview",
    priceRange: "₹4,000 - ₹25,000",
    compatibility: "NVRs are generally universal — most IP cameras work with most NVRs via ONVIF protocol. However, some advanced smart features (like face detection) may only work with same-brand camera+NVR combos.",
  },
};

const mobileAppsData = [
  {
    brand: "Hikvision",
    apps: [
      { name: "iVMS-4500", use: "For DVR/NVR connected cameras", color: "bg-orange-50 text-orange-700 border-orange-200" },
      { name: "Ezviz", use: "For WiFi/Cloud cameras (Ezviz brand by Hikvision)", color: "bg-blue-50 text-blue-700 border-blue-200" },
      { name: "Hik-Connect", use: "For newer Hikvision IP cameras with cloud P2P", color: "bg-sky-50 text-sky-700 border-sky-200" },
    ],
    steps: [
      "Download the correct app from Google Play Store or Apple App Store",
      "Create a free account / sign up with your email and phone number",
      "On your DVR/NVR, go to Menu → Network → Platform Access → Enable Hik-Connect",
      "Scan the QR code displayed on your DVR/NVR monitor using the app",
      "The camera will appear in your app — tap to view live video",
      "Enable Push Notifications in app settings to get motion alerts on your phone",
    ],
  },
  {
    brand: "Dahua",
    apps: [
      { name: "DMSS", use: "For DVR/NVR and IP cameras", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      { name: "Imou Life", use: "For WiFi/Cloud cameras (Imou brand by Dahua)", color: "bg-purple-50 text-purple-700 border-purple-200" },
    ],
    steps: [
      "Download DMSS or Imou Life from Google Play Store or Apple App Store",
      "Register a new account with your email address",
      "On your DVR/NVR, go to Main Menu → System → Network → P2P → Enable",
      "Note the Device Serial Number and verification code shown on screen",
      "In the app, tap '+' → 'Scan QR Code' or enter serial number manually",
      "Enter the verification code when prompted — your device will appear",
      "Tap the device to view live streams from all connected cameras",
    ],
  },
];

const budgetGuides = [
  {
    range: "Under ₹5,000",
    label: "Basic Starter Kit",
    color: "bg-emerald-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    icon: <Home className="h-5 w-5" />,
    description: "Perfect for small homes, single rooms, or shop counters. You get 1-2 basic cameras with a small DVR or WiFi camera setup. This is the most affordable entry point into CCTV security.",
    recommended: [
      "1x Dome or Bullet camera (2MP, HD-TVI) — ₹1,000 - ₹1,500",
      "1x 4-channel DVR (Hikvision/Dahua) — ₹2,500 - ₹3,500",
      "1x 500GB HDD (for recording) — ₹1,200 - ₹1,500",
      "Cables & power supply — ₹500 - ₹800",
    ],
    totalCost: "₹5,200 - ₹7,300",
    alternative: "1x WiFi camera with MicroSD card (no DVR needed) — ₹1,500 - ₹3,500",
  },
  {
    range: "₹5,000 - ₹10,000",
    label: "Home Security Pack",
    color: "bg-sky-600",
    lightColor: "bg-sky-50",
    textColor: "text-sky-700",
    borderColor: "border-sky-200",
    icon: <Building2 className="h-5 w-5" />,
    description: "Ideal for a complete home setup covering 2-4 cameras. This covers all entry points, parking area, and main living areas. You get better resolution, more storage, and night vision capabilities.",
    recommended: [
      "2-4x Dome/Bullet cameras (2-4MP) — ₹2,000 - ₹5,000",
      "1x 4/8-channel DVR or NVR — ₹3,000 - ₹5,000",
      "1x 1TB HDD — ₹2,000 - ₹2,500",
      "Cables, connectors & power supply — ₹1,000 - ₹1,500",
    ],
    totalCost: "₹8,000 - ₹14,000",
    alternative: "2x WiFi cameras + 1x PTZ for large room — ₹6,000 - ₹12,000",
  },
  {
    range: "₹10,000 - ₹25,000",
    label: "Premium Setup",
    color: "bg-amber-600",
    lightColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    icon: <ShieldCheck className="h-5 w-5" />,
    description: "Professional-grade setup for large homes, offices, or small businesses. Features 4-8 cameras with 4MP/5MP resolution, ColorVu night vision, smart motion detection, and remote viewing on mobile.",
    recommended: [
      "4-8x Dome/Bullet cameras (4-5MP, ColorVu) — ₹6,000 - ₹15,000",
      "1x 8-channel NVR with PoE — ₹5,000 - ₹8,000",
      "1x 2TB HDD — ₹3,500 - ₹4,500",
      "Cat6 cables, PoE injectors, accessories — ₹2,000 - ₹3,000",
    ],
    totalCost: "₹16,500 - ₹30,500",
    alternative: "Mix of 4x IP cameras + 1x PTZ + NVR — ₹18,000 - ₹28,000",
  },
  {
    range: "₹25,000+",
    label: "Enterprise / Commercial",
    color: "bg-rose-600",
    lightColor: "bg-rose-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    icon: <Building2 className="h-5 w-5" />,
    description: "Complete commercial solution for malls, warehouses, factories, multi-story buildings. Includes 8-16+ cameras with 4K resolution, AI-powered analytics, PTZ cameras, and professional installation.",
    recommended: [
      "8-16x IP cameras (4-8MP) with AI features — ₹15,000 - ₹40,000",
      "1-2x PTZ cameras (20x zoom) — ₹10,000 - ₹30,000",
      "16-channel NVR with PoE — ₹8,000 - ₹15,000",
      "4TB+ HDD or NAS storage — ₹5,000 - ₹10,000",
      "Structured cabling, UPS backup, installation — ₹10,000 - ₹20,000",
    ],
    totalCost: "₹48,000 - ₹1,15,000",
    alternative: "Complete with remote monitoring service — ₹50,000 - ₹2,00,000",
  },
];

const faqData = [
  {
    q: "Can I use a Hikvision camera with a Dahua DVR?",
    a: "In most cases, NO. Hikvision cameras use HD-TVI technology and Dahua DVRs use HD-CVI technology — they are different signal standards. A Hikvision HD-TVI camera will NOT work with a Dahua HD-CVI DVR, and vice versa. However, if both the camera and DVR are IP-based (network cameras + NVR), they usually work together via the ONVIF protocol. Always check compatibility before buying."
  },
  {
    q: "How much HDD storage do I need?",
    a: "For a 2MP (1080p) camera recording 24/7, you need approximately 20-30GB per day per camera. So for 4 cameras over 30 days: 4 × 25GB × 30 = 3,000GB (3TB). With H.265+ compression, this drops to about 1.5-2TB. For 4MP cameras, double these numbers. If you use motion-only recording instead of 24/7, storage needs drop by 40-60%."
  },
  {
    q: "Can I view my CCTV cameras on my mobile phone?",
    a: "Yes! Every modern DVR, NVR, and WiFi camera supports mobile viewing. For Hikvision systems, use iVMS-4500 or Hik-Connect app. For Dahua systems, use DMSS app. For WiFi cameras, use the brand's dedicated app (Ezviz, Imou Life, etc.). You just need an internet connection on the DVR/NVR and your phone. The setup usually takes 5-10 minutes."
  },
  {
    q: "What is the difference between IR and ColorVu night vision?",
    a: "IR (Infrared) night vision records in black and white in complete darkness. It's reliable and has longer range (20-80m). ColorVu (Hikvision) or Full-Color (Dahua) uses a large aperture lens and advanced sensor to record in full color even in very low light. ColorVu provides more detail (you can see clothing color, car color) but has shorter range. Some premium cameras offer both modes and switch automatically."
  },
  {
    q: "Do I need internet for CCTV to work?",
    a: "No! Your CCTV system works perfectly without internet. The cameras record to the DVR/NVR hard drive directly through cables. Internet is only needed for remote mobile viewing when you're away from home, and for cloud backup. Without internet, you can still watch live and recorded footage on a monitor connected directly to the DVR/NVR."
  },
  {
    q: "How long does CCTV footage get stored?",
    a: "It depends on your HDD size and recording settings. With motion-only recording on a 1TB HDD with 4 cameras (2MP): approximately 15-20 days. With 24/7 recording: approximately 7-10 days. With 4 cameras (4MP) on 2TB: approximately 10-15 days. You can extend storage by using motion recording, lower frame rates, or adding more HDDs."
  },
];

// ═══════════════════════════════════════════════════════════════
// LEARNING NAVIGATION
// ═══════════════════════════════════════════════════════════════

const learnSections = [
  { id: "overview", label: "Overview", icon: <BookOpen className="h-4 w-4" /> },
  { id: "camera-types", label: "Camera Types", icon: <Camera className="h-4 w-4" /> },
  { id: "dvr-nvr", label: "DVR vs NVR", icon: <MonitorPlay className="h-4 w-4" /> },
  { id: "compatibility", label: "Compatibility", icon: <Cpu className="h-4 w-4" /> },
  { id: "mobile-setup", label: "Mobile Viewing", icon: <Smartphone className="h-4 w-4" /> },
  { id: "budget", label: "Budget Guide", icon: <DollarSign className="h-4 w-4" /> },
  { id: "installation", label: "Installation", icon: <Wrench className="h-4 w-4" /> },
  { id: "faq", label: "FAQ", icon: <HelpCircle className="h-4 w-4" /> },
];

// ═══════════════════════════════════════════════════════════════
// OVERVIEW SECTION
// ═══════════════════════════════════════════════════════════════

function OverviewSection() {
  const { setLearnSection } = useStore();
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-200">
          <GraduationCap className="h-4 w-4" /> Complete CCTV Learning Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Learn CCTV Security Systems <span className="text-emerald-600">Step by Step</span>
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          This guide will teach you everything about CCTV cameras — from understanding different camera types to choosing the right setup for your budget. No technical background needed. Click on any topic below to start learning.
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { section: "camera-types", title: "Camera Types", desc: "Learn about Dome, Bullet, WiFi, PTZ, and 4G cameras — what they are, where to use them, and their pros & cons.", icon: <Camera className="h-6 w-6 text-emerald-600" />, bg: "bg-emerald-50", border: "border-emerald-200" },
          { section: "dvr-nvr", title: "DVR vs NVR", desc: "Understand the difference between DVR and NVR recording systems, which cable they use, and which one is right for you.", icon: <MonitorPlay className="h-6 w-6 text-sky-600" />, bg: "bg-sky-50", border: "border-sky-200" },
          { section: "compatibility", title: "Brand Compatibility", desc: "Critical knowledge: Why Hikvision and Dahua cameras are NOT cross-compatible and how to choose the right combo.", icon: <Cpu className="h-6 w-6 text-amber-600" />, bg: "bg-amber-50", border: "border-amber-200" },
          { section: "mobile-setup", title: "Mobile Viewing", desc: "Step-by-step guide to set up your phone to watch live CCTV footage from anywhere in the world.", icon: <Smartphone className="h-6 w-6 text-violet-600" />, bg: "bg-violet-50", border: "border-violet-200" },
          { section: "budget", title: "Budget Guide", desc: "Find the perfect CCTV setup for your budget — from under ₹5,000 to enterprise-level installations.", icon: <DollarSign className="h-6 w-6 text-rose-600" />, bg: "bg-rose-50", border: "border-rose-200" },
          { section: "installation", title: "Installation Guide", desc: "Step-by-step installation instructions for wired (DVR/NVR) and wireless (WiFi) camera systems.", icon: <Wrench className="h-6 w-6 text-slate-600" />, bg: "bg-slate-50", border: "border-slate-200" },
        ].map((card) => (
          <Card key={card.section} className={cn("cursor-pointer hover:shadow-md transition-shadow border group", card.border)} onClick={() => setLearnSection(card.section)}>
            <CardContent className="p-5 space-y-3">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", card.bg)}>{card.icon}</div>
              <h3 className="font-bold text-lg group-hover:text-emerald-600 transition-colors flex items-center gap-1">{card.title} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How CCTV Works - Simple Diagram */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-amber-500" /> How Does a CCTV System Work?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">A CCTV system has 3 main parts. Here is how they work together:</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
            <Card className="border-2 bg-emerald-100 text-emerald-700 border-emerald-300 w-full md:w-56 text-center">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-center"><Camera className="h-8 w-8" /></div>
                <p className="font-bold">Camera</p>
                <p className="text-xs opacity-80">Captures video of the area</p>
              </CardContent>
            </Card>
            <ChevronRight className="h-8 w-8 text-muted-300 hidden md:block" />
            <Card className="border-2 bg-sky-100 text-sky-700 border-sky-300 w-full md:w-56 text-center">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-center"><MonitorPlay className="h-8 w-8" /></div>
                <p className="font-bold">DVR / NVR</p>
                <p className="text-xs opacity-80">Records & stores the video on HDD</p>
              </CardContent>
            </Card>
            <ChevronRight className="h-8 w-8 text-muted-300 hidden md:block" />
            <Card className="border-2 bg-violet-100 text-violet-700 border-violet-300 w-full md:w-56 text-center">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-center"><MonitorSpeaker className="h-8 w-8" /></div>
                <p className="font-bold">Monitor / Phone</p>
                <p className="text-xs opacity-80">You watch the live or recorded video</p>
              </CardContent>
            </Card>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">The camera captures video → sends it through cable/wireless → DVR/NVR records it → you watch on monitor or phone app.</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CAMERA TYPES SECTION
// ═══════════════════════════════════════════════════════════════

function CameraTypesSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const cam = cameraTypesData.find((c) => c.id === selected);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Understanding CCTV Camera Types</h2>
        <p className="text-muted-foreground">Click on any camera type below to learn about it in detail. Each card shows where it works best, its advantages, and limitations.</p>
      </div>

      {/* Camera Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameraTypesData.map((ct) => (
          <Card key={ct.id} className={cn("cursor-pointer hover:shadow-lg transition-all border-2", selected === ct.id && cn(ct.border, "ring-2 ring-offset-2"))}
            style={selected === ct.id ? { ringColor: 'var(--tw-ring-color)' } : {}}
            onClick={() => setSelected(selected === ct.id ? null : ct.id)}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", ct.bg, ct.color, ct.border)}>{ct.icon}</div>
                <div>
                  <h3 className="font-bold">{ct.name}</h3>
                  <p className="text-xs text-muted-foreground">{ct.tagline}</p>
                </div>
              </div>
              {selected !== ct.id && (
                <p className="text-sm text-muted-foreground line-clamp-2">{ct.description.slice(0, 120)}...</p>
              )}
              {selected === ct.id && (
                <Button variant="ghost" size="sm" className="text-xs p-0 h-auto" onClick={(e) => { e.stopPropagation(); setSelected(null); }}>
                  Click to collapse <ChevronRight className="h-3 w-3 rotate-90" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expanded Detail */}
      {cam && (
        <Card className="border-2 overflow-hidden">
          <div className={cn(cam.bg, "p-4 flex items-center gap-3 border-b", cam.border)}>
            <div className={cn("w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm", cam.color)}>{cam.icon}</div>
            <div>
              <h3 className="text-xl font-bold">{cam.name}</h3>
              <p className="text-sm text-muted-foreground">{cam.tagline}</p>
            </div>
          </div>
          <CardContent className="p-6 space-y-6">
            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{cam.description}</p>

            {/* Best For */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Best For</h4>
              <div className="flex flex-wrap gap-2">
                {cam.bestFor.map((b) => (
                  <Badge key={b} variant="outline" className={cn(cam.border, cam.textColor)}>{b}</Badge>
                ))}
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Advantages</h4>
                <ul className="space-y-1.5">
                  {cam.pros.map((p) => <li key={p} className="text-sm flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /><span>{p}</span></li>)}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-red-600"><XCircle className="h-4 w-4" /> Limitations</h4>
                <ul className="space-y-1.5">
                  {cam.cons.map((c) => <li key={c} className="text-sm flex items-start gap-2"><XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" /><span>{c}</span></li>)}
                </ul>
              </div>
            </div>

            {/* Specs Table */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2"><Settings className="h-4 w-4" /> Typical Specifications</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(cam.specs).map(([key, val]) => (
                  <Card key={key} className="bg-muted/50">
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="font-medium text-sm mt-1">{val}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DVR vs NVR SECTION
// ═══════════════════════════════════════════════════════════════

function DvrNvrSection() {
  const d = dvrNvrData.dvr;
  const n = dvrNvrData.nvr;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">DVR vs NVR — Which One Do You Need?</h2>
        <p className="text-muted-foreground">The recorder is the brain of your CCTV system. Understanding the difference between DVR and NVR is the most important decision you will make. Choose wrong and your cameras may not work at all.</p>
      </div>

      {/* DVR vs NVR Visual Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-sky-200">
          <CardHeader className="bg-sky-50 border-b border-sky-200">
            <CardTitle className="flex items-center gap-2 text-sky-700">{d.icon} {d.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{d.description}</p>
            <div className="space-y-2.5">
              {[
                { label: "Technology", value: d.technology },
                { label: "Cable Used", value: d.cable },
                { label: "Max Resolution", value: d.maxResolution },
                { label: "Channels", value: d.channels },
                { label: "Top Brands", value: d.brands },
                { label: "Price Range", value: d.priceRange },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm py-1.5 border-b border-muted">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium text-right max-w-[60%]">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
              <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Compatibility Note</p>
              <p className="text-xs text-amber-700 mt-1">{d.compatibility}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200">
          <CardHeader className="bg-emerald-50 border-b border-emerald-200">
            <CardTitle className="flex items-center gap-2 text-emerald-700">{n.icon} {n.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{n.description}</p>
            <div className="space-y-2.5">
              {[
                { label: "Technology", value: n.technology },
                { label: "Cable Used", value: n.cable },
                { label: "Max Resolution", value: n.maxResolution },
                { label: "Channels", value: n.channels },
                { label: "Top Brands", value: n.brands },
                { label: "Price Range", value: n.priceRange },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm py-1.5 border-b border-muted">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium text-right max-w-[60%]">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-3">
              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Compatibility Note</p>
              <p className="text-xs text-emerald-700 mt-1">{n.compatibility}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Decision Guide */}
      <Card className="border-2 bg-gradient-to-r from-sky-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-amber-500" /> Quick Decision: Which One Should You Buy?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
              <div className="bg-sky-100 text-sky-700 rounded-lg p-2 mt-0.5"><HardDrive className="h-5 w-5" /></div>
              <div>
                <h4 className="font-bold text-sm">Choose DVR if:</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• You are on a tight budget</li>
                  <li>• You already have coaxial cable wiring</li>
                  <li>• You only need 2-4 cameras</li>
                  <li>• You are buying Hikvision or Dahua analog cameras</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
              <div className="bg-emerald-100 text-emerald-700 rounded-lg p-2 mt-0.5"><Cloud className="h-5 w-5" /></div>
              <div>
                <h4 className="font-bold text-sm">Choose NVR if:</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• You want the best video quality (4K)</li>
                  <li>• You want PoE (one cable for data + power)</li>
                  <li>• You need 4+ cameras with smart features</li>
                  <li>• You are doing a new installation (Ethernet is easier to route)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPATIBILITY SECTION
// ═══════════════════════════════════════════════════════════════

function CompatibilitySection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Camera & Recorder Compatibility Guide</h2>
        <p className="text-muted-foreground">This is the MOST IMPORTANT thing to understand before buying CCTV equipment. Buying incompatible cameras and recorders is the #1 mistake beginners make.</p>
      </div>

      {/* Warning Box */}
      <Card className="border-2 border-red-200 bg-red-50">
        <CardContent className="p-5 flex items-start gap-4">
          <AlertTriangle className="h-8 w-8 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-700 text-lg">CRITICAL: Brand Matching Required</h3>
            <p className="text-red-700 text-sm mt-2 leading-relaxed">
              Hikvision cameras use <strong>HD-TVI</strong> technology. Dahua cameras use <strong>HD-CVI</strong> technology. These are <strong>NOT compatible</strong> with each other&apos;s DVRs. A Hikvision HD-TVI camera will NOT produce video on a Dahua HD-CVI DVR, and vice versa. Always buy cameras and DVR from the same brand, or use IP cameras + NVR which are more universal.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Compatibility Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Compatibility Matrix — Does This Camera Work With This Recorder?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="p-3 text-left font-semibold border-b min-w-[160px]">Camera</th>
                  <th className="p-3 text-center font-semibold border-b">Hikvision DVR<br /><span className="text-xs font-normal">(HD-TVI)</span></th>
                  <th className="p-3 text-center font-semibold border-b">Dahua DVR<br /><span className="text-xs font-normal">(HD-CVI)</span></th>
                  <th className="p-3 text-center font-semibold border-b">Any NVR<br /><span className="text-xs font-normal">(IP/ONVIF)</span></th>
                  <th className="p-3 text-center font-semibold border-b">WiFi (Standalone)<br /><span className="text-xs font-normal">(No Recorder)</span></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { camera: "Hikvision HD-TVI Camera", hik: true, dah: false, nvr: false, wifi: false },
                  { camera: "Dahua HD-CVI Camera", hik: false, dah: true, nvr: false, wifi: false },
                  { camera: "Hikvision IP Camera", hik: false, dah: false, nvr: true, wifi: false },
                  { camera: "Dahua IP Camera", hik: false, dah: false, nvr: true, wifi: false },
                  { camera: "Any ONVIF IP Camera", hik: false, dah: false, nvr: true, wifi: false },
                  { camera: "WiFi Camera (Ezviz/Imou)", hik: false, dah: false, nvr: false, wifi: true },
                ].map((row, i) => (
                  <tr key={row.camera} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                    <td className="p-3 font-medium border-b">{row.camera}</td>
                    <td className="p-3 text-center border-b">{row.hik ? <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />}</td>
                    <td className="p-3 text-center border-b">{row.dah ? <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />}</td>
                    <td className="p-3 text-center border-b">{row.nvr ? <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />}</td>
                    <td className="p-3 text-center border-b">{row.wifi ? <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Safe Combos */}
      <Card className="border-2 border-emerald-200">
        <CardHeader className="bg-emerald-50 border-b border-emerald-200">
          <CardTitle className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="h-5 w-5" /> Safe Buying Combinations (These WILL Work Together)</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { combo: "Hikvision HD-TVI Camera + Hikvision DVR", note: "Perfect match — recommended for budget setups" },
              { combo: "Dahua HD-CVI Camera + Dahua DVR", note: "Perfect match — recommended for budget setups" },
              { combo: "Any IP Camera + Any NVR (ONVIF)", note: "Universal — works across brands" },
              { combo: "Hikvision IP Camera + Hikvision NVR", note: "Best combo — unlocks all smart features" },
              { combo: "Dahua IP Camera + Dahua NVR", note: "Best combo — unlocks all smart features" },
              { combo: "WiFi Camera + MicroSD Card (no recorder)", note: "Standalone — no DVR/NVR needed at all" },
            ].map((item) => (
              <div key={item.combo} className="flex items-start gap-2 p-3 bg-white rounded-lg border">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">{item.combo}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE SETUP SECTION
// ═══════════════════════════════════════════════════════════════

function MobileSetupSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">How to View CCTV on Your Mobile Phone</h2>
        <p className="text-muted-foreground">You can watch your CCTV cameras from anywhere in the world using free mobile apps. Here are the step-by-step instructions for both Hikvision and Dahua systems.</p>
      </div>

      {/* Prerequisites */}
      <Card className="border-2 bg-sky-50">
        <CardContent className="p-5">
          <h3 className="font-bold flex items-center gap-2 mb-3"><Info className="h-5 w-5 text-sky-600" /> Before You Start — What You Need</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: <Router className="h-5 w-5" />, text: "Working internet connection on DVR/NVR (Ethernet cable to router)" },
              { icon: <Smartphone className="h-5 w-5" />, text: "Smartphone with internet (WiFi or mobile data)" },
              { icon: <MonitorPlay className="h-5 w-5" />, text: "DVR/NVR already set up and recording (cameras showing on monitor)" },
              { icon: <Settings className="h-5 w-5" />, text: "Access to DVR/NVR menu (mouse connected to DVR/NVR)" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                <div className="text-sky-600">{item.icon}</div>
                <p className="text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hikvision Steps */}
      {mobileAppsData.map((brand) => (
        <Card key={brand.brand} className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">{brand.brand} Mobile App Setup</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground">Available Apps:</span>
              {brand.apps.map((app) => (
                <Badge key={app.name} variant="outline" className={cn("border", app.color)}>{app.name} — {app.use}</Badge>
              ))}
            </div>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold">Step-by-Step Instructions:</h4>
              {brand.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
                  <p className="text-sm text-muted-foreground pt-1">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Troubleshooting */}
      <Card className="border-2 border-amber-200">
        <CardHeader className="bg-amber-50 border-b border-amber-200">
          <CardTitle className="flex items-center gap-2 text-amber-700"><AlertTriangle className="h-5 w-5" /> Common Issues & Fixes</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-3">
          {[
            { problem: "Device not showing in app", fix: "Make sure P2P/Cloud access is enabled in DVR/NVR settings. Check that the internet cable is connected to the DVR/NVR." },
            { problem: "Video is very laggy or buffering", fix: "Your phone internet may be slow. Switch to a better WiFi or use lower quality stream in app settings." },
            { problem: "Cannot connect when away from home", fix: "The DVR/NVR needs internet access 24/7. Check your router is working and the Ethernet cable is connected." },
            { problem: '\"Device is offline\" error', fix: "The DVR/NVR lost internet. Restart the router and check the cable. The LED on the DVR network port should be blinking." },
            { problem: "QR code scan not working", fix: "Manually enter the device serial number and verification code instead of scanning." },
          ].map((item) => (
            <div key={item.problem} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
              <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">{item.problem}</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-start gap-1"><CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0" /> {item.fix}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BUDGET GUIDE SECTION
// ═══════════════════════════════════════════════════════════════

function BudgetGuideSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose the Right CCTV Setup for Your Budget</h2>
        <p className="text-muted-foreground">Your budget determines how many cameras, what resolution, and which features you can get. Here are 4 recommended setups from basic to enterprise level.</p>
      </div>

      {/* Budget Cards */}
      <div className="space-y-4">
        {budgetGuides.map((tier) => (
          <Card key={tier.range} className="border-2 overflow-hidden">
            <div className={cn(tier.lightColor, "border-b p-4 flex items-center justify-between flex-wrap gap-2", tier.borderColor)}>
              <div className="flex items-center gap-3">
                <div className={tier.color + " text-white rounded-lg p-2"}>{tier.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{tier.label}</h3>
                    <Badge className={tier.color + " text-white"}>{tier.range}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-5">
              <h4 className="font-semibold text-sm mb-3">Recommended Setup:</h4>
              <div className="space-y-2 mb-4">
                {tier.recommended.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <div className={cn("px-3 py-1.5 rounded-lg", tier.lightColor, tier.textColor, "font-bold text-sm")}>
                  Total Cost: {tier.totalCost}
                </div>
                {tier.alternative && (
                  <p className="text-xs text-muted-foreground"><strong>Alternative:</strong> {tier.alternative}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Tips */}
      <Card className="bg-gradient-to-r from-amber-50 to-emerald-50 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-amber-500" /> Smart Money-Saving Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { tip: "Buy camera + DVR combo kits — they are 15-20% cheaper than buying separately.", icon: <DollarSign className="h-4 w-4" /> },
              { tip: "Use motion-only recording to reduce HDD size needed by 40-60%.", icon: <ScanLine className="h-4 w-4" /> },
              { tip: "2MP (1080p) is enough for most homes — don't overpay for 4K unless you need to zoom into details.", icon: <Eye className="h-4 w-4" /> },
              { tip: "WiFi cameras are cheapest for 1-2 camera setups (no DVR needed).", icon: <Wifi className="h-4 w-4" /> },
              { tip: "Always buy branded (Hikvision/Dahua) — cheap unbranded cameras fail in 6 months.", icon: <ShieldCheck className="h-4 w-4" /> },
              { tip: "Check sale prices — CCTV cameras frequently go on sale with 10-25% discounts.", icon: <Tag className="h-4 w-4" /> },
            ].map((item) => (
              <div key={item.tip} className="flex items-start gap-2 bg-white rounded-lg p-3 border">
                <div className="text-amber-600 mt-0.5 shrink-0">{item.icon}</div>
                <p className="text-sm">{item.tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INSTALLATION GUIDE SECTION
// ═══════════════════════════════════════════════════════════════

function InstallationSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step-by-Step CCTV Installation Guide</h2>
        <p className="text-muted-foreground">Follow these guides to install your CCTV system. Choose the one that matches your setup type.</p>
      </div>

      {/* Wired System Installation */}
      <Card className="border-2">
        <CardHeader className="bg-sky-50 border-b border-sky-200">
          <CardTitle className="flex items-center gap-2 text-sky-700"><Cable className="h-5 w-5" /> Wired System (DVR + Coaxial Cable)</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {[
            { step: "Plan Camera Positions", detail: "Walk around your property and decide where each camera should go. Cover all entry points (doors, gates, windows), parking area, and any blind spots. Mark each camera location with a pencil." },
            { step: "Run Cables from Each Camera to DVR", detail: "Run RG59 coaxial cable from each camera location to where the DVR will be placed. Use cable clips or conduit to secure cables along walls. Also run a power cable alongside each coaxial cable, or use a power-over-coax (POC) DVR that sends power through the coaxial cable itself." },
            { step: "Mount the Cameras", detail: "Drill holes and mount the camera brackets at each marked location. For dome cameras, use the ceiling mount template. For bullet cameras, use the wall mount bracket. Connect the coaxial cable and power cable to each camera." },
            { step: "Set Up the DVR", detail: "Place the DVR near your router (you need internet for mobile viewing). Connect all camera cables to the DVR input ports. Connect an HDMI cable from DVR to your monitor/TV. Connect an Ethernet cable from DVR to your router. Plug in the DVR power supply." },
            { step: "Install HDD for Recording", detail: "Open the DVR cover and screw in a SATA HDD (1TB or 2TB recommended). The DVR will automatically detect and format it. This is where all your video footage gets stored." },
            { step: "Power On and Configure", detail: "Turn on the DVR. You should see all cameras on the monitor. Go to settings and set the date/time, recording schedule (24/7 or motion-only), and enable P2P/cloud access for mobile viewing." },
            { step: "Set Up Mobile App", detail: "Follow the Mobile Viewing guide to connect your phone. Scan the QR code from the DVR settings and you are done! Test all cameras from your phone to confirm everything is working." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
              <div className="flex-1 pb-4 border-b border-muted last:border-0 last:pb-0">
                <h4 className="font-semibold text-sm">{item.step}</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* WiFi Camera Installation */}
      <Card className="border-2">
        <CardHeader className="bg-violet-50 border-b border-violet-200">
          <CardTitle className="flex items-center gap-2 text-violet-700"><Wifi className="h-5 w-5" /> WiFi Camera (No DVR Needed — Easiest Setup)</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {[
            { step: "Download the App", detail: "Download Ezviz (for Hikvision WiFi cameras) or Imou Life (for Dahua WiFi cameras) from Google Play Store or Apple App Store. Create a free account." },
            { step: "Plug In the Camera", detail: "Place the camera where you want it and plug it into a power outlet. Wait 1-2 minutes for the camera to boot up. You will hear a voice prompt saying the camera is ready to pair." },
            { step: "Connect to WiFi", detail: "Open the app and tap '+' or 'Add Device'. The app will guide you to connect the camera to your WiFi. You may need to enter your WiFi password. The camera connects to your home WiFi network." },
            { step: "Insert MicroSD Card (Optional)", detail: "Open the camera's MicroSD card slot and insert a card (16GB-128GB recommended). This stores recorded video locally. Without a card, you can still watch live video but cannot record." },
            { step: "Adjust Camera Position", detail: "Use the live view in the app to adjust the camera angle. Make sure it covers the area you want to monitor. Tighten the mounting screws once you are happy with the position." },
            { step: "Enable Notifications", detail: "In the app settings, enable push notifications and motion detection. Now you will get instant alerts on your phone whenever the camera detects movement. You are done!" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
              <div className="flex-1 pb-4 border-b border-muted last:border-0 last:pb-0">
                <h4 className="font-semibold text-sm">{item.step}</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tools Needed */}
      <Card className="border-2 bg-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5" /> Tools You Will Need</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              "Drill machine + drill bits", "Screwdriver set", "RG59 coaxial cable", "BNC connectors / couplers",
              "Power cable (2-core)", "Cable clips / ties", "Ethernet cable (Cat5e/Cat6)", "HDMI cable",
              "SATA HDD (1TB-2TB)", "Ladder / step stool", "Measuring tape", "Cable tester (optional)",
            ].map((tool) => (
              <div key={tool} className="flex items-center gap-2 bg-white rounded-lg p-3 border text-sm">
                <Wrench className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {tool}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FAQ SECTION
// ═══════════════════════════════════════════════════════════════

function FaqSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">Common questions people ask about CCTV systems. Click on any question to see the answer.</p>
      </div>
      <Accordion type="single" collapsible className="space-y-2">
        {faqData.map((item, i) => (
          <AccordionItem key={i} value={"faq-" + i} className="border rounded-lg px-4">
            <AccordionTrigger className="text-left font-medium text-sm hover:no-underline">{item.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN LEARNING SYSTEM
// ═══════════════════════════════════════════════════════════════

export function LearningSystem() {
  const { learnSection, setLearnSection, setView } = useStore();

  const renderSection = () => {
    switch (learnSection) {
      case "camera-types": return <CameraTypesSection />;
      case "dvr-nvr": return <DvrNvrSection />;
      case "compatibility": return <CompatibilitySection />;
      case "mobile-setup": return <MobileSetupSection />;
      case "budget": return <BudgetGuideSection />;
      case "installation": return <InstallationSection />;
      case "faq": return <FaqSection />;
      default: return <OverviewSection />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={() => setView("catalog")} className="hover:text-foreground transition-colors">Catalog</button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">Learning Center</span>
        {learnSection !== "overview" && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium">{learnSections.find((s) => s.id === learnSection)?.label}</span>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-56 shrink-0">
          <nav className="sticky top-20 space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-3">Learning Topics</h3>
            {learnSections.map((s) => (
              <button
                key={s.id}
                onClick={() => setLearnSection(s.id)}
                className={cn("w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left", learnSection === s.id
                    ? "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground")}
              >
                {s.icon} {s.label}
              </button>
            ))}
            <Separator className="my-3" />
            <button
              onClick={() => setView("catalog")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left"
            >
              <Camera className="h-4 w-4" /> Back to Product Catalog
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}