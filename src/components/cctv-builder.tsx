"use client";
/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useBuilderStore, type CameraSelection, type CameraSystem, type CameraTech, type PropertyType, normalizeResolution, cameraTypeToForm } from "@/store/builder-store";
import type { CctvProduct } from "@/store/cctv-store";
import { useStore } from "@/store/cctv-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { WhatsAppShare } from "@/components/whatsapp-button";
import { RazorpayCheckout } from "@/components/razorpay-checkout";
import {
  Home, Building2, Store, Warehouse, Factory, UtensilsCrossed,
  GraduationCap, Hospital, Castle, HelpCircle,
  Camera, Wifi, Cable, Radio, Shield, HardDrive, Cloud,
  Monitor, Plug, Plus, Minus, CheckCircle2,
  AlertTriangle, Lightbulb, Router, Zap, Box, Link,
  RotateCcw, Info, Volume2, MessageSquare,
  Moon, Palette, Server, Copy, Printer,
  Mouse, Keyboard, Search, Package,
  Sparkles, ChevronDown, ChevronRight, ChevronUp,
  Clock, MessageCircle, Phone, Download, Layers,
  Star, Eye, ArrowRight, X, Bot, Trophy,
  Ruler, CircleDot, Cpu, Battery, EthernetPort,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } } };
const slideDown = { hidden: { opacity: 0, height: 0 }, visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeOut" } }, exit: { opacity: 0, height: 0, transition: { duration: 0.2 } } };
const countUp = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };

const fmt = (n: number) => "\u20b9" + n.toLocaleString("en-IN");

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════════════════

const propertyTypes: { value: PropertyType; label: string; icon: React.ReactNode; desc: string; camRange: string }[] = [
  { value: "home", label: "Home", icon: <Home className="h-7 w-7" />, desc: "Independent house or residential property", camRange: "4\u20138 Cameras" },
  { value: "apartment", label: "Apartment", icon: <Building2 className="h-7 w-7" />, desc: "Flat in a multi-story building", camRange: "2\u20134 Cameras" },
  { value: "office", label: "Office", icon: <Building2 className="h-7 w-7" />, desc: "Commercial office space", camRange: "6\u201316 Cameras" },
  { value: "shop", label: "Shop", icon: <Store className="h-7 w-7" />, desc: "Retail shop or showroom", camRange: "4\u20138 Cameras" },
  { value: "warehouse", label: "Warehouse", icon: <Warehouse className="h-7 w-7" />, desc: "Storage or warehouse facility", camRange: "8\u201320 Cameras" },
  { value: "factory", label: "Factory", icon: <Factory className="h-7 w-7" />, desc: "Manufacturing unit", camRange: "10\u201324 Cameras" },
  { value: "restaurant", label: "Restaurant", icon: <UtensilsCrossed className="h-7 w-7" />, desc: "Food and hospitality", camRange: "4\u20138 Cameras" },
  { value: "hospital", label: "Hospital", icon: <Hospital className="h-7 w-7" />, desc: "Healthcare facility", camRange: "16\u201332 Cameras" },
  { value: "school", label: "School", icon: <GraduationCap className="h-7 w-7" />, desc: "Educational institution", camRange: "12\u201324 Cameras" },
  { value: "villa", label: "Villa", icon: <Castle className="h-7 w-7" />, desc: "Large villa or farmhouse", camRange: "8\u201316 Cameras" },
  { value: "other", label: "Other", icon: <HelpCircle className="h-7 w-7" />, desc: "Any other property type", camRange: "2\u201316 Cameras" },
];

const cameraSystems: { value: CameraSystem; label: string; icon: React.ReactNode; desc: string; pros: string[]; bestFor: string; priceImpact: string }[] = [
  { value: "analog", label: "Analog HD-TVI/HD-CVI", icon: <Cable className="h-7 w-7" />, desc: "Uses coaxial cable + DVR. Budget-friendly, easy to install, reliable for standard setups.", pros: ["Most affordable system", "Easy installation", "Long cable runs (300m+)", "Proven reliable technology"], bestFor: "Budget setups, small homes, shops", priceImpact: "\u20b92,000\u2013\u2044\u20444,000/kit" },
  { value: "ip", label: "IP Network Camera", icon: <Wifi className="h-7 w-7" />, desc: "Uses Ethernet cable + NVR with PoE. Best quality, single cable for data+power, smart AI features.", pros: ["Best video quality (up to 12MP)", "PoE \u2014 one cable for data+power", "Smart AI features", "ONVIF cross-brand compatible"], bestFor: "Offices, factories, premium homes", priceImpact: "\u20b95,000\u2013\u2044\u204415,000/kit" },
  { value: "wifi", label: "WiFi Wireless", icon: <Radio className="h-7 w-7" />, desc: "No cables needed. Camera connects to WiFi, stores on MicroSD or cloud. No DVR/NVR needed.", pros: ["Zero cable installation", "DIY friendly", "MicroSD + Cloud storage", "Instant mobile alerts"], bestFor: "Apartments, temporary setups, DIY", priceImpact: "\u20b91,500\u2013\u2044\u20445,000/camera" },
];

const cameraTechs: { value: CameraTech; label: string; icon: React.ReactNode; desc: string; bestFor: string; priceImpact: string }[] = [
  { value: "night_vision", label: "Night Vision (IR)", icon: <Moon className="h-5 w-5" />, desc: "Black & white recording in darkness using infrared LEDs. Reliable, long-range (20-80m).", bestFor: "General outdoor/indoor", priceImpact: "Base price" },
  { value: "night_vision_audio", label: "Night Vision + Audio", icon: <Volume2 className="h-5 w-5" />, desc: "IR night vision with built-in microphone for audio recording.", bestFor: "Offices, reception areas", priceImpact: "+\u20b9200\u2013\u2044\u2044500" },
  { value: "color_audio", label: "Full Color + Audio", icon: <Palette className="h-5 w-5" />, desc: "Records in full color even at night using ColorVu technology. Includes audio.", bestFor: "Entrances, parking, retail", priceImpact: "+\u20b9500\u2013\u2044\u20441,000" },
  { value: "two_way_talk", label: "Two-Way Talk", icon: <MessageSquare className="h-5 w-5" />, desc: "Full color night vision + audio + speaker for two-way communication through app.", bestFor: "Gates, reception, delivery", priceImpact: "+\u20b9800\u2013\u2044\u20441,500" },
];

const retentionOptions = [7, 10, 15, 20, 30, 45, 60, 90];

const STEPS = [
  { num: 1, title: "Property Type", short: "Property" },
  { num: 2, title: "Area", short: "Area" },
  { num: 3, title: "Recommendation", short: "Cameras" },
  { num: 4, title: "System Type", short: "System" },
  { num: 5, title: "Technology", short: "Tech" },
  { num: 6, title: "Select Cameras", short: "Products" },
  { num: 7, title: "Recorder", short: "DVR/NVR" },
  { num: 8, title: "Power Supply", short: "Power" },
  { num: 9, title: "Storage", short: "HDD" },
  { num: 10, title: "Cables", short: "Cables" },
  { num: 11, title: "Accessories", short: "Extras" },
] as const;

const areaMilestones = [
  { sqft: 500, label: "Apartment" },
  { sqft: 1200, label: "Small House" },
  { sqft: 2500, label: "Villa" },
  { sqft: 5000, label: "Warehouse" },
  { sqft: 10000, label: "Factory" },
];

const aiTips = [
  { q: "Need help?", a: "I can guide you through each step of building your CCTV system." },
  { q: "Explain NVR", a: "NVR (Network Video Recorder) works with IP cameras over Ethernet. It provides better quality, PoE power, and AI features compared to DVR." },
  { q: "Recommend WiFi?", a: "WiFi cameras are great for apartments or DIY setups where cabling is difficult. However, they depend on signal strength." },
  { q: "What is ColorVu?", a: "ColorVu technology records in full color even in complete darkness using special lenses and warm-light LEDs. Great for identifying people at night." },
  { q: "Suggest upgrades", a: "Consider upgrading to IP system for better quality, or add Two-Way Talk cameras at entrance points for remote communication." },
];

// ═══════════════════════════════════════════════════════════════
// CCTV DOMAIN-ACCURATE CALCULATION ENGINE
// ═══════════════════════════════════════════════════════════════

function getCameraSuggestion(area: number, propType: PropertyType): { min: number; max: number; suggested: number } {
  const camerasPer1000sqft: Record<PropertyType, number> = {
    home: 1.2, apartment: 1.5, office: 1.8, shop: 2.0,
    warehouse: 0.8, factory: 1.0, restaurant: 2.5, hospital: 2.0,
    school: 1.5, villa: 1.0, other: 1.2
  };
  const rate = camerasPer1000sqft[propType] || 1.2;
  const suggested = Math.max(2, Math.ceil((area / 1000) * rate));
  return { min: Math.max(2, suggested - 2), max: suggested + 4, suggested };
}

function getRecorderConfig(totalCameras: number, system: CameraSystem): { type: string; units: { channels: number; usedPorts: number }[]; summary: string; exceedsMax: boolean } {
  if (system === "wifi") {
    return { type: "None", units: [], summary: "WiFi cameras do not need a DVR/NVR. They record on MicroSD card or cloud.", exceedsMax: false };
  }
  const type = system === "analog" ? "DVR" : "NVR";
  const availableChannels = system === "analog" ? [4, 8, 16, 32] : [4, 8, 16, 32, 64, 128, 256];
  const maxSingleUnit = availableChannels[availableChannels.length - 1];
  const exceedsMax = totalCameras > maxSingleUnit;
  const units: { channels: number; usedPorts: number }[] = [];
  let remaining = totalCameras;
  while (remaining > 0) {
    const fitting = availableChannels.filter(ch => ch >= remaining);
    const chosen = fitting.length > 0 ? fitting[0] : availableChannels[availableChannels.length - 1];
    const used = Math.min(remaining, chosen);
    units.push({ channels: chosen, usedPorts: used });
    remaining -= used;
  }
  if (units.length === 1) {
    const u = units[0];
    return { type, units, summary: `${type} ${u.channels}-Channel (${u.usedPorts} camera${u.usedPorts > 1 ? 's' : ''} connected)`, exceedsMax };
  }
  const unitDescs = units.map(u => u.usedPorts === u.channels ? `${u.channels}ch` : `${u.channels}ch (${u.usedPorts} used)`).join(" + ");
  const totalChannels = units.reduce((s, u) => s + u.channels, 0);
  return { type, units, summary: `${units.length}x ${type} units: ${unitDescs} = ${totalChannels} total channels for ${totalCameras} cameras`, exceedsMax };
}

function getPowerConfig(totalCameras: number, system: CameraSystem, hasAbove2mp: boolean): { units: { type: string; ports: number; usedPorts: number; variant: "standard" | "giga" }[]; summary: string } {
  if (system === "wifi") return { units: [], summary: "WiFi cameras use included 12V adapters. No separate power supply needed." };
  if (system === "analog") {
    const smpsOptions = [4, 8, 16];
    const units: { type: string; ports: number; usedPorts: number; variant: "standard" | "giga" }[] = [];
    let remaining = totalCameras;
    while (remaining > 0) {
      const fitting = smpsOptions.filter(ch => ch >= remaining);
      const chosen = fitting.length > 0 ? fitting[0] : smpsOptions[smpsOptions.length - 1];
      const used = Math.min(remaining, chosen);
      units.push({ type: "SMPS Power Supply", ports: chosen, usedPorts: used, variant: "standard" });
      remaining -= used;
    }
    const unitDescs = units.map(u => u.usedPorts === u.ports ? `${u.ports}-Channel SMPS` : `${u.ports}-Channel SMPS (${u.usedPorts} used)`).join(" + ");
    return { units, summary: `${units.length}x SMPS units: ${unitDescs} (12V DC)` };
  }
  const poeOptions = [4, 8, 16, 24];
  const variant: "standard" | "giga" = hasAbove2mp ? "giga" : "standard";
  const units: { type: string; ports: number; usedPorts: number; variant: "standard" | "giga" }[] = [];
  let remaining = totalCameras;
  while (remaining > 0) {
    const fitting = poeOptions.filter(ch => ch >= remaining);
    const chosen = fitting.length > 0 ? fitting[0] : poeOptions[poeOptions.length - 1];
    const used = Math.min(remaining, chosen);
    units.push({ type: "PoE Switch", ports: chosen, usedPorts: used, variant });
    remaining -= used;
  }
  const variantLabel = variant === "giga" ? "Gigabit" : "Fast Ethernet";
  const unitDescs = units.map(u => u.usedPorts === u.ports ? `${u.ports}-Port ${variantLabel}` : `${u.ports}-Port (${u.usedPorts} used)`).join(" + ");
  return { units, summary: `${units.length}x ${variantLabel} PoE switches: ${unitDescs}` };
}

const BITRATE_GB_PER_DAY: Record<string, number> = { "1MP": 7.6, "2MP": 15.1, "3MP": 22.7, "4MP": 30.2, "5MP": 45.4, "8MP": 60.5, "12MP": 120.9 };
const HDD_SIZES_GB = [500, 1000, 2000, 3000, 4000, 6000, 8000, 10000, 12000, 16000];

function calculateHdd(cameraSelections: CameraSelection[], retentionDays: number): { size: string; breakdown: string } {
  if (cameraSelections.length === 0 || retentionDays <= 0) return { size: "", breakdown: "" };
  let totalGB = 0;
  for (const cam of cameraSelections) {
    const gbPerDay = BITRATE_GB_PER_DAY[cam.mp] || 30.2;
    totalGB += gbPerDay * cam.qty * retentionDays;
  }
  let hddLabel = "";
  for (const size of HDD_SIZES_GB) {
    if (size >= totalGB) { hddLabel = size >= 1000 ? `${size / 1000} TB` : `${size} GB`; break; }
  }
  if (!hddLabel) hddLabel = `${Math.ceil(totalGB / 1000)}+ TB (Multiple HDDs needed)`;
  return { size: hddLabel, breakdown: `Total: ~${(totalGB / 1024).toFixed(1)} TB for ${retentionDays} days retention` };
}

function getTotalCableMeters(cameraQty: number, metersPerCam: number): number { return cameraQty * metersPerCam; }
function getCableRolls(totalMeters: number, rollLength: number): number { return Math.ceil(totalMeters / rollLength); }

// ═══════════════════════════════════════════════════════════════
// SMALL SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function QtyControl({ value, onChange, min = 0, max = 256 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <motion.button whileTap={{ scale: 0.9 }} className="w-7 h-7 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease quantity"><Minus className="h-3 w-3" /></motion.button>
      <span className="w-10 text-center font-bold text-sm tabular-nums">{value}</span>
      <motion.button whileTap={{ scale: 0.9 }} className="w-7 h-7 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity"><Plus className="h-3 w-3" /></motion.button>
    </div>
  );
}

function AnimatedPrice({ value }: { value: number }) {
  return <motion.span key={value} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="font-bold tabular-nums">{fmt(value)}</motion.span>;
}

// ═══════════════════════════════════════════════════════════════
// MAIN BUILDER COMPONENT
// ═══════════════════════════════════════════════════════════════

export function CctvBuilder() {
  const store = useBuilderStore();
  const router = useRouter();
  const wizardRef = useRef<HTMLDivElement>(null);

  // ─── UI State ───
  const [activeStep, setActiveStep] = useState(1);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiIdx, setAiIdx] = useState(0);
  const [summaryDrawerOpen, setSummaryDrawerOpen] = useState(false);
  const [collapsedSteps, setCollapsedSteps] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

  // ─── Derived State ───
  const area = parseFloat(store.areaSqft) || 0;
  const hasPropertyType = store.propertyType !== "";
  const hasArea = area > 0;
  const hasSystem = store.cameraSystem !== "";
  const hasTech = store.cameraTechs.length > 0;

  const cameraSuggestion = useMemo(() => {
    if (!hasPropertyType || !hasArea) return null;
    return getCameraSuggestion(area, store.propertyType as PropertyType);
  }, [hasPropertyType, hasArea, area, store.propertyType]);

  const totalCameras = useMemo(() => store.cameraSelections.reduce((s, c) => s + c.qty, 0), [store.cameraSelections]);
  const hasAbove2mp = useMemo(() => store.cameraSelections.some(c => c.mp !== "2MP"), [store.cameraSelections]);
  const recorderConfig = useMemo(() => { if (totalCameras === 0) return null; return getRecorderConfig(totalCameras, store.cameraSystem as CameraSystem); }, [totalCameras, store.cameraSystem]);
  const powerConfig = useMemo(() => { if (totalCameras === 0) return null; return getPowerConfig(totalCameras, store.cameraSystem as CameraSystem, hasAbove2mp); }, [totalCameras, store.cameraSystem, hasAbove2mp]);
  const hddCalc = useMemo(() => { if (totalCameras === 0 || store.cameraSystem === "wifi") return { size: "", breakdown: "" }; return calculateHdd(store.cameraSelections, store.retentionDays); }, [totalCameras, store.cameraSelections, store.retentionDays, store.cameraSystem]);
  const totalCableMeters = useMemo(() => getTotalCableMeters(totalCameras, store.cableLengthPerCamera), [totalCameras, store.cableLengthPerCamera]);
  const cableRolls90 = useMemo(() => getCableRolls(totalCableMeters, 90), [totalCableMeters]);
  const cableRolls180 = useMemo(() => getCableRolls(totalCableMeters, 180), [totalCableMeters]);
  const cableRolls100 = useMemo(() => getCableRolls(totalCableMeters, 100), [totalCableMeters]);
  const cableRolls305 = useMemo(() => getCableRolls(totalCableMeters, 305), [totalCableMeters]);

  // ─── Progress ───
  const stepDone = useCallback((step: number) => {
    switch (step) {
      case 1: return hasPropertyType;
      case 2: return hasArea;
      case 3: return hasArea;
      case 4: return hasSystem;
      case 5: return hasTech;
      case 6: return totalCameras > 0;
      case 7: return recorderConfig !== null;
      case 8: return powerConfig !== null || store.cameraSystem === "wifi";
      case 9: return hddCalc.size !== "" || store.cameraSystem === "wifi";
      case 10: return totalCameras > 0;
      case 11: return totalCameras > 0;
      default: return false;
    }
  }, [hasPropertyType, hasArea, hasSystem, hasTech, totalCameras, recorderConfig, powerConfig, hddCalc.size, store.cameraSystem]);

  const completedSteps = STEPS.filter(s => stepDone(s.num)).length;
  const progressPct = Math.round((completedSteps / STEPS.length) * 100);
  const estMinutesLeft = Math.max(1, Math.round((STEPS.length - completedSteps) * 0.5));

  // Auto-advance active step
  useEffect(() => {
    for (let i = STEPS.length - 1; i >= 0; i--) {
      const s = STEPS[i];
      if (stepDone(s.num)) { setActiveStep(s.num + 1 <= STEPS.length ? s.num + 1 : STEPS.length); break; }
    }
  }, [stepDone]);

  // Auto-scroll to active step
  const stepRefs = useRef<Record<number, HTMLDivElement | null>>({});
  useEffect(() => {
    const el = stepRefs.current[activeStep];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeStep]);

  // ─── Sync auto-calculated values ───
  useEffect(() => { if (recorderConfig) store.setRecorderUnits(recorderConfig.units.map(u => ({ ...u, type: recorderConfig.type }))); else store.setRecorderUnits([]); }, [recorderConfig, store.setRecorderUnits]);
  useEffect(() => { if (powerConfig) store.setPowerUnits(powerConfig.units); else store.setPowerUnits([]); }, [powerConfig, store.setPowerUnits]);
  useEffect(() => { store.setHddSuggestion(hddCalc.size); store.setHddBreakdown(hddCalc.breakdown); }, [hddCalc.size, hddCalc.breakdown, store.setHddSuggestion, store.setHddBreakdown]);
  useEffect(() => { if (cameraSuggestion) store.setSuggestedCameras(cameraSuggestion.suggested); }, [cameraSuggestion, store.setSuggestedCameras]);

  useEffect(() => {
    if (totalCameras === 0) { store.setJunctionBox4x4(0); store.setJunctionBox5x5(0); store.setDcConnector(0); store.setBncConnector(0); store.setRj45Connector(0); return; }
    const bulletCount = store.cameraSelections.filter(c => c.form === "bullet").reduce((s, c) => s + c.qty, 0);
    const domeCount = store.cameraSelections.filter(c => c.form === "dome").reduce((s, c) => s + c.qty, 0);
    if (store.cameraSystem === "analog") { store.setJunctionBox4x4(bulletCount); store.setJunctionBox5x5(domeCount); store.setDcConnector(totalCameras); store.setBncConnector(totalCameras * 2); store.setRj45Connector(0); }
    else if (store.cameraSystem === "ip") { store.setJunctionBox4x4(bulletCount); store.setJunctionBox5x5(domeCount); store.setDcConnector(0); store.setBncConnector(0); store.setRj45Connector(totalCameras * 2); }
    else { store.setJunctionBox4x4(0); store.setJunctionBox5x5(0); store.setDcConnector(0); store.setBncConnector(0); store.setRj45Connector(0); }
  }, [totalCameras, store.cameraSystem, store.cameraSelections, store.setJunctionBox4x4, store.setJunctionBox5x5, store.setDcConnector, store.setBncConnector, store.setRj45Connector]);

  // ─── Product Fetching ───
  const [availableProducts, setAvailableProducts] = useState<CctvProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productTypeFilter, setProductTypeFilter] = useState("all");

  useEffect(() => {
    if (!store.cameraSystem) return;
    setProductsLoading(true);
    fetch("/api/products?sortBy=price&order=asc").then(r => r.json()).then(data => {
      if (data.success) {
        const cameras = (data.data as CctvProduct[]).filter((p: CctvProduct) => {
          if (p.cameraType === "DVR" || p.cameraType === "NVR") return false;
          if (store.cameraSystem === "analog") return p.recorderType === "DVR" || p.technology === "HD-TVI" || p.technology === "HD-CVI" || p.technology === "AHD";
          if (store.cameraSystem === "ip") return p.recorderType === "NVR" || p.recorderType === "Cloud/NVR" || p.technology === "IP";
          if (store.cameraSystem === "wifi") return p.cameraType === "WiFi" || p.cameraType === "4G" || p.technology === "WiFi IP" || p.recorderType === "Cloud/SD Card";
          return true;
        });
        setAvailableProducts(cameras);
      }
    }).catch(() => setAvailableProducts([])).finally(() => setProductsLoading(false));
  }, [store.cameraSystem]);

  const filteredProducts = useMemo(() => {
    let list = availableProducts;
    if (productTypeFilter !== "all") list = list.filter(p => p.cameraType === productTypeFilter);
    if (productSearch) { const s = productSearch.toLowerCase(); list = list.filter(p => p.brand.toLowerCase().includes(s) || p.modelName.toLowerCase().includes(s) || p.resolution.toLowerCase().includes(s)); }
    return list;
  }, [availableProducts, productSearch, productTypeFilter]);

  // ─── Product handlers ───
  const addProduct = (product: CctvProduct) => {
    const current = [...store.cameraSelections];
    const idx = current.findIndex(c => c.productId === product.id);
    const defaultTech = store.cameraTechs.length > 0 ? store.cameraTechs[0] : "night_vision" as CameraTech;
    if (idx >= 0) { current[idx] = { ...current[idx], qty: Math.min(256, current[idx].qty + 1) }; }
    else { current.push({ productId: product.id, brand: product.brand, modelName: product.modelName, mp: normalizeResolution(product.resolution), form: cameraTypeToForm(product.cameraType), qty: 1, tech: defaultTech, price: product.price, salePrice: product.salePrice, imageUrl: product.imageUrl || "", cameraType: product.cameraType }); }
    store.setCameraSelections(current);
  };
  const updateSelectionQty = (productId: string, newQty: number) => {
    const current = [...store.cameraSelections]; const idx = current.findIndex(c => c.productId === productId);
    if (idx < 0) return;
    if (newQty <= 0) current.splice(idx, 1); else current[idx] = { ...current[idx], qty: Math.min(256, newQty) };
    store.setCameraSelections(current);
  };
  const updateSelectionTech = (productId: string, tech: CameraTech) => {
    const current = [...store.cameraSelections]; const idx = current.findIndex(c => c.productId === productId);
    if (idx >= 0) { current[idx] = { ...current[idx], tech }; store.setCameraSelections(current); }
  };
  const removeSelection = (productId: string) => { store.setCameraSelections(store.cameraSelections.filter(c => c.productId !== productId)); };

  const totalPrice = useMemo(() => store.cameraSelections.reduce((s, c) => { const unitPrice = c.salePrice && c.salePrice < c.price ? c.salePrice : c.price; return s + unitPrice * c.qty; }, 0), [store.cameraSelections]);

  // ─── Quote text ───
  const quoteText = (() => {
    const lines: string[] = ["=== CCTV SETUP QUOTE - ConnectZ Sales & Services ===", "", "Property: " + (propertyTypes.find(p => p.value === store.propertyType)?.label || "-"), "Area: " + (store.areaSqft || "-") + " sq ft", "System: " + (store.cameraSystem || "-").toUpperCase(), "", "--- CAMERAS ---"];
    for (const cam of store.cameraSelections) { const techLabel = cameraTechs.find(t => t.value === cam.tech)?.label || cam.tech; const unitPrice = cam.salePrice && cam.salePrice < cam.price ? cam.salePrice : cam.price; lines.push(`${cam.qty}x ${cam.brand} ${cam.modelName} (${cam.mp} ${cam.cameraType}, ${techLabel}) - ${fmt(unitPrice)} each = ${fmt(unitPrice * cam.qty)}`); }
    lines.push("Total Cameras: " + totalCameras, "Camera Subtotal: " + fmt(totalPrice));
    if (recorderConfig && recorderConfig.units.length > 0) { lines.push("", "--- RECORDER ---", recorderConfig.summary); }
    if (powerConfig && powerConfig.units.length > 0) { lines.push("", "--- POWER SUPPLY ---", powerConfig.summary); }
    if (hddCalc.size) { lines.push("", "--- STORAGE ---", "HDD Required: " + hddCalc.size, "Retention: " + store.retentionDays + " days", hddCalc.breakdown); }
    if (store.cameraSystem !== "wifi" && totalCameras > 0) { lines.push("", "--- CABLING ---", "Total Cable: " + totalCableMeters + " meters (" + store.cableLengthPerCamera + "m per camera)"); if (store.cameraSystem === "analog") lines.push("Coaxial 90m rolls: " + cableRolls90 + " OR 180m rolls: " + cableRolls180); else lines.push("Cat6 100m rolls: " + cableRolls100 + " OR 305m rolls: " + cableRolls305); }
    lines.push("", "--- ACCESSORIES ---");
    if (store.junctionBox4x4 > 0) lines.push("Junction Box 4x4: " + store.junctionBox4x4);
    if (store.junctionBox5x5 > 0) lines.push("Junction Box 5x5: " + store.junctionBox5x5);
    if (store.dcConnector > 0) lines.push("DC Connector: " + store.dcConnector);
    if (store.bncConnector > 0) lines.push("BNC Connector: " + store.bncConnector);
    if (store.rj45Connector > 0) lines.push("RJ45 Connector: " + store.rj45Connector);
    if (store.networkingRack > 0) lines.push("Networking Rack: " + store.networkingRack);
    if (store.monitor > 0) lines.push("Monitor " + store.monitorSize + "\" : " + store.monitor);
    if (store.extensionBoard > 0) lines.push("Extension Board: " + store.extensionBoard);
    if (store.wirelessMouse > 0) lines.push("Wireless Mouse: " + store.wirelessMouse);
    if (store.wirelessKeyboard > 0) lines.push("Wireless Keyboard: " + store.wirelessKeyboard);
    if (store.ups > 0) lines.push("UPS: " + store.ups);
    return lines.join("\n");
  })();

  const handleCopyQuote = () => { if (!quoteText || totalCameras === 0) return; navigator.clipboard.writeText(quoteText).then(() => toast.success("Quote copied!")).catch(() => toast.error("Failed to copy")); };
  const toggleCollapse = (step: number) => setCollapsedSteps(prev => { const n = new Set(prev); if (n.has(step)) n.delete(step); else n.add(step); return n; });

  // ═══════════════════════════════════════════════════════════════
  // RENDER HELPERS
  // ═══════════════════════════════════════════════════════════════

  const stepActive = (step: number) => {
    switch (step) {
      case 1: return true; case 2: return hasPropertyType; case 3: return hasPropertyType && hasArea;
      case 4: return hasPropertyType && hasArea; case 5: return hasSystem; case 6: return hasTech;
      case 7: return totalCameras > 0; case 8: return totalCameras > 0 && store.cameraSystem !== "wifi";
      case 9: return totalCameras > 0 && store.cameraSystem !== "wifi"; case 10: return totalCameras > 0;
      case 11: return totalCameras > 0; default: return false;
    }
  };

  const isDone = (n: number) => stepDone(n);
  const isCurrent = (n: number) => n === activeStep && !isDone(n);

  // ═══════════════════════════════════════════════════════════════
  // STEP CARD WRAPPER
  // ═══════════════════════════════════════════════════════════════

  const StepCard = ({ num, title, children, done: doneProp }: { num: number; title: string; children: React.ReactNode; done?: boolean }) => {
    const done = doneProp ?? isDone(num);
    const current = isCurrent(num);
    const active = stepActive(num);
    const collapsed = collapsedSteps.has(num) && done;
    return (
      <motion.div
        ref={(el) => { stepRefs.current[num] = el; }}
        id={`step-${num}`}
        initial={false}
        animate={collapsed ? { opacity: 0.7, scale: 0.99 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={cn("relative rounded-2xl border transition-all duration-300",
          current ? "border-emerald-400 shadow-lg shadow-emerald-500/5 bg-card" :
          done ? "border-emerald-200 bg-emerald-50/30" :
          active ? "border-border bg-card" : "border-border/50 bg-card/40 opacity-50"
        )}
      >
        {/* Step header */}
        <button
          onClick={() => { if (done) toggleCollapse(num); else if (active) { setActiveStep(num); const el = stepRefs.current[num]; if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); } }}
          className="w-full flex items-center gap-4 p-5 lg:p-6 text-left group" aria-expanded={!collapsed}
        >
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 border-2",
            done ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20" :
            current ? "bg-emerald-50 border-emerald-500 text-emerald-700" :
            active ? "bg-muted border-muted-foreground/20 text-muted-foreground" : "bg-muted/50 border-transparent text-muted-foreground/50"
          )}>
            {done ? <CheckCircle2 className="h-5 w-5" /> : <span>{num}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn("font-semibold text-sm transition-colors", current ? "text-foreground" : done ? "text-emerald-700" : "text-muted-foreground")}>Step {num}: {title}</p>
            {done && num <= 3 && <p className="text-xs text-emerald-600 mt-0.5 truncate">{num === 1 ? propertyTypes.find(p => p.value === store.propertyType)?.label : num === 2 ? `${store.areaSqft} sq ft` : `${cameraSuggestion?.suggested ?? 0} cameras recommended`}</p>}
            {done && num === 4 && <p className="text-xs text-emerald-600 mt-0.5">{store.cameraSystem?.toUpperCase()} selected</p>}
            {done && num === 6 && <p className="text-xs text-emerald-600 mt-0.5">{totalCameras} camera{totalCameras !== 1 ? "s" : ""} selected \u2014 {fmt(totalPrice)}</p>}
          </div>
          {done && <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", collapsed && "-rotate-90")} />}
          {current && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-[10px]">Current</Badge>}
        </button>
        {/* Step content */}
        <AnimatePresence initial={false}>
          {!collapsed && active && (
            <motion.div key="content" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: "easeOut" }}>
              <div className="px-5 lg:px-6 pb-5 lg:pb-6 pt-0">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // SUMMARY PANEL CONTENT
  // ═══════════════════════════════════════════════════════════════

    function SummaryContent() {
    return (
    <div className="space-y-5">
      {totalCameras > 0 && (
        <motion.div {...fadeIn} className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Configuration Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Property</span><span className="font-medium">{propertyTypes.find(p => p.value === store.propertyType)?.label}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Area</span><span className="font-medium">{store.areaSqft || "\u2014"} sq ft</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">System</span><span className="font-medium uppercase">{store.cameraSystem || "\u2014"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Cameras</span><span className="font-medium">{totalCameras}</span></div>
            {recorderConfig && recorderConfig.units.length > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Recorder</span><span className="font-medium">{recorderConfig.units.map(u => `${u.channels}ch ${recorderConfig.type}`).join(" + ")}</span></div>}
            {powerConfig && powerConfig.units.length > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Power</span><span className="font-medium">{powerConfig.units.map(u => `${u.ports}p`).join(" + ")}</span></div>}
            {hddCalc.size && <div className="flex justify-between"><span className="text-muted-foreground">Storage ({store.retentionDays}d)</span><span className="font-medium">{hddCalc.size}</span></div>}
          </div>
          <Separator />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Cameras ({totalCameras})</h4>
            <div className="space-y-1.5">
              {store.cameraSelections.map((cam) => { const up = cam.salePrice && cam.salePrice < cam.price ? cam.salePrice : cam.price; return (
                <div key={cam.productId} className="flex justify-between text-xs"><span className="text-muted-foreground truncate mr-2">{cam.qty}x {cam.brand} {cam.modelName}</span><span className="font-medium shrink-0">{fmt(up * cam.qty)}</span></div>
              ); })}
            </div>
          </div>
          <Separator />
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 -mx-1">
            <p className="text-xs text-emerald-600 font-medium">Estimated Camera Total</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-0.5"><AnimatedPrice value={totalPrice} /></p>
          </div>
        </motion.div>
      )}
      {totalCameras === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4"><Sparkles className="h-8 w-8 text-emerald-500" /></div>
          <p className="text-sm font-medium text-muted-foreground">Start building your setup</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Your configuration summary will appear here</p>
        </div>
      )}
      {/* Actions */}
      <div className="space-y-2 pt-2">
        <WhatsAppShare text={quoteText} label="WhatsApp Quote" className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white" />
        <Button variant="outline" className="w-full gap-2" onClick={() => window.open(`tel:7809465102`)}><Phone className="h-4 w-4" /> Call Expert</Button>
        <Button variant="outline" className="w-full gap-2" onClick={handleCopyQuote} disabled={totalCameras === 0}><Copy className="h-4 w-4" /> Copy Quote</Button>
        <Button variant="outline" className="w-full gap-2" onClick={() => window.print()} disabled={totalCameras === 0}><Printer className="h-4 w-4" /> Print</Button>
        <RazorpayCheckout amount={totalPrice} quoteData={{ quote: quoteText, selections: store.cameraSelections }} label="Pay Now" className="w-full gap-2 bg-purple-600 hover:bg-purple-700" />
      </div>
    </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-background">
      {/* ═══ HERO ═══ */}
      <div className="relative overflow-hidden border-b bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.08),transparent)]" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-200 mb-5">
              <Sparkles className="h-4 w-4" /> AI-Powered CCTV Setup Wizard
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Build Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">CCTV Setup</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
              Our intelligent builder guides you step-by-step to design a complete security system. Auto-calculates recorder, power, storage, cables, and accessories.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {[{ icon: <Sparkles className="h-3.5 w-3.5" />, t: "AI Recommendations" }, { icon: <Zap className="h-3.5 w-3.5" />, t: "Instant Quote" }, { icon: <Shield className="h-3.5 w-3.5" />, t: "Genuine Products" }, { icon: <MessageCircle className="h-3.5 w-3.5" />, t: "Expert Assistance" }].map(b => (
                <span key={b.t} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full"><span className="text-emerald-600">{b.icon}</span>{b.t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══ PROGRESS NAV ═══ */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4 lg:gap-6 overflow-x-auto no-scrollbar">
            {STEPS.map((s, i) => {
              const done = isDone(s.num);
              const current = isCurrent(s.num);
              return (
                <div key={s.num} className="flex items-center shrink-0">
                  <button onClick={() => { if (done || isCurrent(s.num)) { setActiveStep(s.num); const el = stepRefs.current[s.num]; if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); } }} className={cn("flex items-center gap-2 transition-all", done ? "cursor-pointer" : current ? "cursor-pointer" : "cursor-default")} disabled={!done && !current}>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 border",
                      done ? "bg-emerald-500 border-emerald-500 text-white" : current ? "bg-emerald-50 border-emerald-400 text-emerald-700 ring-2 ring-emerald-200" : "bg-muted border-transparent text-muted-foreground"
                    )}>{done ? <CheckCircle2 className="h-4 w-4" /> : s.num}</div>
                    <span className={cn("text-xs font-medium hidden sm:block", done ? "text-emerald-700" : current ? "text-foreground" : "text-muted-foreground/60")}>{s.short}</span>
                  </button>
                  {i < STEPS.length - 1 && <div className={cn("w-4 lg:w-8 h-0.5 mx-1 rounded-full transition-colors duration-300", done && isDone(STEPS[i + 1].num) ? "bg-emerald-400" : done ? "bg-emerald-200" : "bg-muted")} />}
                </div>
              );
            })}
            <div className="ml-auto shrink-0 flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /><span>~{estMinutesLeft} min left</span>
              </div>
              <div className="flex items-center gap-2 min-w-[100px]">
                <Progress value={progressPct} className="h-1.5" />
                <span className="text-xs font-bold text-emerald-600 tabular-nums w-8 text-right">{progressPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN LAYOUT: WIZARD + SUMMARY ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex gap-6 lg:gap-8 items-start">
          {/* ── WIZARD (left) ── */}
          <main ref={wizardRef} className="flex-1 min-w-0 space-y-4">

            {/* STEP 1: PROPERTY TYPE */}
            <StepCard num={1} title="Select Property Type">
              <p className="text-sm text-muted-foreground mb-5">Choose the type of property where you want to install CCTV cameras.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {propertyTypes.map((pt) => (
                  <motion.button key={pt.value} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => store.setPropertyType(pt.value)}
                    className={cn("flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 transition-all text-center group relative overflow-hidden",
                      store.propertyType === pt.value ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10" : "border-border hover:border-emerald-300 hover:shadow-md bg-card"
                    )}>
                    {store.propertyType === pt.value && <motion.div layoutId="prop-glow" className="absolute inset-0 bg-gradient-to-b from-emerald-100/50 to-transparent pointer-events-none" />}
                    <div className={cn("p-3 rounded-xl transition-colors relative z-10", store.propertyType === pt.value ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground group-hover:bg-emerald-50 group-hover:text-emerald-600")}>{pt.icon}</div>
                    <div className="relative z-10">
                      <span className="text-sm font-semibold block">{pt.label}</span>
                      <span className="text-[11px] text-muted-foreground leading-tight block mt-0.5">{pt.desc}</span>
                      <Badge variant="outline" className="text-[10px] mt-2 border-emerald-200 text-emerald-600">{pt.camRange}</Badge>
                    </div>
                    {store.propertyType === pt.value && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center z-10"><CheckCircle2 className="h-3 w-3 text-white" /></motion.div>}
                  </motion.button>
                ))}
              </div>
            </StepCard>

            {/* STEP 2: AREA */}
            <StepCard num={2} title="Property Area">
              <p className="text-sm text-muted-foreground mb-5">Enter the total area of your property in square feet. This helps us estimate camera coverage.</p>
              <div className="max-w-lg space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Area (sq ft)</Label>
                  <Input type="number" placeholder="e.g. 1200" value={store.areaSqft} onChange={(e) => store.setAreaSqft(e.target.value)} className="h-12 text-lg font-semibold" min="0" aria-label="Property area in square feet" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Or use the slider</Label>
                  <Slider value={[area]} onValueChange={([v]) => store.setAreaSqft(String(v))} min={100} max={50000} step={100} className="py-2" aria-label="Area slider" />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>100 sq ft</span><span>50,000 sq ft</span>
                  </div>
                </div>
                {area > 0 && (
                  <motion.div {...fadeIn} className="flex items-center gap-3 flex-wrap">
                    {areaMilestones.filter(m => area >= m.sqft).slice(-1).map(m => (
                      <Badge key={m.sqft} variant="secondary" className="text-xs"><Ruler className="h-3 w-3 mr-1" />~{m.label} scale</Badge>
                    ))}
                  </motion.div>
                )}
              </div>
            </StepCard>

            {/* STEP 3: CAMERA RECOMMENDATION */}
            <StepCard num={3} title="Recommended Camera Count">
              {cameraSuggestion && (
                <div className="space-y-5">
                  <p className="text-sm text-muted-foreground">Based on your <strong>{propertyTypes.find(p => p.value === store.propertyType)?.label}</strong> of <strong>{area.toLocaleString()} sq ft</strong>:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ label: "Minimum", val: cameraSuggestion.min, color: "amber", icon: <AlertTriangle className="h-4 w-4" /> },
                     { label: "Recommended", val: cameraSuggestion.suggested, color: "emerald", icon: <Sparkles className="h-4 w-4" /> },
                     { label: "Maximum", val: cameraSuggestion.max, color: "sky", icon: <Eye className="h-4 w-4" /> }].map(c => (
                      <motion.div key={c.label} whileHover={{ y: -2 }} className={cn("rounded-2xl p-5 text-center border-2",
                        c.color === "emerald" ? "border-emerald-200 bg-gradient-to-b from-emerald-50 to-emerald-100/50" :
                        c.color === "amber" ? "border-amber-200 bg-gradient-to-b from-amber-50 to-amber-100/50" :
                        "border-sky-200 bg-gradient-to-b from-sky-50 to-sky-100/50"
                      )}>
                        <div className={cn("w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2",
                          c.color === "emerald" ? "bg-emerald-200/50 text-emerald-700" : c.color === "amber" ? "bg-amber-200/50 text-amber-700" : "bg-sky-200/50 text-sky-700"
                        )}>{c.icon}</div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{c.label}</p>
                        <motion.p key={c.val} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={cn("text-3xl font-extrabold mt-1", c.color === "emerald" ? "text-emerald-700" : c.color === "amber" ? "text-amber-700" : "text-sky-700")}>{c.val}</motion.p>
                        <p className="text-xs text-muted-foreground mt-0.5">cameras</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-700 leading-relaxed">These are estimates. Cover all entry points, parking, corridors, and blind spots. Outdoor areas typically need more coverage.</p>
                  </div>
                </div>
              )}
            </StepCard>

            {/* STEP 4: SYSTEM TYPE */}
            <StepCard num={4} title="Camera System Type">
              <p className="text-sm text-muted-foreground mb-5">Choose the CCTV system type. This determines cable type, recorder, and power supply.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cameraSystems.map((cs) => (
                  <motion.button key={cs.value} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} onClick={() => store.setCameraSystem(cs.value)}
                    className={cn("text-left p-6 rounded-2xl border-2 transition-all relative overflow-hidden group",
                      store.cameraSystem === cs.value ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-100" : "border-border hover:border-emerald-300 hover:shadow-md bg-card"
                    )}>
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors", store.cameraSystem === cs.value ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground group-hover:bg-emerald-50 group-hover:text-emerald-600")}>{cs.icon}</div>
                    <h3 className="font-bold text-sm">{cs.label}</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{cs.desc}</p>
                    {store.cameraSystem === cs.value && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-2">
                        <div className="space-y-1">{cs.pros.map(p => <p key={p} className="text-xs flex items-center gap-1.5 text-emerald-700"><CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />{p}</p>)}</div>
                        <div className="pt-2 border-t border-emerald-200 space-y-1">
                          <p className="text-[10px] text-emerald-600"><span className="font-semibold">Best for:</span> {cs.bestFor}</p>
                          <p className="text-[10px] text-emerald-600"><span className="font-semibold">Price range:</span> {cs.priceImpact}</p>
                        </div>
                      </motion.div>
                    )}
                    {store.cameraSystem === cs.value && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"><CheckCircle2 className="h-4 w-4 text-white" /></motion.div>}
                  </motion.button>
                ))}
              </div>
            </StepCard>

            {/* STEP 5: TECHNOLOGY */}
            <StepCard num={5} title="Camera Technology">
              <p className="text-sm text-muted-foreground mb-5">Choose one or more technology levels. Mix different technologies \u2014 e.g. night vision for most cameras, two-way talk for the entrance.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cameraTechs.map((ct) => {
                  const sel = store.cameraTechs.includes(ct.value);
                  return (
                    <motion.button key={ct.value} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} onClick={() => store.toggleCameraTech(ct.value)}
                      className={cn("text-left flex items-start gap-4 p-5 rounded-2xl border-2 transition-all relative",
                        sel ? "border-emerald-500 bg-emerald-50" : "border-border hover:border-emerald-300 bg-card"
                      )}>
                      <div className={cn("p-2.5 rounded-xl shrink-0 transition-colors", sel ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground")}>{ct.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-sm">{ct.label}</h3>
                          <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all", sel ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground/30")}>{sel && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}</div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ct.desc}</p>
                        <div className="flex gap-3 mt-2">
                          <Tooltip><TooltipTrigger><span className="text-[10px] text-emerald-600 underline decoration-dotted underline-offset-2 cursor-help">Best for</span></TooltipTrigger><TooltipContent side="bottom" className="text-xs max-w-xs">{ct.bestFor}</TooltipContent></Tooltip>
                          <Tooltip><TooltipTrigger><span className="text-[10px] text-emerald-600 underline decoration-dotted underline-offset-2 cursor-help">Price impact</span></TooltipTrigger><TooltipContent side="bottom" className="text-xs max-w-xs">{ct.priceImpact}</TooltipContent></Tooltip>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </StepCard>

            {/* STEP 6: PRODUCT SELECTION */}
            <StepCard num={6} title="Select Cameras">
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">Choose cameras from the catalog. Click to add, adjust quantities with +/\u2013.
                  {cameraSuggestion && <span> <strong>Recommended: {cameraSuggestion.suggested} cameras.</strong></span>}
                </p>
                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search brand, model, resolution..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="pl-10 h-10 text-sm rounded-xl" aria-label="Search cameras" />
                  </div>
                  <Select value={productTypeFilter} onValueChange={setProductTypeFilter}>
                    <SelectTrigger className="h-10 text-sm rounded-xl w-full sm:w-36" aria-label="Filter by camera type"><SelectValue placeholder="All Types" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="Dome">Dome</SelectItem><SelectItem value="Bullet">Bullet</SelectItem><SelectItem value="PTZ">PTZ</SelectItem><SelectItem value="WiFi">WiFi</SelectItem><SelectItem value="4G">4G</SelectItem></SelectContent>
                  </Select>
                </div>
                {/* Product Grid */}
                {productsLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{[...Array(8)].map((_, i) => (<div key={i} className="border rounded-2xl p-3 space-y-2 animate-pulse"><div className="aspect-square bg-muted rounded-xl" /><div className="h-3 bg-muted rounded w-16" /><div className="h-4 bg-muted rounded w-24" /></div>))}</div>
                ) : filteredProducts.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                    <Package className="h-12 w-12 mx-auto text-amber-400 mb-3" />
                    <p className="text-sm font-medium text-amber-700">No cameras found for {store.cameraSystem?.toUpperCase()} system</p>
                    <p className="text-xs text-amber-600 mt-1">Add {store.cameraSystem === "analog" ? "analog (DVR)" : store.cameraSystem === "ip" ? "IP (NVR)" : "WiFi"} cameras via Admin panel.</p>
                    <Button variant="outline" size="sm" className="mt-4 gap-1.5 rounded-xl" onClick={() => router.push("/admin")}><Shield className="h-3.5 w-3.5" /> Go to Admin</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[480px] overflow-y-auto pr-1">
                    {filteredProducts.map((product) => {
                      const isSel = store.cameraSelections.some(c => c.productId === product.id);
                      const selQty = store.cameraSelections.find(c => c.productId === product.id)?.qty || 0;
                      const unitPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
                      return (
                        <motion.button key={product.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => addProduct(product)}
                          className={cn("text-left rounded-2xl border-2 p-3 transition-all relative overflow-hidden group",
                            isSel ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-border hover:border-emerald-300 hover:shadow-sm bg-card"
                          )}>
                          {isSel && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold z-10 shadow-sm">{selQty}</motion.div>}
                          <div className="aspect-square bg-muted rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                            {product.imageUrl ? <img src={product.imageUrl} alt={product.modelName} className="w-full h-full object-contain p-2" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <Camera className="h-10 w-10 text-muted-foreground/40" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">{product.brand}</p>
                          <p className="text-xs font-semibold truncate mt-0.5" title={product.modelName}>{product.modelName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{product.resolution}</Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{product.cameraType}</Badge>
                          </div>
                          <div className="mt-2">
                            {product.salePrice && product.salePrice < product.price ? (
                              <div className="flex items-center gap-1.5"><span className="text-sm font-bold text-emerald-600">{fmt(unitPrice)}</span><span className="text-[10px] text-muted-foreground line-through">{fmt(product.price)}</span></div>
                            ) : <span className="text-sm font-bold">{fmt(product.price)}</span>}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available</p>
                {/* Selected Table */}
                {store.cameraSelections.length > 0 && (
                  <div className="border rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-0 bg-muted/80 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sticky top-0">
                      <span>Product</span><span>Resolution</span><span>Technology</span><span className="text-center">Qty</span><span className="text-right">Price</span><span className="w-8" />
                    </div>
                    {store.cameraSelections.map((cam) => {
                      const up = cam.salePrice && cam.salePrice < cam.price ? cam.salePrice : cam.price;
                      return (
                        <motion.div key={cam.productId} layout className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-0 px-4 py-3 items-center border-t hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {cam.imageUrl ? <img src={cam.imageUrl} alt="" className="w-9 h-9 rounded-lg object-contain bg-muted border shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <div className="w-9 h-9 rounded-lg bg-muted border flex items-center justify-center shrink-0"><Camera className="h-4 w-4 text-muted-foreground" /></div>}
                            <div className="min-w-0"><p className="text-xs font-semibold truncate">{cam.brand} {cam.modelName}</p><p className="text-[10px] text-muted-foreground">{cam.cameraType}</p></div>
                          </div>
                          <Badge variant="outline" className="w-fit text-[10px]">{cam.mp}</Badge>
                          <Select value={cam.tech} onValueChange={(v) => updateSelectionTech(cam.productId, v as CameraTech)}>
                            <SelectTrigger className="h-8 text-[11px] w-full max-w-[120px] rounded-lg"><SelectValue /></SelectTrigger>
                            <SelectContent>{cameraTechs.filter(ct => store.cameraTechs.includes(ct.value)).map(ct => (<SelectItem key={ct.value} value={ct.value}>{ct.label}</SelectItem>))}</SelectContent>
                          </Select>
                          <div className="flex justify-center"><QtyControl value={cam.qty} onChange={(v) => updateSelectionQty(cam.productId, v)} /></div>
                          <div className="text-right"><p className="text-xs font-bold"><AnimatedPrice value={up * cam.qty} /></p><p className="text-[10px] text-muted-foreground">{fmt(up)} x {cam.qty}</p></div>
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors" onClick={() => removeSelection(cam.productId)} aria-label={`Remove ${cam.modelName}`}><X className="h-4 w-4" /></button>
                        </motion.div>
                      );
                    })}
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-0 px-4 py-3.5 bg-emerald-50 border-t font-bold text-sm">
                      <span className="text-emerald-800">{totalCameras} camera{totalCameras !== 1 ? "s" : ""}</span><span /><span /><span /><span className="text-right text-emerald-700"><AnimatedPrice value={totalPrice} /></span><span />
                    </div>
                  </div>
                )}
                {store.cameraSelections.length === 0 && !productsLoading && filteredProducts.length > 0 && (
                  <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-700">Click any product to add it. Click again to increase quantity. Adjust with +/\u2013 in the table.</p>
                  </div>
                )}
              </div>
            </StepCard>

            {/* STEP 7: RECORDER */}
            <StepCard num={7} title="Recorder (DVR/NVR)">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Based on your <strong>{totalCameras} camera{totalCameras !== 1 ? "s" : ""}</strong> and <strong>{store.cameraSystem}</strong> system:</p>
                {recorderConfig ? (
                  <div className="space-y-3">
                    <div className={cn("rounded-2xl border-2 p-5", store.cameraSystem === "analog" ? "border-sky-200 bg-gradient-to-r from-sky-50 to-sky-100/50" : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50")}>
                      <div className="flex items-start gap-4">
                        <div className={cn("p-3 rounded-xl shrink-0", store.cameraSystem === "analog" ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700")}>{store.cameraSystem === "analog" ? <HardDrive className="h-6 w-6" /> : <Server className="h-6 w-6" />}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1"><h3 className="font-bold">{recorderConfig.type}</h3>{recorderConfig.units.length > 0 && <Badge variant="secondary" className="text-[10px]">{recorderConfig.units.length} unit{recorderConfig.units.length > 1 ? "s" : ""}</Badge>}</div>
                          <p className="text-sm text-muted-foreground">{recorderConfig.summary}</p>
                          {store.cameraSystem === "analog" && (<div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" /><p className="text-xs text-amber-700">Match DVR brand with camera brand \u2014 Hikvision cameras need Hikvision DVR, Dahua needs Dahua DVR. Not cross-compatible.</p></div>)}
                          {recorderConfig.exceedsMax && (<div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" /><p className="text-xs text-red-700">{totalCameras} cameras exceed max single {recorderConfig.type} ({store.cameraSystem === "analog" ? "32" : "256"}ch). Multiple units required.</p></div>)}
                        </div>
                        <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-1" />
                      </div>
                    </div>
                    {(recorderConfig.units.length > 1 || recorderConfig.exceedsMax) && (
                      <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Unit Breakdown</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{recorderConfig.units.map((unit, i) => (
                          <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-xl p-3 border"><div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0"><HardDrive className="h-5 w-5" /></div><div><p className="text-sm font-semibold">{unit.channels}-Channel {recorderConfig.type} #{i + 1}</p><p className="text-xs text-muted-foreground">{unit.usedPorts} camera{unit.usedPorts !== 1 ? "s" : ""} connected, {unit.channels - unit.usedPorts} spare</p></div></div>
                        ))}</div>
                      </div>)}
                  </div>
                ) : (<div className="bg-muted/30 rounded-2xl p-8 text-center"><Camera className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" /><p className="text-sm text-muted-foreground">Add cameras in Step 6 to see the recorder recommendation.</p></div>)}
              </div>
            </StepCard>

            {/* STEP 8: POWER */}
            <StepCard num={8} title="Power Supply">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{store.cameraSystem === "wifi" ? "WiFi cameras use included adapters. No separate power needed." : `Based on ${totalCameras} camera${totalCameras !== 1 ? "s" : ""}:`}</p>
                {store.cameraSystem === "wifi" ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center"><CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" /><p className="text-sm font-medium text-emerald-700">No power supply needed</p><p className="text-xs text-emerald-600 mt-1">Each WiFi camera includes a 12V power adapter.</p></div>
                ) : powerConfig ? (
                  <div className={cn("rounded-2xl border-2 p-5", store.cameraSystem === "analog" ? "border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50" : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50")}>
                    <div className="flex items-start gap-4">
                      <div className={cn("p-3 rounded-xl shrink-0", store.cameraSystem === "analog" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>{store.cameraSystem === "analog" ? <Zap className="h-6 w-6" /> : <EthernetPort className="h-6 w-6" />}</div>
                      <div className="flex-1">
                        <h3 className="font-bold">{store.cameraSystem === "analog" ? "SMPS Power Supply" : `PoE Switch${hasAbove2mp ? " (Gigabit)" : ""}`}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{powerConfig.summary}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">Why required: {store.cameraSystem === "analog" ? "Analog cameras need centralized 12V DC power distributed via SMPS." : `PoE provides both data and power over a single Ethernet cable.${hasAbove2mp ? " Gigabit needed for >2MP bandwidth." : ""}`}</p>
                      </div>
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-1" />
                    </div>
                  </div>
                ) : (<div className="bg-muted/30 rounded-2xl p-8 text-center"><Zap className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" /><p className="text-sm text-muted-foreground">Add cameras to see power recommendation.</p></div>)}
              </div>
            </StepCard>

            {/* STEP 9: STORAGE */}
            <StepCard num={9} title="Storage (HDD)">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Choose how many days of footage to retain. We calculate the required HDD size based on your camera resolution and count.</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {retentionOptions.map(d => (
                    <motion.button key={d} whileTap={{ scale: 0.95 }} onClick={() => store.setRetentionDays(d)}
                      className={cn("py-2.5 px-1 rounded-xl border-2 text-center transition-all",
                        store.retentionDays === d ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold" : "border-border hover:border-emerald-300 text-muted-foreground"
                      )}><span className="text-xs sm:text-sm block">{d}</span><span className="text-[9px] block">days</span></motion.button>
                  ))}
                </div>
                {hddCalc.size && (
                  <motion.div {...fadeIn} className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700"><HardDrive className="h-5 w-5" /></div>
                      <div><p className="text-xs text-emerald-600 font-medium">Recommended HDD</p><p className="text-xl font-extrabold text-emerald-700">{hddCalc.size}</p></div>
                    </div>
                    <p className="text-xs text-emerald-600">{hddCalc.breakdown}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Based on H.265+ compression at 15fps with ~70% motion activity factor.</p>
                  </motion.div>
                )}
                {store.cameraSystem === "wifi" && (<div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center"><CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" /><p className="text-sm font-medium text-emerald-700">WiFi cameras use MicroSD/Cloud</p><p className="text-xs text-emerald-600 mt-1">No separate HDD needed for WiFi systems.</p></div>)}
              </div>
            </StepCard>

            {/* STEP 10: CABLES */}
            <StepCard num={10} title="Cables">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Set the average cable length per camera. We calculate the total cable and number of rolls needed.</p>
                <div className="max-w-sm space-y-2">
                  <Label className="text-xs font-medium">Average cable per camera (meters)</Label>
                  <div className="flex items-center gap-3"><Input type="number" value={store.cableLengthPerCamera} onChange={(e) => store.setCableLengthPerCamera(Math.max(1, parseInt(e.target.value) || 1))} className="h-10 w-24 text-center font-bold" min="1" max="500" /><Slider value={[store.cableLengthPerCamera]} onValueChange={([v]) => store.setCableLengthPerCamera(v)} min={5} max={200} step={5} className="flex-1" /></div>
                </div>
                {totalCameras > 0 && store.cameraSystem !== "wifi" && (
                  <motion.div {...fadeIn} className="space-y-3">
                    <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between"><div><p className="text-sm font-medium">Total Cable Required</p><p className="text-xs text-muted-foreground">{totalCableMeters}m ({store.cableLengthPerCamera}m x {totalCameras} cameras)</p></div><div className="text-right"><p className="text-lg font-bold text-emerald-700">{totalCableMeters}m</p></div></div>
                    <div className="grid grid-cols-2 gap-3">
                      {store.cameraSystem === "analog" ? (
                        <>{[{roll: 90, qty: cableRolls90, label: "90m Coaxial Roll"}, {roll: 180, qty: cableRolls180, label: "180m Coaxial Roll"}].map(c => (
                          <div key={c.roll} className={cn("rounded-xl border-2 p-4", store.cableSelection?.type === `${c.roll}m` ? "border-emerald-500 bg-emerald-50" : "border-border")}>
                            <p className="text-xs text-muted-foreground">{c.label}</p><p className="text-xl font-bold mt-1">{c.qty}</p><p className="text-[10px] text-muted-foreground">roll{c.qty !== 1 ? "s" : ""}</p>
                            <button className="mt-2 text-xs text-emerald-600 font-medium hover:underline" onClick={() => store.setCableSelection({ type: `${c.roll}m`, qty: c.qty })}>Select</button>
                          </div>
                        ))}</>
                      ) : (
                        <>{[{roll: 100, qty: cableRolls100, label: "100m CAT6 Roll"}, {roll: 305, qty: cableRolls305, label: "305m CAT6 Roll"}].map(c => (
                          <div key={c.roll} className={cn("rounded-xl border-2 p-4", store.cableSelection?.type === `${c.roll}m` ? "border-emerald-500 bg-emerald-50" : "border-border")}>
                            <p className="text-xs text-muted-foreground">{c.label}</p><p className="text-xl font-bold mt-1">{c.qty}</p><p className="text-[10px] text-muted-foreground">roll{c.qty !== 1 ? "s" : ""}</p>
                            <button className="mt-2 text-xs text-emerald-600 font-medium hover:underline" onClick={() => store.setCableSelection({ type: `${c.roll}m`, qty: c.qty })}>Select</button>
                          </div>
                        ))}</>
                      )}
                    </div>
                    <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 flex items-start gap-2"><Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" /><p className="text-xs text-blue-700">{store.cameraSystem === "analog" ? "Coaxial cable (RG59/RG6) carries video signal for analog cameras. 3C (video+power+audio) cable is also available." : "CAT6 Ethernet cable carries both data and power (PoE) for IP cameras. Supports up to 100m per run without repeater."}</p></div>
                  </motion.div>
                )}
              </div>
            </StepCard>

            {/* STEP 11: ACCESSORIES */}
            <StepCard num={11} title="Accessories">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Auto-calculated connectors are based on your camera selection. Optional accessories enhance your setup.</p>
                <div className="space-y-3">
                  {/* Auto-calculated */}
                  {(store.junctionBox4x4 > 0 || store.junctionBox5x5 > 0 || store.dcConnector > 0 || store.bncConnector > 0 || store.rj45Connector > 0) && (
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Auto-Calculated Connectors</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {store.junctionBox4x4 > 0 && <div className="bg-muted/50 rounded-xl p-3 border"><p className="text-xs font-semibold">Junction Box 4x4</p><p className="text-lg font-bold text-emerald-700">{store.junctionBox4x4}</p><p className="text-[10px] text-muted-foreground">for bullet cameras</p></div>}
                        {store.junctionBox5x5 > 0 && <div className="bg-muted/50 rounded-xl p-3 border"><p className="text-xs font-semibold">Junction Box 5x5</p><p className="text-lg font-bold text-emerald-700">{store.junctionBox5x5}</p><p className="text-[10px] text-muted-foreground">for dome cameras</p></div>}
                        {store.dcConnector > 0 && <div className="bg-muted/50 rounded-xl p-3 border"><p className="text-xs font-semibold">DC Connector</p><p className="text-lg font-bold text-emerald-700">{store.dcConnector}</p><p className="text-[10px] text-muted-foreground">power connector</p></div>}
                        {store.bncConnector > 0 && <div className="bg-muted/50 rounded-xl p-3 border"><p className="text-xs font-semibold">BNC Connector</p><p className="text-lg font-bold text-emerald-700">{store.bncConnector}</p><p className="text-[10px] text-muted-foreground">video connector (x2)</p></div>}
                        {store.rj45Connector > 0 && <div className="bg-muted/50 rounded-xl p-3 border"><p className="text-xs font-semibold">RJ45 Connector</p><p className="text-lg font-bold text-emerald-700">{store.rj45Connector}</p><p className="text-[10px] text-muted-foreground">Ethernet connector (x2)</p></div>}
                      </div>
                    </div>
                  )}
                  {/* Optional */}
                  <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Optional Accessories</p>
                    <div className="space-y-2">
                      {[
                        { icon: <Server className="h-4 w-4" />, label: "Networking Rack", val: store.networkingRack, set: store.setNetworkingRack, desc: "6U/9U rack for NVR, switch, UPS", recommended: totalCameras >= 8 },
                        { icon: <Monitor className="h-4 w-4" />, label: `Monitor (${store.monitorSize} inch)`, val: store.monitor, set: store.setMonitor, desc: "Live view display", recommended: totalCameras >= 4 },
                        { icon: <Plug className="h-4 w-4" />, label: "Extension Board", val: store.extensionBoard, set: store.setExtensionBoard, desc: "Multi-plug for power", recommended: false },
                        { icon: <Mouse className="h-4 w-4" />, label: "Wireless Mouse", val: store.wirelessMouse, set: store.setWirelessMouse, desc: "For NVR navigation", recommended: totalCameras >= 4 },
                        { icon: <Keyboard className="h-4 w-4" />, label: "Wireless Keyboard", val: store.wirelessKeyboard, set: store.setWirelessKeyboard, desc: "For NVR setup", recommended: false },
                        { icon: <Battery className="h-4 w-4" />, label: "UPS", val: store.ups, set: store.setUps, desc: "Power backup for recorder", recommended: totalCameras >= 4 },
                      ].map(acc => (
                        <div key={acc.label} className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
                          <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0">{acc.icon}</div>
                          <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><p className="text-xs font-semibold">{acc.label}</p>{acc.recommended && <Badge className="text-[9px] bg-emerald-100 text-emerald-700 border-0">Recommended</Badge>}{!acc.recommended && <Badge variant="outline" className="text-[9px]">Optional</Badge>}</div><p className="text-[10px] text-muted-foreground">{acc.desc}</p></div>
                          <QtyControl value={acc.val} onChange={acc.set} min={0} max={acc.label.includes("UPS") ? 4 : acc.label.includes("Rack") ? 2 : 10} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </StepCard>

            {/* Reset + Final Actions */}
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" size="sm" className="gap-1.5 text-red-600 hover:text-red-700" onClick={() => { store.resetBuilder(); setCollapsedSteps(new Set()); setActiveStep(1); toast.success("Configuration reset"); }}><RotateCcw className="h-3.5 w-3.5" /> Reset All</Button>
              {totalCameras > 0 && completedSteps === STEPS.length && !showConfetti && (
                <Button className="gap-1.5" onClick={() => setShowConfetti(true)}><Trophy className="h-4 w-4" /> Complete Setup</Button>
              )}
            </div>
          </main>

          {/* ── STICKY SUMMARY (desktop) ── */}
          <aside className="hidden lg:block w-[340px] shrink-0 sticky top-[72px] max-h-[calc(100vh-88px)] overflow-y-auto" aria-label="Configuration summary">
            <div className="rounded-2xl border bg-card p-5 shadow-lg shadow-black/5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm">Your Setup</h2>
                <Badge variant="outline" className="text-[10px]">{completedSteps}/{STEPS.length} steps</Badge>
              </div>
              <Progress value={progressPct} className="h-1" />
              {SummaryContent()}
            </div>
          </aside>
        </div>
      </div>

      {/* ═══ MOBILE SUMMARY DRAWER ═══ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <AnimatePresence>
          {summaryDrawerOpen && (
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-background border-t rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto p-5 pb-24">
              <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
              {SummaryContent()}
            </motion.div>
          )}
        </AnimatePresence>
        {/* FAB */}
        {!summaryDrawerOpen && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="bg-background/90 backdrop-blur-xl border-t px-4 py-3">
            <button onClick={() => setSummaryDrawerOpen(true)} className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center"><Layers className="h-5 w-5 text-white" /></div><div className="text-left"><p className="text-xs text-muted-foreground">Setup Summary</p>{totalCameras > 0 ? <p className="text-sm font-bold">{totalCameras} cameras \u2014 <AnimatedPrice value={totalPrice} /></p> : <p className="text-xs text-muted-foreground">Start building</p>}</div></div>
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            </button>
          </motion.div>
        )}
        {summaryDrawerOpen && (
          <button onClick={() => setSummaryDrawerOpen(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center"><X className="h-4 w-4" /></button>
        )}
      </div>

      {/* ═══ AI ASSISTANT ═══ */}
      <motion.div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50">
        <AnimatePresence>
          {aiOpen && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-14 right-0 w-72 rounded-2xl border bg-card shadow-xl p-4 space-y-3">
              <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center"><Bot className="h-4 w-4 text-emerald-700" /></div><p className="text-xs font-bold">Setup Assistant</p></div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{aiTips[aiIdx].q}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{aiTips[aiIdx].a}</p>
              </div>
              <div className="flex gap-2"><button onClick={() => setAiIdx((aiIdx + 1) % aiTips.length)} className="flex-1 text-xs py-1.5 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-colors">Next tip</button><button onClick={() => setAiOpen(false)} className="flex-1 text-xs py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium transition-colors">Got it</button></div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setAiOpen(!aiOpen)}
          className={cn("w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center transition-all", aiOpen ? "bg-emerald-600 text-white" : "bg-emerald-500 text-white hover:bg-emerald-600")} aria-label="AI Setup Assistant">
          <Bot className="h-5 w-5" />
        </motion.button>
      </motion.div>

      {/* ═══ CONFETTI ═══ */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowConfetti(false)}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-background rounded-3xl p-8 lg:p-12 max-w-md mx-4 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5"><Trophy className="h-10 w-10 text-emerald-600" /></div>
              <h2 className="text-2xl font-extrabold">Setup Complete!</h2>
              <p className="text-muted-foreground mt-2">Your {totalCameras}-camera {store.cameraSystem} system is configured. Share the quote or proceed to payment.</p>
              <div className="mt-6 text-3xl font-extrabold text-emerald-600"><AnimatedPrice value={totalPrice} /></div>
              <p className="text-xs text-muted-foreground mt-1">Estimated camera total</p>
              <div className="flex flex-col gap-2 mt-6">
                <WhatsAppShare text={quoteText} label="Share on WhatsApp" className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white" />
                <Button variant="outline" className="w-full gap-2" onClick={handleCopyQuote}><Copy className="h-4 w-4" /> Copy Quote</Button>
                <Button variant="outline" className="w-full gap-2" onClick={() => setShowConfetti(false)}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for mobile FAB */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}