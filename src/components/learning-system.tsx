"use client";

import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/store/cctv-store";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import {
  Camera, Wifi, Radio, Signal, MonitorPlay, ChevronRight, ChevronDown,
  BookOpen, GraduationCap, ShieldCheck, Smartphone, DollarSign,
  Zap, AlertTriangle, CheckCircle2, XCircle, Info, ArrowRight,
  Sun, Moon, Droplets, Cable, HardDrive, Cloud, Settings,
  Eye, ScanLine, RotateCcw, Move, Battery, Router,
  HelpCircle, Lightbulb, Wrench, Users, Building2, Home,
  TreePine, Video, MonitorSpeaker, Cpu, Tag,
  Search, Play, Download, Clock, FileText, BarChart3, Trophy,
  BookMarked, MessageCircle, Phone, ExternalLink, Star, Target,
  Layers, WifiOff, ArrowDown, ChevronLeft, Menu, X, Check,
  Sparkles, Headphones, Share2, BookmarkPlus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";

const premiumCard = cn(
  "h-full gap-0 py-0 rounded-2xl",
  "border border-border/60 shadow-sm",
  "hover:shadow-xl hover:-translate-y-1",
  "transition-all duration-300 ease-out",
  "hover:border-emerald-500/50",
  "outline-none"
);

// ═══════════════════════════════════════════════════════════════
// LEARNING DATA
// ═══════════════════════════════════════════════════════════════

const cameraTypesData = [
  {
    id: "dome", name: "Dome Camera", icon: <Camera className="h-6 w-6" />,
    color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200",
    accent: "bg-emerald-600", image: "/cctv-guide-images/dome_camera.png",
    tagline: "Indoor champion with a vandal-proof dome cover",
    description: `Dome cameras get their name from their dome-shaped housing. They are the most popular choice for indoor installations like homes, offices, shops, and restaurants. The dome cover makes it very difficult for anyone to tell which direction the camera lens is pointing, which acts as a natural deterrent. Most dome cameras are designed for ceiling mounting and offer a clean, professional appearance that blends into any interior decor. They are available in both fixed and PTZ (pan-tilt-zoom) versions, with resolutions ranging from 2MP (1080p) to 4K (8MP). Many models now come with built-in infrared for night vision up to 20-30 meters, and some premium models feature ColorVu technology that can record in full color even in near-total darkness.`,
    bestFor: ["Indoor home security", "Office & retail shops", "Reception areas & lobbies", "Restaurants & hotels", "Schools & hospitals"],
    pros: ["Vandal-resistant dome cover", "Direction of lens is hidden", "Clean professional look", "Easy ceiling mount", "Wide field of view (80-110\u00b0)"],
    cons: ["Limited outdoor use (non-weatherproof models)", "Shorter IR range than bullet cameras", "Harder to aim precisely after installation"],
    specs: { resolution: "2MP / 4MP / 5MP / 8MP", nightVision: "IR 20-30m or ColorVu", weatherRating: "IP66 (outdoor) / Indoor", fieldOfView: "80\u00b0 - 110\u00b0", price: "\u20b91,200 - \u20b96,000" }
  },
  {
    id: "bullet", name: "Bullet Camera", icon: <Camera className="h-6 w-6" />,
    color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-200",
    accent: "bg-sky-600", image: "/cctv-guide-images/bullet_camera.png",
    tagline: "Long-range outdoor performer with powerful night vision",
    description: `Bullet cameras are cylindrical in shape and are designed primarily for outdoor surveillance. They are mounted on walls or ceilings using a bracket and their elongated body houses a larger lens assembly that provides superior long-range vision. This makes them ideal for monitoring driveways, parking lots, perimeters, and large open areas. Bullet cameras typically have a longer infrared (IR) range compared to dome cameras \u2014 often reaching 40-80 meters \u2014 making them excellent for nighttime surveillance. Their visible, deterrent appearance also makes them great for areas where you want potential intruders to clearly see that the premises are under surveillance.`,
    bestFor: ["Outdoor perimeter monitoring", "Driveways & gate entry", "Parking lots & garages", "Long corridors & hallways", "Warehouses & factories"],
    pros: ["Long IR night vision range (40-80m)", "Visible deterrent effect", "Weatherproof (IP66/IP67)", "Easy to install and aim", "Longer detection distance"],
    cons: ["More noticeable / less discreet", "Can be tampered with (vandalism risk)", "Not ideal for tight indoor spaces", "Larger physical size"],
    specs: { resolution: "2MP / 4MP / 5MP / 8MP", nightVision: "IR 40-80m or ColorVu", weatherRating: "IP66 / IP67", fieldOfView: "60\u00b0 - 90\u00b0", price: "\u20b91,000 - \u20b98,000" }
  },
  {
    id: "wifi", name: "WiFi Camera", icon: <Wifi className="h-6 w-6" />,
    color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200",
    accent: "bg-violet-600", image: "/cctv-guide-images/wifi_camera.png",
    tagline: "No cables needed \u2014 plug, connect WiFi, and watch from anywhere",
    description: `WiFi cameras (also called wireless IP cameras) connect to your home or office WiFi network instead of requiring a cable run back to a DVR/NVR. This makes them incredibly easy to install \u2014 you just need a power outlet near the camera. Most WiFi cameras store footage on a MicroSD card and/or upload to cloud storage, so you don\u2019t even need a separate DVR or NVR. They are perfect for renters, apartments, and small setups where running cables through walls is not possible.`,
    bestFor: ["Apartments & rental homes", "Quick DIY installation", "Baby monitoring & pet watching", "Small shops & offices", "Indoor spaces where cabling is hard"],
    pros: ["No cable running needed (only power)", "Easy DIY installation", "Works with MicroSD + Cloud storage", "Mobile app with instant alerts", "Two-way audio communication"],
    cons: ["Depends on WiFi signal strength", "Limited range from router", "May have lag/delay on live view", "Higher bandwidth consumption", "Less reliable than wired systems"],
    specs: { resolution: "2MP / 3MP / 4MP", nightVision: "IR 10-15m or ColorVu", weatherRating: "IP65 (outdoor) / Indoor", fieldOfView: "90\u00b0 - 130\u00b0", price: "\u20b91,500 - \u20b97,000" }
  },
  {
    id: "ptz", name: "PTZ Camera", icon: <Radio className="h-6 w-6" />,
    color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200",
    accent: "bg-amber-600", image: "/cctv-guide-images/ptz_camera.png",
    tagline: "One camera that can pan, tilt, and zoom to cover a huge area",
    description: `PTZ stands for Pan-Tilt-Zoom. These cameras can rotate horizontally (pan up to 360\u00b0), move vertically (tilt up to 90\u00b0 to 180\u00b0), and optically zoom in on distant objects (up to 20x, 30x, or even 40x magnification). A single PTZ camera can replace 4-8 fixed cameras because it can monitor a very large area and zoom in on specific points of interest.`,
    bestFor: ["Large open areas", "Parking lots & malls", "Warehouses & factories", "Traffic monitoring", "Any area needing 360\u00b0 coverage"],
    pros: ["360\u00b0 pan + vertical tilt + optical zoom", "One camera covers a huge area", "Auto-tracking moving objects", "Remote controlled via app/Joystick", "Auto-tour / patrol mode"],
    cons: ["More expensive (\u20b98,000 - \u20b950,000+)", "Complex installation and setup", "Only records where it\u2019s pointing", "Moving parts can wear out", "Requires skilled operator for best use"],
    specs: { resolution: "2MP / 4MP / 8MP", nightVision: "IR 100-200m", weatherRating: "IP66 / IP67", fieldOfView: "360\u00b0 pan, 90\u00b0 tilt, 20-40x zoom", price: "\u20b98,000 - \u20b950,000+" }
  },
  {
    id: "4g", name: "4G LTE / Solar Camera", icon: <Signal className="h-6 w-6" />,
    color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200",
    accent: "bg-rose-600", image: "/cctv-guide-images/4g_camera.png",
    tagline: "Works anywhere with a 4G signal \u2014 no WiFi, no power needed",
    description: `4G LTE cameras are the ultimate solution for locations where neither WiFi nor power cables are available. They connect to the mobile 4G network using a SIM card (just like your phone) and many models come with a built-in solar panel that charges the internal battery during the day. This means you can install them literally anywhere \u2014 farm fields, construction sites, remote gates, forest areas, highway projects, or any off-grid location.`,
    bestFor: ["Farm fields & agriculture", "Construction sites", "Remote gates & entry points", "Highway & road projects", "Any place without WiFi/electricity"],
    pros: ["Works without WiFi or electricity", "Solar powered (no electricity bill)", "Install anywhere with 4G signal", "Instant mobile alerts via 4G", "Truly wireless installation"],
    cons: ["Requires 4G SIM + monthly data plan", "Higher initial cost", "Depends on 4G network coverage", "Limited bandwidth may reduce video quality", "Battery degrades over 2-3 years"],
    specs: { resolution: "2MP / 4MP", nightVision: "IR 15-30m + Color", weatherRating: "IP66 / IP67", fieldOfView: "100\u00b0 - 130\u00b0", price: "\u20b95,000 - \u20b920,000" }
  },
];

const dvrNvrData = {
  dvr: {
    name: "DVR (Digital Video Recorder)", icon: <HardDrive className="h-5 w-5" />,
    description: `A DVR records video from analog cameras connected via coaxial cable (the same type of cable used for TV connections). DVRs are used with HD-TVI (Hikvision), HD-CVI (Dahua), or AHD technology cameras. The coaxial cable carries both video signal and power (when using a power-over-coax setup), which simplifies wiring. DVRs are the most cost-effective solution for standard home and small business security.`,
    technology: "HD-TVI / HD-CVI / AHD", cable: "Coaxial (RG59 / RG6) + Power cable",
    maxResolution: "8MP (4K) on supported models", channels: "4 / 8 / 16 channels",
    brands: "Hikvision (HD-TVI), Dahua (HD-CVI), CP Plus", priceRange: "\u20b92,500 - \u20b915,000",
    compatibility: "CRITICAL: Hikvision HD-TVI cameras work with Hikvision DVRs. Dahua HD-CVI cameras work with Dahua DVRs. They are NOT cross-compatible in most cases. Always match the camera technology with the DVR brand."
  },
  nvr: {
    name: "NVR (Network Video Recorder)", icon: <Cloud className="h-5 w-5" />,
    description: `An NVR records video from IP (network) cameras connected via Ethernet cable (Cat5e/Cat6). NVRs are the modern standard for high-resolution surveillance. They support Power over Ethernet (PoE), meaning a single Ethernet cable carries both video data and power to each camera \u2014 no separate power cable needed.`,
    technology: "IP (Internet Protocol)", cable: "Ethernet (Cat5e / Cat6) with PoE",
    maxResolution: "4K (8MP) and higher", channels: "4 / 8 / 16 / 32 channels",
    brands: "Hikvision, Dahua, Reolink, Uniview", priceRange: "\u20b94,000 - \u20b925,000",
    compatibility: "NVRs are generally universal \u2014 most IP cameras work with most NVRs via ONVIF protocol. However, some advanced smart features (like face detection) may only work with same-brand camera+NVR combos."
  }
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
      "On your DVR/NVR, go to Menu \u2192 Network \u2192 Platform Access \u2192 Enable Hik-Connect",
      "Scan the QR code displayed on your DVR/NVR monitor using the app",
      "The camera will appear in your app \u2014 tap to view live video",
      "Enable Push Notifications in app settings to get motion alerts on your phone",
    ]
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
      "On your DVR/NVR, go to Main Menu \u2192 System \u2192 Network \u2192 P2P \u2192 Enable",
      "Note the Device Serial Number and verification code shown on screen",
      "In the app, tap '+' \u2192 'Scan QR Code' or enter serial number manually",
      "Enter the verification code when prompted \u2014 your device will appear",
      "Tap the device to view live streams from all connected cameras",
    ]
  },
];

const budgetGuides = [
  {
    range: "Under \u20b95,000", label: "Basic Starter Kit", color: "bg-emerald-600",
    lightColor: "bg-emerald-50", textColor: "text-emerald-700", borderColor: "border-emerald-200",
    icon: <Home className="h-5 w-5" />,
    description: "Perfect for small homes, single rooms, or shop counters. You get 1-2 basic cameras with a small DVR or WiFi camera setup. This is the most affordable entry point into CCTV security.",
    recommended: [
      "1x Dome or Bullet camera (2MP, HD-TVI) \u2014 \u20b91,000 - \u20b91,500",
      "1x 4-channel DVR (Hikvision/Dahua) \u2014 \u20b92,500 - \u20b93,500",
      "1x 500GB HDD (for recording) \u2014 \u20b91,200 - \u20b91,500",
      "Cables & power supply \u2014 \u20b9500 - \u20b9800",
    ],
    totalCost: "\u20b95,200 - \u20b97,300",
    alternative: "1x WiFi camera with MicroSD card (no DVR needed) \u2014 \u20b91,500 - \u20b93,500"
  },
  {
    range: "\u20b95,000 - \u20b910,000", label: "Home Security Pack", color: "bg-sky-600",
    lightColor: "bg-sky-50", textColor: "text-sky-700", borderColor: "border-sky-200",
    icon: <Building2 className="h-5 w-5" />,
    description: "Ideal for a complete home setup covering 2-4 cameras. This covers all entry points, parking area, and main living areas. You get better resolution, more storage, and night vision capabilities.",
    recommended: [
      "2-4x Dome/Bullet cameras (2-4MP) \u2014 \u20b92,000 - \u20b95,000",
      "1x 4/8-channel DVR or NVR \u2014 \u20b93,000 - \u20b95,000",
      "1x 1TB HDD \u2014 \u20b92,000 - \u20b92,500",
      "Cables, connectors & power supply \u2014 \u20b91,000 - \u20b91,500",
    ],
    totalCost: "\u20b98,000 - \u20b914,000",
    alternative: "2x WiFi cameras + 1x PTZ for large room \u2014 \u20b96,000 - \u20b912,000"
  },
  {
    range: "\u20b910,000 - \u20b925,000", label: "Premium Setup", color: "bg-amber-600",
    lightColor: "bg-amber-50", textColor: "text-amber-700", borderColor: "border-amber-200",
    icon: <ShieldCheck className="h-5 w-5" />,
    description: "Professional-grade setup for large homes, offices, or small businesses. Features 4-8 cameras with 4MP/5MP resolution, ColorVu night vision, smart motion detection, and remote viewing on mobile.",
    recommended: [
      "4-8x Dome/Bullet cameras (4-5MP, ColorVu) \u2014 \u20b96,000 - \u20b915,000",
      "1x 8-channel NVR with PoE \u2014 \u20b95,000 - \u20b98,000",
      "1x 2TB HDD \u2014 \u20b93,500 - \u20b94,500",
      "Cat6 cables, PoE injectors, accessories \u2014 \u20b92,000 - \u20b93,000",
    ],
    totalCost: "\u20b916,500 - \u20b930,500",
    alternative: "Mix of 4x IP cameras + 1x PTZ + NVR \u2014 \u20b918,000 - \u20b928,000"
  },
  {
    range: "\u20b925,000+", label: "Enterprise / Commercial", color: "bg-rose-600",
    lightColor: "bg-rose-50", textColor: "text-rose-700", borderColor: "border-rose-200",
    icon: <Building2 className="h-5 w-5" />,
    description: "Complete commercial solution for malls, warehouses, factories, multi-story buildings. Includes 8-16+ cameras with 4K resolution, AI-powered analytics, PTZ cameras, and professional installation.",
    recommended: [
      "8-16x IP cameras (4-8MP) with AI features \u2014 \u20b915,000 - \u20b940,000",
      "1-2x PTZ cameras (20x zoom) \u2014 \u20b910,000 - \u20b930,000",
      "16-channel NVR with PoE \u2014 \u20b98,000 - \u20b915,000",
      "4TB+ HDD or NAS storage \u2014 \u20b95,000 - \u20b910,000",
      "Structured cabling, UPS backup, installation \u2014 \u20b910,000 - \u20b920,000",
    ],
    totalCost: "\u20b948,000 - \u20b91,15,000",
    alternative: "Complete with remote monitoring service \u2014 \u20b950,000 - \u20b92,00,000"
  },
];

const faqData = [
  { q: "Can I use a Hikvision camera with a Dahua DVR?", a: "In most cases, NO. Hikvision cameras use HD-TVI technology and Dahua DVRs use HD-CVI technology \u2014 they are different signal standards. A Hikvision HD-TVI camera will NOT work with a Dahua HD-CVI DVR, and vice versa. However, if both the camera and DVR are IP-based (network cameras + NVR), they usually work together via the ONVIF protocol. Always check compatibility before buying." },
  { q: "How much HDD storage do I need?", a: "For a 2MP (1080p) camera recording 24/7, you need approximately 20-30GB per day per camera. So for 4 cameras over 30 days: 4 \u00d7 25GB \u00d7 30 = 3,000GB (3TB). With H.265+ compression, this drops to about 1.5-2TB. For 4MP cameras, double these numbers. If you use motion-only recording instead of 24/7, storage needs drop by 40-60%." },
  { q: "Can I view my CCTV cameras on my mobile phone?", a: "Yes! Every modern DVR, NVR, and WiFi camera supports mobile viewing. For Hikvision systems, use iVMS-4500 or Hik-Connect app. For Dahua systems, use DMSS app. For WiFi cameras, use the brand\u2019s dedicated app (Ezviz, Imou Life, etc.). You just need an internet connection on the DVR/NVR and your phone. The setup usually takes 5-10 minutes." },
  { q: "What is the difference between IR and ColorVu night vision?", a: "IR (Infrared) night vision records in black and white in complete darkness. It\u2019s reliable and has longer range (20-80m). ColorVu (Hikvision) or Full-Color (Dahua) uses a large aperture lens and advanced sensor to record in full color even in very low light. ColorVu provides more detail but has shorter range. Some premium cameras offer both modes and switch automatically." },
  { q: "Do I need internet for CCTV to work?", a: "No! Your CCTV system works perfectly without internet. The cameras record to the DVR/NVR hard drive directly through cables. Internet is only needed for remote mobile viewing when you\u2019re away from home, and for cloud backup. Without internet, you can still watch live and recorded footage on a monitor connected directly to the DVR/NVR." },
  { q: "How long does CCTV footage get stored?", a: "It depends on your HDD size and recording settings. With motion-only recording on a 1TB HDD with 4 cameras (2MP): approximately 15-20 days. With 24/7 recording: approximately 7-10 days. With 4 cameras (4MP) on 2TB: approximately 10-15 days. You can extend storage by using motion recording, lower frame rates, or adding more HDDs." },
  { q: "What resolution should I choose for my cameras?", a: "2MP (1080p) is sufficient for most home and small business use. 4MP offers 50% more detail and is ideal for entrances and areas where facial recognition is important. 5MP and 8MP (4K) provide the highest detail for large areas, but require more storage and bandwidth. For general surveillance, 2-4MP is the sweet spot balancing quality and cost." },
  { q: "Can I mix different camera brands with one DVR/NVR?", a: "For analog systems (DVR), mixing brands is risky \u2014 Hikvision HD-TVI cameras only reliably work with Hikvision DVRs, and Dahua HD-CVI cameras with Dahua DVRs. For IP systems (NVR), you can mix brands using the ONVIF protocol, but you may lose some brand-specific smart features. For best results, stick with the same brand throughout your system." },
];

const installSteps = [
  { step: "1. Plan Camera Positions", detail: "Walk around your property and identify all entry points, vulnerable areas, and key spots you want to monitor. Mark camera locations on a simple sketch of your property. Consider camera field of view, lighting conditions, and cable routing paths to your DVR/NVR location." },
  { step: "2. Run Cables", detail: "For DVR systems: Run RG59 coaxial cable from each camera location to the DVR. For NVR systems: Run Cat5e/Cat6 Ethernet cable from each camera to the NVR. Use cable clips or conduit to secure cables along walls. For WiFi cameras: Just ensure a power outlet is nearby and WiFi signal is strong." },
  { step: "3. Mount Cameras", detail: "Use the included mounting bracket to attach each camera to the wall or ceiling. For outdoor cameras, seal all cable entry points with silicone to prevent water damage. Aim each camera to cover the intended area." },
  { step: "4. Connect to Recorder", detail: "For DVR: Connect each camera\u2019s coaxial cable to the DVR input ports. For NVR: Connect each camera\u2019s Ethernet cable to the NVR\u2019s PoE ports. Connect the DVR/NVR to your router using an Ethernet cable for remote viewing." },
  { step: "5. Power On & Configure", detail: "Power on the DVR/NVR. It will auto-detect the cameras. Set the date/time, recording schedule (24/7 or motion-activated), and resolution. Install a hard drive if not pre-installed. Configure motion detection zones and sensitivity for each camera." },
  { step: "6. Set Up Mobile Viewing", detail: "Download the appropriate app (iVMS-4500/Hik-Connect for Hikvision, DMSS for Dahua). Create an account, enable P2P/Cloud access on your DVR/NVR, and scan the QR code to add your device. Test live viewing and motion notification alerts." },
];

const compatibilityData = [
  { brand1: "Hikvision", brand2: "Hikvision", works: true, note: "Full compatibility with all features", tech: "HD-TVI" },
  { brand1: "Dahua", brand2: "Dahua", works: true, note: "Full compatibility with all features", tech: "HD-CVI" },
  { brand1: "Hikvision", brand2: "Dahua", works: false, note: "Different signal tech (TVI vs CVI)", tech: "Incompatible" },
  { brand1: "CP Plus", brand2: "Hikvision", works: false, note: "CP Plus uses AHD, Hikvision uses TVI", tech: "Incompatible" },
  { brand1: "Any IP Camera", brand2: "Any NVR (ONVIF)", works: true, note: "Basic features via ONVIF protocol", tech: "IP / ONVIF" },
  { brand1: "Hikvision IP", brand2: "Dahua NVR", works: true, note: "Basic streaming works, smart features may not", tech: "IP / ONVIF" },
];

// ═══════════════════════════════════════════════════════════════
// NEW DATA: Categories, Downloads, Videos, Articles, Comparisons
// ═══════════════════════════════════════════════════════════════

const categoryFilters = [
  { id: "all", label: "All Topics" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "buying-guide", label: "Buying Guide" },
  { id: "installation", label: "Installation" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "networking", label: "Networking" },
  { id: "storage", label: "Storage" },
  { id: "mobile", label: "Mobile Viewing" },
];

const learnSections = [
  { id: "overview", label: "Overview", icon: <BookOpen className="h-4 w-4" />, lessons: 0, completed: 0, category: "all" },
  { id: "camera-types", label: "Camera Types", icon: <Camera className="h-4 w-4" />, lessons: 8, completed: 5, category: "beginner" },
  { id: "dvr-nvr", label: "DVR vs NVR", icon: <MonitorPlay className="h-4 w-4" />, lessons: 5, completed: 3, category: "beginner" },
  { id: "compatibility", label: "Compatibility", icon: <Cpu className="h-4 w-4" />, lessons: 4, completed: 2, category: "intermediate" },
  { id: "mobile-setup", label: "Mobile Viewing", icon: <Smartphone className="h-4 w-4" />, lessons: 6, completed: 4, category: "networking" },
  { id: "budget", label: "Budget Guide", icon: <DollarSign className="h-4 w-4" />, lessons: 6, completed: 1, category: "buying-guide" },
  { id: "installation", label: "Installation", icon: <Wrench className="h-4 w-4" />, lessons: 12, completed: 0, category: "installation" },
  { id: "faq", label: "FAQ", icon: <HelpCircle className="h-4 w-4" />, lessons: 10, completed: 7, category: "all" },
];

const downloadResources = [
  { title: "Installation Checklist", desc: "Step-by-step checklist for CCTV installation", icon: <CheckCircle2 className="h-5 w-5" />, format: "PDF", size: "250 KB" },
  { title: "CCTV Buying Guide", desc: "Complete guide to choosing the right CCTV system", icon: <FileText className="h-5 w-5" />, format: "PDF", size: "1.2 MB" },
  { title: "Compatibility Chart", desc: "Brand compatibility reference for cameras & recorders", icon: <Cpu className="h-5 w-5" />, format: "PDF", size: "180 KB" },
  { title: "Wiring Diagram", desc: "Visual diagram for DVR and NVR wiring setups", icon: <Cable className="h-5 w-5" />, format: "PDF", size: "320 KB" },
  { title: "Camera Placement Guide", desc: "Optimal camera positions for different property types", icon: <Eye className="h-5 w-5" />, format: "PDF", size: "450 KB" },
  { title: "Storage Calculator", desc: "Calculate HDD storage needs based on cameras & settings", icon: <HardDrive className="h-5 w-5" />, format: "XLSX", size: "85 KB" },
];

const videoTutorials = [
  { title: "How to Set Up a Complete CCTV System", duration: "12:30", category: "Installation", difficulty: "Beginner", views: "15.2K" },
  { title: "DVR vs NVR - Which Should You Buy?", duration: "8:45", category: "Buying Guide", difficulty: "Beginner", views: "22.1K" },
  { title: "Hikvision iVMS-4500 App Setup Tutorial", duration: "6:20", category: "Mobile", difficulty: "Beginner", views: "31.5K" },
  { title: "Dahua DMSS App - Full Setup Guide", duration: "7:10", category: "Mobile", difficulty: "Beginner", views: "18.7K" },
  { title: "CCTV Camera Placement - Best Practices", duration: "10:15", category: "Installation", difficulty: "Intermediate", views: "9.3K" },
  { title: "HDD Storage Calculation Explained", duration: "5:50", category: "Storage", difficulty: "Intermediate", views: "7.8K" },
];

const featuredArticles = [
  { title: "Complete Guide to CCTV Resolutions: 2MP vs 4MP vs 8MP", category: "Buying Guide", readTime: "8 min", difficulty: "Beginner", date: "Jul 10, 2026", preview: "Understanding camera resolution is the first step to making the right purchase. We break down what each resolution means in real-world terms." },
  { title: "H.265 vs H.264 Compression: Save 50% Storage", category: "Storage", readTime: "5 min", difficulty: "Intermediate", date: "Jul 5, 2026", preview: "H.265+ compression can halve your storage requirements without losing video quality. Learn how it works and which recorders support it." },
  { title: "How to Choose the Right HDD for Your DVR/NVR", category: "Buying Guide", readTime: "6 min", difficulty: "Beginner", date: "Jun 28, 2026", preview: "Not all hard drives are equal. Surveillance-grade HDDs are designed for 24/7 writing. Here is what to look for." },
  { title: "PoE Explained: Power Over Ethernet for CCTV", category: "Networking", readTime: "7 min", difficulty: "Intermediate", date: "Jun 20, 2026", preview: "Power over Ethernet lets you power IP cameras through the same cable that carries data. Simplify your installation with PoE." },
];

const comparisonTables = [
  {
    title: "Bullet vs Dome",
    headers: ["Feature", "Bullet Camera", "Dome Camera"],
    rows: [
      ["Best For", "Outdoors, long-range", "Indoors, discreet"],
      ["Night Vision", "40-80m (longer range)", "20-30m (standard)"],
      ["Deterrence", "Highly visible", "Lens direction hidden"],
      ["Vandal Resistance", "Low (exposed)", "High (dome cover)"],
      ["Installation", "Wall mount, easy to aim", "Ceiling mount, fixed angle"],
      ["Field of View", "60° - 90°", "80° - 110°"],
      ["Weatherproof", "IP66/IP67 standard", "IP66 on outdoor models"],
      ["Price Range", "₹1,000 - ₹8,000", "₹1,200 - ₹6,000"],
    ],
  },
  {
    title: "IP vs Analog",
    headers: ["Feature", "IP Camera", "Analog Camera"],
    rows: [
      ["Technology", "Digital (network)", "Analog (coaxial signal)"],
      ["Recorder", "NVR", "DVR"],
      ["Cable", "Cat5e/Cat6 (Ethernet)", "RG59 (Coaxial)"],
      ["Max Resolution", "4K+ (12MP+)", "8MP (4K)"],
      ["Power", "PoE (single cable)", "Separate power cable"],
      ["Smart Features", "Face detection, line crossing", "Basic motion detection"],
      ["Scalability", "Easy (network switches)", "Limited by DVR channels"],
      ["Cost", "Higher initial cost", "More budget-friendly"],
    ],
  },
  {
    title: "DVR vs NVR",
    headers: ["Feature", "DVR", "NVR"],
    rows: [
      ["Camera Type", "Analog (HD-TVI/CVI/AHD)", "IP (Network) cameras"],
      ["Cable", "Coaxial (RG59)", "Ethernet (Cat5e/Cat6)"],
      ["Power to Camera", "Separate power cable", "PoE (single cable)"],
      ["Audio", "Separate audio cable needed", "Built-in audio over network"],
      ["Max Resolution", "Up to 8MP (4K)", "4K+ (12MP+)"],
      ["Smart Analytics", "Limited", "Advanced (AI, face, line cross)"],
      ["Max Cable Length", "300m (with amplifier)", "100m per segment"],
      ["Best For", "Budget setups, retrofits", "New installs, high quality"],
    ],
  },
  {
    title: "WiFi vs Wired",
    headers: ["Feature", "WiFi Camera", "Wired Camera"],
    rows: [
      ["Installation", "Easy DIY, power only", "Requires cable running"],
      ["Reliability", "Depends on WiFi strength", "Very stable & consistent"],
      ["Video Quality", "May reduce on weak signal", "Always full quality"],
      ["Latency", "Slight delay possible", "Near zero latency"],
      ["Storage", "MicroSD / Cloud", "DVR/NVR HDD"],
      ["Scalability", "1-4 cameras typically", "4-32+ cameras"],
      ["Best For", "Apartments, small setups", "Homes, offices, commercial"],
      ["Cost", "₹1,500 - ₹7,000", "₹8,000 - ₹1,15,000 (system)"],
    ],
  },
];

const popularTopics = [
  "CCTV Camera Types", "DVR vs NVR", "Hikvision Compatibility", "Mobile App Setup",
  "WiFi Camera Installation", "Night Vision Comparison", "HDD Storage Calculation",
  "PTZ Camera Guide", "Budget Setup Under 10K", "ColorVu vs IR"
];

// ═══════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════

function HeroSection({ onStartLearning, onBrowseProducts }: { onStartLearning: () => void; onBrowseProducts: () => void }) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-background to-background dark:from-emerald-950/20 dark:via-background dark:to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/[0.06] rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-emerald-400/[0.04] rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div {...fadeUp}>
          <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <GraduationCap className="h-4 w-4 mr-1.5" />
            ConnectZ Learning Center
          </Badge>
        </motion.div>
        <motion.h1 {...fadeUp} transition={{ duration: 0.6, ease: "easeOut" }} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
          Master CCTV Security{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">Step by Step</span>
        </motion.h1>
        <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }} className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10">
          From understanding camera types to choosing the right setup for your budget —
          become a CCTV expert with our comprehensive, free learning resources. No technical background needed.
        </motion.p>
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button size="lg" onClick={onStartLearning} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-105 transition-all duration-200 rounded-xl px-8 text-base">
            <BookOpen className="h-5 w-5 mr-2" /> Start Learning
          </Button>
          <Button size="lg" variant="outline" onClick={onBrowseProducts} className="rounded-xl px-8 text-base hover:bg-muted/50">
            Browse Products <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
        <motion.div {...staggerContainer} className="flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: <Sparkles className="h-4 w-4" />, text: "Beginner Friendly" },
            { icon: <BookOpen className="h-4 w-4" />, text: "Step-by-Step Tutorials" },
            { icon: <ShieldCheck className="h-4 w-4" />, text: "Expert Guides" },
            { icon: <Download className="h-4 w-4" />, text: "Free Resources" },
          ].map((badge) => (
            <motion.div key={badge.text} {...staggerItem}>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 border border-border/40 rounded-full px-3 py-1.5">
                <span className="text-emerald-500">{badge.icon}</span> {badge.text}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// SEARCH COMPONENT
// ═══════════════════════════════════════════════════════════════

function LearningSearch({ value, onChange, onTopicClick }: {
  value: string; onChange: (v: string) => void; onTopicClick: (t: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const showSuggestions = focused && value.length > 0;
  const filtered = popularTopics.filter((t) => t.toLowerCase().includes(value.toLowerCase()));

  return (
    <motion.div {...fadeUp} className="relative max-w-2xl mx-auto mb-12">
      <div className={cn(
        "relative flex items-center rounded-xl border bg-card shadow-sm transition-all duration-200",
        focused ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md" : "border-border"
      )}>
        <Search className="h-5 w-5 text-muted-foreground ml-4 shrink-0" />
        <input
          type="text"
          placeholder="Search CCTV topics, DVR, NVR, installation..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="w-full bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground/60"
          aria-label="Search learning topics"
        />
        {value && (
          <button onClick={() => onChange("")} className="mr-3 p-1 rounded-md hover:bg-muted text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <AnimatePresence>
        {showSuggestions && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {filtered.slice(0, 5).map((topic) => (
              <button key={topic} onClick={() => { onChange(""); onTopicClick(topic); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2 transition-colors"
              >
                <Search className="h-3.5 w-3.5 text-muted-foreground" /> {topic}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {!focused && !value && (
        <div className="mt-3 flex flex-wrap items-center gap-2 justify-center">
          <span className="text-xs text-muted-foreground mr-1">Popular:</span>
          {popularTopics.slice(0, 5).map((topic) => (
            <button key={topic} onClick={() => onTopicClick(topic)}
              className="text-xs bg-muted/50 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300 text-muted-foreground border border-border/40 rounded-full px-3 py-1 transition-colors"
            >{topic}</button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEARNING PROGRESS
// ═══════════════════════════════════════════════════════════════

function LearningProgress() {
  const totalLessons = 51;
  const completedLessons = 22;
  const progress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <motion.div {...fadeUp} className="mb-12">
      <Card className={cn(premiumCard, "bg-gradient-to-r from-emerald-50/80 to-sky-50/50 dark:from-emerald-950/30 dark:to-sky-950/20 border-emerald-200/50")}>
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Learning Progress</h3>
                  <p className="text-sm text-muted-foreground">Track your CCTV knowledge journey</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Course Completion</span>
                  <span className="font-semibold text-emerald-600">{completedLessons} / {totalLessons} Lessons</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> ~2h remaining</span>
                <span className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5" /> {progress}% complete</span>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-3">
              <div className="text-4xl font-extrabold text-emerald-600">{progress}%</div>
              <p className="text-xs text-muted-foreground">Keep going! You are making great progress.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIDEBAR NAVIGATION
// ═══════════════════════════════════════════════════════════════

function SidebarNav({
  learnSection, setLearnSection, mobileOpen, setMobileOpen, router
}: {
  learnSection: string; setLearnSection: (s: string) => void;
  mobileOpen: boolean; setMobileOpen: (o: boolean) => void; router: ReturnType<typeof useRouter>;
}) {
  const totalCompleted = learnSections.reduce((a, s) => a + s.completed, 0);
  const totalLessons = learnSections.reduce((a, s) => a + s.lessons, 0);

  const sidebarContent = (
    <nav className="space-y-1" role="navigation" aria-label="Learning topics">
      <div className="px-3 mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Learning Topics</h3>
        <p className="text-xs text-muted-foreground/70">{totalCompleted}/{totalLessons} lessons completed</p>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0}%` }} />
        </div>
      </div>
      {learnSections.map((s) => {
        const isActive = learnSection === s.id;
        const isComplete = s.lessons > 0 && s.completed === s.lessons;
        return (
          <button key={s.id} onClick={() => { setLearnSection(s.id); setMobileOpen(false); }}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left group",
              isActive
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800 shadow-sm"
                : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
            )} aria-current={isActive ? "page" : undefined}>
            <span className={cn("shrink-0", isActive ? "text-emerald-600" : "text-muted-foreground group-hover:text-foreground")}>{s.icon}</span>
            <span className="flex-1 truncate">{s.label}</span>
            {s.lessons > 0 && (
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full shrink-0",
                isComplete ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"
              )}>
                {isComplete ? <Check className="h-3 w-3" /> : `${s.completed}/${s.lessons}`}
              </span>
            )}
          </button>
        );
      })}
      <Separator className="my-3" />
      <button onClick={() => { router.push("/products"); setMobileOpen(false); }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left">
        <Camera className="h-4 w-4" /> Back to Products
      </button>
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-card border border-border/60 rounded-2xl p-4 shadow-sm">
          {sidebarContent}
        </div>
      </aside>
      <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2 mb-4"
        onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle learning menu">
        <Menu className="h-4 w-4" /> Topics
      </Button>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-background border-r z-50 p-4 overflow-y-auto lg:hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Topics</h3>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></Button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// CATEGORY FILTERS
// ═══════════════════════════════════════════════════════════════

function CategoryFilters({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <motion.div {...fadeUp} className="flex flex-wrap gap-2 mb-8">
      {categoryFilters.map((cat) => (
        <button key={cat.id} onClick={() => onChange(cat.id)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
            active === cat.id
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
              : "bg-card text-muted-foreground border-border/60 hover:border-emerald-500/50 hover:text-emerald-600"
          )}>{cat.label}</button>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE CARDS (Overview)
// ═══════════════════════════════════════════════════════════════

const moduleCards = [
  { section: "camera-types", title: "Camera Types", desc: "Learn about Dome, Bullet, WiFi, PTZ, and 4G cameras — what they are, where to use them, and their pros & cons.", icon: <Camera className="h-7 w-7" />, bg: "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20", iconBg: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600", time: "12 min", difficulty: "Beginner", lessons: 8, progress: 63, category: "beginner" },
  { section: "dvr-nvr", title: "DVR vs NVR", desc: "Understand the difference between DVR and NVR recording systems, which cable they use, and which one is right for you.", icon: <MonitorPlay className="h-7 w-7" />, bg: "from-sky-50 to-sky-100/50 dark:from-sky-950/40 dark:to-sky-900/20", iconBg: "bg-sky-100 dark:bg-sky-900/60 text-sky-600", time: "10 min", difficulty: "Beginner", lessons: 5, progress: 60, category: "beginner" },
  { section: "compatibility", title: "Brand Compatibility", desc: "Critical knowledge: Why Hikvision and Dahua cameras are NOT cross-compatible and how to choose the right combo.", icon: <Cpu className="h-7 w-7" />, bg: "from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20", iconBg: "bg-amber-100 dark:bg-amber-900/60 text-amber-600", time: "8 min", difficulty: "Intermediate", lessons: 4, progress: 50, category: "intermediate" },
  { section: "mobile-setup", title: "Mobile Viewing", desc: "Step-by-step guide to set up your phone to watch live CCTV footage from anywhere in the world.", icon: <Smartphone className="h-7 w-7" />, bg: "from-violet-50 to-violet-100/50 dark:from-violet-950/40 dark:to-violet-900/20", iconBg: "bg-violet-100 dark:bg-violet-900/60 text-violet-600", time: "15 min", difficulty: "Beginner", lessons: 6, progress: 67, category: "networking" },
  { section: "budget", title: "Budget Guide", desc: "Find the perfect CCTV setup for your budget — from under \u20b95,000 to enterprise-level installations.", icon: <DollarSign className="h-7 w-7" />, bg: "from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-rose-900/20", iconBg: "bg-rose-100 dark:bg-rose-900/60 text-rose-600", time: "10 min", difficulty: "Beginner", lessons: 6, progress: 17, category: "buying-guide" },
  { section: "installation", title: "Installation Guide", desc: "Step-by-step installation instructions for wired (DVR/NVR) and wireless (WiFi) camera systems.", icon: <Wrench className="h-7 w-7" />, bg: "from-slate-50 to-slate-100/50 dark:from-slate-800/40 dark:to-slate-800/20", iconBg: "bg-slate-100 dark:bg-slate-800/60 text-slate-600", time: "20 min", difficulty: "Intermediate", lessons: 12, progress: 0, category: "installation" },
];

function ModuleCards({ setLearnSection, activeCategory }: { setLearnSection: (s: string) => void; activeCategory: string }) {
  const filtered = activeCategory === "all" ? moduleCards : moduleCards.filter((c) => c.category === activeCategory);
  if (filtered.length === 0) {
    return (
      <div className="text-center py-16">
        <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">No modules found for this category</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Try selecting a different filter</p>
      </div>
    );
  }
  return (
    <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {filtered.map((card) => (
        <motion.div key={card.section} {...staggerItem}>
          <Card className={cn(premiumCard, "cursor-pointer group overflow-hidden")} onClick={() => setLearnSection(card.section)}>
            <div className={cn("h-32 bg-gradient-to-br relative overflow-hidden", card.bg)}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300", card.iconBg)}>
                  {card.icon}
                </div>
              </div>
              <Badge variant="secondary" className="absolute top-3 right-3 text-[10px]">{card.difficulty}</Badge>
            </div>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-bold text-lg group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                {card.title}
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{card.desc}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {card.time}</span>
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {card.lessons} Lessons</span>
              </div>
              {card.progress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-emerald-600">{card.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${card.progress}%` }} />
                  </div>
                </div>
              )}
              <Button variant={card.progress > 0 ? "outline" : "default"} size="sm"
                className={cn("w-full mt-1 rounded-lg text-sm", card.progress === 0 && "bg-emerald-600 hover:bg-emerald-700 text-white")}>
                {card.progress > 0 ? (<><Play className="h-3.5 w-3.5 mr-1.5" /> Continue Learning</>) : (<><BookOpen className="h-3.5 w-3.5 mr-1.5" /> Start Learning</>)}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INTERACTIVE FLOW DIAGRAM
// ═══════════════════════════════════════════════════════════════

function InteractiveFlowDiagram() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const steps = [
    { icon: <Camera className="h-6 w-6" />, label: "Camera", desc: "Captures video of the surveillance area. Available in Dome, Bullet, WiFi, PTZ, and 4G types. Resolution ranges from 2MP to 8MP (4K).", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" },
    { icon: <Cable className="h-6 w-6" />, label: "Cable / WiFi", desc: "Coaxial (RG59) for DVR systems or Ethernet (Cat5e/Cat6) for NVR systems. WiFi cameras connect wirelessly. PoE carries both data and power.", color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800" },
    { icon: <HardDrive className="h-6 w-6" />, label: "Recorder", desc: "DVR (for analog cameras) or NVR (for IP cameras). Records and stores all video footage on an internal HDD. Supports 4-32 camera channels.", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800" },
    { icon: <Router className="h-6 w-6" />, label: "Router", desc: "Connects your DVR/NVR to the internet for remote viewing. Required for mobile app access and cloud backup. Not needed for local-only viewing.", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800" },
    { icon: <Smartphone className="h-6 w-6" />, label: "Your Phone", desc: "View live and recorded footage from anywhere using apps like iVMS-4500 (Hikvision), DMSS (Dahua), or brand-specific WiFi camera apps.", color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800" },
  ];

  return (
    <motion.div {...fadeUp}>
      <Card className={cn(premiumCard, "overflow-hidden")}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lightbulb className="h-5 w-5 text-amber-500" /> How Does a CCTV System Work?
          </CardTitle>
          <p className="text-sm text-muted-foreground">Hover or tap each component to learn more</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="hidden md:flex items-center justify-center gap-2">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  onMouseEnter={() => setActiveStep(i)} onMouseLeave={() => setActiveStep(null)}
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                  className={cn("w-40 p-4 rounded-xl border-2 cursor-pointer text-center transition-all duration-300", step.bg, activeStep === i && "shadow-lg ring-2 ring-emerald-500/30")}>
                  <div className={cn("flex justify-center mb-2", step.color)}>{step.icon}</div>
                  <p className="font-semibold text-sm">{step.label}</p>
                  {activeStep === i && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs text-muted-foreground mt-2 leading-relaxed">{step.desc}</motion.p>
                  )}
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="mx-1">
                    <ArrowRight className="h-5 w-5 text-muted-300" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          <div className="md:hidden space-y-3">
            {steps.map((step, i) => (
              <div key={step.label}>
                <motion.div whileTap={{ scale: 0.98 }} onClick={() => setActiveStep(activeStep === i ? null : i)}
                  className={cn("flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300", step.bg, activeStep === i && "shadow-lg ring-2 ring-emerald-500/30")}>
                  <div className={cn("shrink-0", step.color)}>{step.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{step.label}</p>
                    <AnimatePresence>
                      {activeStep === i && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.desc}</motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 text-muted-400 transition-transform duration-200 shrink-0", activeStep === i && "rotate-180")} />
                </motion.div>
                {i < steps.length - 1 && <div className="flex justify-center py-0.5"><ArrowDown className="h-4 w-4 text-muted-300" /></div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FEATURED ARTICLES
// ═══════════════════════════════════════════════════════════════

function FeaturedArticles() {
  return (
    <motion.section {...fadeUp} className="py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Featured Guides</h2>
          <p className="text-muted-foreground mt-1">In-depth articles to expand your CCTV knowledge</p>
        </div>
      </div>
      <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {featuredArticles.map((article) => (
          <motion.div key={article.title} {...staggerItem}>
            <Card className={cn(premiumCard, "group cursor-pointer overflow-hidden")}>
              <div className="h-2 bg-gradient-to-r from-emerald-500 to-sky-500" />
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px] px-2 py-0">{article.category}</Badge>
                  <span>{article.readTime}</span><span>·</span><span>{article.difficulty}</span>
                </div>
                <h3 className="font-bold leading-snug group-hover:text-emerald-600 transition-colors">{article.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{article.preview}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read Article <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

// ═══════════════════════════════════════════════════════════════
// VIDEO TUTORIALS
// ═══════════════════════════════════════════════════════════════

function VideoTutorials() {
  return (
    <motion.section {...fadeUp} className="py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Play className="h-6 w-6 text-emerald-600" /> Watch & Learn
          </h2>
          <p className="text-muted-foreground mt-1">Video tutorials to help you get started quickly</p>
        </div>
      </div>
      <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videoTutorials.map((video) => (
          <motion.div key={video.title} {...staggerItem}>
            <Card className={cn(premiumCard, "group cursor-pointer overflow-hidden")}>
              <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-black/50 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-6 w-6 text-emerald-600 ml-0.5" />
                </div>
                <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px]">{video.duration}</Badge>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">{video.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px] px-2 py-0">{video.category}</Badge>
                  <span>{video.difficulty}</span><span>·</span><span>{video.views} views</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

// ═══════════════════════════════════════════════════════════════
// DOWNLOADS SECTION
// ═══════════════════════════════════════════════════════════════

function DownloadsSection() {
  return (
    <motion.section {...fadeUp} className="py-16">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Download className="h-6 w-6 text-emerald-600" /> Downloadable Resources
        </h2>
        <p className="text-muted-foreground mt-1">Free guides, checklists, and reference materials</p>
      </div>
      <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {downloadResources.map((res) => (
          <motion.div key={res.title} {...staggerItem}>
            <Card className={cn(premiumCard, "group cursor-pointer")}>
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 text-emerald-600 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60 transition-colors">
                  {res.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-snug group-hover:text-emerald-600 transition-colors">{res.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{res.desc}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{res.format}</Badge>
                    <span>{res.size}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPARISON TABLES
// ═══════════════════════════════════════════════════════════════

function ComparisonTables() {
  const [activeTable, setActiveTable] = useState(0);
  return (
    <motion.section {...fadeUp} className="py-16">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Comparison Tables</h2>
        <p className="text-muted-foreground mt-1">Side-by-side comparisons to help you decide</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {comparisonTables.map((table, i) => (
          <button key={table.title} onClick={() => setActiveTable(i)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
              activeTable === i ? "bg-emerald-600 text-white border-emerald-600" : "bg-card text-muted-foreground border-border/60 hover:border-emerald-500/50"
            )}>{table.title}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTable} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          <Card className={cn(premiumCard, "overflow-hidden")}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    {comparisonTables[activeTable].headers.map((h, i) => (
                      <th key={i} className={cn("px-4 py-3 text-left font-semibold whitespace-nowrap", i === 0 ? "text-muted-foreground" : "text-foreground")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonTables[activeTable].rows.map((row, ri) => (
                    <tr key={ri} className={cn("border-t border-border/50", ri % 2 === 0 ? "bg-background" : "bg-muted/20")}>
                      {row.map((cell, ci) => (
                        <td key={ci} className={cn("px-4 py-2.5", ci === 0 ? "font-medium text-muted-foreground" : "")}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}

// ═══════════════════════════════════════════════════════════════
// FAQ WITH SEARCH
// ═══════════════════════════════════════════════════════════════

function FaqSectionWithSearch() {
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const filtered = useMemo(() => {
    if (!search.trim()) return faqData;
    const q = search.toLowerCase();
    return faqData.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [search]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- mount detection pattern for SSR hydration fix
  useEffect(() => { setMounted(true); }, []);

  return (
    <motion.section {...fadeUp} className="py-16">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Frequently Asked Questions</h2>
        <p className="text-muted-foreground mt-1">Common questions about CCTV systems</p>
      </div>
      <div className={cn(
        "relative flex items-center rounded-xl border bg-card shadow-sm mb-6 max-w-lg transition-all duration-200",
        search ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-border"
      )}>
        <Search className="h-4 w-4 text-muted-foreground ml-4 shrink-0" />
        <input type="text" placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60" aria-label="Search frequently asked questions" />
        {search && (
          <button onClick={() => setSearch("")} className="mr-3 p-1 rounded-md hover:bg-muted text-muted-foreground"><X className="h-3.5 w-3.5" /></button>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-2xl">
          <HelpCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No matching questions found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Try a different search term</p>
        </div>
      ) : mounted ? (
        <Accordion type="single" collapsible className="space-y-2">
          {filtered.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-4 bg-card hover:bg-accent/30 transition-colors">
              <AccordionTrigger className="text-left font-medium text-sm hover:no-underline py-4">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="space-y-2">
          {filtered.map((item, i) => (
            <div key={i} className="border rounded-xl px-4 bg-card py-4">
              <p className="font-medium text-sm">{item.q}</p>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

// ═══════════════════════════════════════════════════════════════
// CTA SECTION
// ═══════════════════════════════════════════════════════════════

function CtaSection({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <motion.section {...fadeUp} className="py-16">
      <div className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="relative px-8 py-16 lg:px-16 lg:py-20 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">Need Help Choosing the Right Setup?</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Talk to our CCTV experts. We will help you pick the perfect cameras, recorder, and accessories for your specific needs and budget.
            </p>
          </motion.div>
          <motion.div {...staggerContainer} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a {...staggerItem} href="https://wa.me/7809465102" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-8 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-105 transition-all">
                <MessageCircle className="h-5 w-5 mr-2" /> WhatsApp Us
              </Button>
            </motion.a>
            <motion.a {...staggerItem} href="tel:7809465102">
              <Button size="lg" variant="outline" className="rounded-xl px-8 border-white/20 text-white hover:bg-white/10">
                <Phone className="h-5 w-5 mr-2" /> Call Expert
              </Button>
            </motion.a>
            <motion.div {...staggerItem} onClick={() => router.push("/products")} className="inline-block">
              <Button size="lg" variant="outline" className="rounded-xl px-8 border-white/20 text-white hover:bg-white/10">
                <Layers className="h-5 w-5 mr-2" /> Build Your Setup
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

// ═══════════════════════════════════════════════════════════════
// ENHANCED INDIVIDUAL SECTIONS
// ═══════════════════════════════════════════════════════════════

function CameraTypesSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const cam = cameraTypesData.find((c) => c.id === selected);

  return (
    <div className="space-y-6">
      <motion.div {...fadeUp}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Understanding CCTV Camera Types</h2>
        <p className="text-muted-foreground">Click on any camera type to learn in detail. Each card shows where it works best, advantages, and limitations.</p>
      </motion.div>
      <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameraTypesData.map((ct) => (
          <motion.div key={ct.id} {...staggerItem}>
            <Card
              className={cn(
                "cursor-pointer transition-all duration-300 border-2",
                selected === ct.id ? cn(ct.border, "shadow-lg -translate-y-1") : "hover:shadow-lg hover:-translate-y-1"
              )}
              onClick={() => setSelected(selected === ct.id ? null : ct.id)}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", ct.bg, ct.color, ct.border)}>
                    {ct.icon}
                  </motion.div>
                  <div>
                    <h3 className="font-bold">{ct.name}</h3>
                    <p className="text-xs text-muted-foreground">{ct.tagline}</p>
                  </div>
                </div>
                {selected !== ct.id && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{ct.description.slice(0, 120)}...</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <AnimatePresence>
        {cam && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
            <Card className="border-2 overflow-hidden">
              <div className={cn(cam.bg, "p-4 flex items-center gap-3 border-b", cam.border)}>
                <div className={cn("w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm", cam.color)}>{cam.icon}</div>
                <div><h3 className="text-xl font-bold">{cam.name}</h3><p className="text-sm text-muted-foreground">{cam.tagline}</p></div>
              </div>
              <CardContent className="p-6 space-y-6">
                <p className="text-muted-foreground leading-relaxed">{cam.description}</p>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Best For</h4>
                  <div className="flex flex-wrap gap-2">
                    {cam.bestFor.map((b) => (<Badge key={b} variant="outline" className={cn(cam.border, cam.textColor)}>{b}</Badge>))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Advantages</h4>
                    <ul className="space-y-1.5">{cam.pros.map((p) => (<li key={p} className="text-sm flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /><span>{p}</span></li>))}</ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2 text-red-600"><XCircle className="h-4 w-4" /> Limitations</h4>
                    <ul className="space-y-1.5">{cam.cons.map((c) => (<li key={c} className="text-sm flex items-start gap-2"><XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" /><span>{c}</span></li>))}</ul>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2"><Settings className="h-4 w-4" /> Typical Specifications</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(cam.specs).map(([key, val]) => (
                      <Card key={key} className="bg-muted/50"><CardContent className="p-3"><p className="text-xs text-muted-foreground uppercase tracking-wide">{key.replace(/([A-Z])/g, " $1")}</p><p className="font-medium text-sm mt-1">{val}</p></CardContent></Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DvrNvrSection() {
  const d = dvrNvrData.dvr;
  const n = dvrNvrData.nvr;
  return (
    <div className="space-y-6">
      <motion.div {...fadeUp}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">DVR vs NVR — Which One Do You Need?</h2>
        <p className="text-muted-foreground">The recorder is the brain of your CCTV system. Understanding this difference is the most important decision you will make.</p>
      </motion.div>
      <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[d, n].map((item, i) => (
          <motion.div key={item.name} {...staggerItem}>
            <Card className={cn(premiumCard, "overflow-hidden", i === 0 ? "border-sky-200" : "border-emerald-200")}>
              <div className={cn("p-4 border-b flex items-center gap-3", i === 0 ? "bg-sky-50 border-sky-200" : "bg-emerald-50 border-emerald-200")}>
                <div className={cn("text-lg", i === 0 ? "text-sky-700" : "text-emerald-700")}>{item.icon}</div>
                <h3 className={cn("font-bold", i === 0 ? "text-sky-700" : "text-emerald-700")}>{item.name}</h3>
              </div>
              <CardContent className="p-5 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                <div className="space-y-2">
                  {[
                    { label: "Technology", value: item.technology },
                    { label: "Cable", value: item.cable },
                    { label: "Max Resolution", value: item.maxResolution },
                    { label: "Channels", value: item.channels },
                    { label: "Brands", value: item.brands },
                    { label: "Price Range", value: item.priceRange },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-medium text-right max-w-[60%]">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Compatibility Note</p>
                  <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1">{item.compatibility}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function CompatibilitySection() {
  return (
    <div className="space-y-6">
      <motion.div {...fadeUp}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Brand Compatibility Guide</h2>
        <p className="text-muted-foreground">Understanding which cameras work with which recorders is critical. A wrong combination means your system simply will not work.</p>
      </motion.div>
      <motion.div {...fadeUp}>
        <Card className={cn(premiumCard, "overflow-hidden")}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Camera Brand</th>
                  <th className="px-4 py-3 text-left font-semibold">Recorder Brand</th>
                  <th className="px-4 py-3 text-left font-semibold">Compatible?</th>
                  <th className="px-4 py-3 text-left font-semibold">Technology</th>
                  <th className="px-4 py-3 text-left font-semibold">Note</th>
                </tr>
              </thead>
              <tbody>
                {compatibilityData.map((row, i) => (
                  <tr key={i} className={cn("border-t border-border/50", i % 2 === 0 ? "" : "bg-muted/20")}>
                    <td className="px-4 py-2.5 font-medium">{row.brand1}</td>
                    <td className="px-4 py-2.5 font-medium">{row.brand2}</td>
                    <td className="px-4 py-2.5">
                      {row.works ? (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"><CheckCircle2 className="h-3 w-3 mr-1" /> Yes</Badge>
                      ) : (
                        <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> No</Badge>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.tech}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
      <motion.div {...fadeUp}>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
          <h3 className="font-bold flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2"><AlertTriangle className="h-5 w-5" /> Important Rule</h3>
          <p className="text-sm text-amber-700/80 dark:text-amber-400/80 leading-relaxed">Always match your camera brand with the same brand recorder for analog systems. For IP/NVR systems, ONVIF protocol provides basic cross-brand compatibility, but advanced smart features (face detection, line crossing) typically only work with same-brand setups.</p>
        </div>
      </motion.div>
    </div>
  );
}

function MobileSetupSection() {
  return (
    <div className="space-y-8">
      <motion.div {...fadeUp}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Mobile Viewing Setup</h2>
        <p className="text-muted-foreground">Watch your CCTV cameras from anywhere in the world using your smartphone. Here are the step-by-step instructions for the most popular apps.</p>
      </motion.div>
      {mobileAppsData.map((brand) => (
        <motion.div key={brand.brand} {...fadeUp}>
          <Card className={cn(premiumCard, "overflow-hidden")}>
            <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-lg">{brand.brand}</h3>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-wrap gap-3">
                {brand.apps.map((app) => (
                  <Badge key={app.name} variant="outline" className={cn("px-3 py-1.5 text-sm", app.color)}>
                    <Smartphone className="h-3.5 w-3.5 mr-1" /> {app.name}
                    <span className="ml-2 opacity-70">{app.use}</span>
                  </Badge>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Setup Steps</h4>
                {brand.steps.map((step, si) => (
                  <div key={si} className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{si + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function BudgetGuideSection() {
  return (
    <div className="space-y-8">
      <motion.div {...fadeUp}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Budget Guide — Find Your Perfect Setup</h2>
        <p className="text-muted-foreground">Your budget determines the quality, number of cameras, and features you can get. Here are recommended setups for every budget range.</p>
      </motion.div>
      <motion.div {...staggerContainer} className="space-y-5">
        {budgetGuides.map((guide) => (
          <motion.div key={guide.range} {...staggerItem}>
            <Card className={cn(premiumCard, "overflow-hidden")}>
              <div className={cn("p-4 border-b flex items-center gap-3", guide.lightColor, guide.borderColor)}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", guide.color, "text-white")}>{guide.icon}</div>
                <div className="flex-1">
                  <h3 className={cn("font-bold", guide.textColor)}>{guide.label}</h3>
                  <p className="text-sm font-semibold">{guide.range}</p>
                </div>
              </div>
              <CardContent className="p-5 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{guide.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Recommended Setup:</h4>
                  {guide.recommended.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Estimated Total</p>
                    <p className={cn("font-bold text-lg", guide.textColor)}>{guide.totalCost}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">WiFi Alternative</p>
                    <p className="font-medium text-sm mt-1">{guide.alternative}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function InstallationSection() {
  return (
    <div className="space-y-8">
      <motion.div {...fadeUp}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Installation Guide</h2>
        <p className="text-muted-foreground">Follow these steps to set up your CCTV system correctly. Whether you are installing a wired DVR/NVR system or a simple WiFi camera, this guide covers everything.</p>
      </motion.div>

      <motion.div {...staggerContainer} className="space-y-4">
        {installSteps.map((item, i) => (
          <motion.div key={i} {...staggerItem}>
            <Card className={cn(premiumCard, "overflow-hidden")}>
              <CardContent className="p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0 text-emerald-700 dark:text-emerald-300 font-bold text-lg">
                  {i + 1}
                </div>
                <div className="flex-1 pb-4 border-b border-muted last:border-0 last:pb-0">
                  <h4 className="font-semibold text-sm">{item.step}</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.detail}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div {...fadeUp}>
        <Card className={cn(premiumCard, "bg-slate-50 dark:bg-slate-900/30")}>
          <CardHeader><CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5" /> Tools You Will Need</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                "Drill machine + drill bits", "Screwdriver set", "RG59 coaxial cable", "BNC connectors / couplers",
                "Power cable (2-core)", "Cable clips / ties", "Ethernet cable (Cat5e/Cat6)", "HDMI cable",
                "SATA HDD (1TB-2TB)", "Ladder / step stool", "Measuring tape", "Cable tester (optional)",
              ].map((tool) => (
                <div key={tool} className="flex items-center gap-2 bg-background rounded-lg p-3 border text-sm">
                  <Wrench className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {tool}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// OVERVIEW (Dashboard) SECTION
// ═══════════════════════════════════════════════════════════════

function OverviewSection({ setLearnSection, activeCategory, setActiveCategory }: {
  setLearnSection: (s: string) => void; activeCategory: string; setActiveCategory: (c: string) => void;
}) {
  return (
    <div className="space-y-12">
      <CategoryFilters active={activeCategory} onChange={setActiveCategory} />
      <ModuleCards setLearnSection={setLearnSection} activeCategory={activeCategory} />
      <InteractiveFlowDiagram />
      <FeaturedArticles />
      <VideoTutorials />
      <DownloadsSection />
      <ComparisonTables />
      <FaqSectionWithSearch />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN LEARNING SYSTEM
// ═══════════════════════════════════════════════════════════════

export function LearningSystem() {
  const { learnSection, setLearnSection } = useStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const handleTopicClick = (topic: string) => {
    const mapping: Record<string, string> = {
      "CCTV Camera Types": "camera-types",
      "DVR vs NVR": "dvr-nvr",
      "Hikvision Compatibility": "compatibility",
      "Mobile App Setup": "mobile-setup",
      "WiFi Camera Installation": "camera-types",
      "Night Vision Comparison": "camera-types",
      "HDD Storage Calculation": "budget",
      "PTZ Camera Guide": "camera-types",
      "Budget Setup Under 10K": "budget",
      "ColorVu vs IR": "camera-types",
    };
    const section = mapping[topic];
    if (section) setLearnSection(section);
  };

  const handleStartLearning = () => {
    setLearnSection("camera-types");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderSection = () => {
    switch (learnSection) {
      case "camera-types": return <CameraTypesSection />;
      case "dvr-nvr": return <DvrNvrSection />;
      case "compatibility": return <CompatibilitySection />;
      case "mobile-setup": return <MobileSetupSection />;
      case "budget": return <BudgetGuideSection />;
      case "installation": return <InstallationSection />;
      case "faq": return <FaqSectionWithSearch />;
      default: return <OverviewSection setLearnSection={setLearnSection} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero - only on overview */}
      {learnSection === "overview" && (
        <HeroSection onStartLearning={handleStartLearning} onBrowseProducts={() => router.push("/products")} />
      )}

      {/* Search - only on overview */}
      {learnSection === "overview" && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <LearningSearch value={searchQuery} onChange={setSearchQuery} onTopicClick={handleTopicClick} />
        </div>
      )}

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => router.push("/products")} className="hover:text-foreground transition-colors">Catalog</button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">Learning Center</span>
          {learnSection !== "overview" && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <button onClick={() => setLearnSection("overview")} className="hover:text-foreground transition-colors">{learnSections.find((s) => s.id === learnSection)?.label}</button>
            </>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 pb-20">
          <SidebarNav
            learnSection={learnSection}
            setLearnSection={setLearnSection}
            mobileOpen={mobileSidebar}
            setMobileOpen={setMobileSidebar}
            router={router}
          />

          <div className="flex-1 min-w-0">
            {/* Progress - only on overview */}
            {learnSection === "overview" && <LearningProgress />}

            {/* Section content */}
            {renderSection()}

            {/* CTA - only on overview */}
            {learnSection === "overview" && <CtaSection router={router} />}
          </div>
        </div>
      </div>
    </div>
  );
}
