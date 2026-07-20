"use client";

import { useEffect, useMemo, useState } from "react";
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
import { cn } from "@/lib/utils";
import { WhatsAppShare } from "@/components/whatsapp-button";
import { RazorpayCheckout } from "@/components/razorpay-checkout";
import {
  Home, Building2, Store, Warehouse, Factory, UtensilsCrossed,
  GraduationCap, Hospital, Castle, HelpCircle,
  Camera, Wifi, Cable, Radio, Shield, HardDrive, Cloud,
  Monitor, Plug, Plus, Minus, CheckCircle2,
  AlertTriangle, Lightbulb, Router, Zap, Box, Link,
  Calculator, RotateCcw, Info, Eye, Volume2, MessageSquare,
  Sun, Moon, Palette, Server, ChevronsDown, Copy, Printer,
  Mouse, Keyboard, Search, Package,
} from "lucide-react";
import { toast } from "sonner";

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════════════════

const propertyTypes: { value: PropertyType; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "home", label: "Home", icon: <Home className="h-6 w-6" />, desc: "Independent house / villa" },
  { value: "apartment", label: "Apartment / Flat", icon: <Building2 className="h-6 w-6" />, desc: "Flat in a multi-story building" },
  { value: "office", label: "Office", icon: <Building2 className="h-6 w-6" />, desc: "Commercial office space" },
  { value: "shop", label: "Shop / Showroom", icon: <Store className="h-6 w-6" />, desc: "Retail shop or showroom" },
  { value: "warehouse", label: "Warehouse", icon: <Warehouse className="h-6 w-6" />, desc: "Storage / warehouse facility" },
  { value: "factory", label: "Factory", icon: <Factory className="h-6 w-6" />, desc: "Manufacturing unit" },
  { value: "restaurant", label: "Restaurant / Hotel", icon: <UtensilsCrossed className="h-6 w-6" />, desc: "Food & hospitality" },
  { value: "hospital", label: "Hospital / Clinic", icon: <Hospital className="h-6 w-6" />, desc: "Healthcare facility" },
  { value: "school", label: "School / College", icon: <GraduationCap className="h-6 w-6" />, desc: "Educational institution" },
  { value: "villa", label: "Villa / Farmhouse", icon: <Castle className="h-6 w-6" />, desc: "Large villa or farmhouse" },
  { value: "other", label: "Other", icon: <HelpCircle className="h-6 w-6" />, desc: "Any other property type" },
];

const cameraSystems: { value: CameraSystem; label: string; icon: React.ReactNode; desc: string; pros: string[] }[] = [
  { value: "analog", label: "Analog (HD-TVI / HD-CVI)", icon: <Cable className="h-6 w-6" />, desc: "Uses coaxial cable + DVR. Budget-friendly, easy to install, reliable for standard setups.", pros: ["Most affordable system", "Easy installation", "Long cable runs (300m+)", "Proven reliable technology"] },
  { value: "ip", label: "IP (Network Camera)", icon: <Wifi className="h-6 w-6" />, desc: "Uses Ethernet cable + NVR with PoE. Best quality, single cable for data+power, smart features.", pros: ["Best video quality (up to 12MP)", "PoE - one cable for data+power", "Smart AI features", "ONVIF cross-brand compatible"] },
  { value: "wifi", label: "WiFi (Wireless)", icon: <Radio className="h-6 w-6" />, desc: "No cables needed. Camera connects to WiFi, stores on MicroSD card or cloud. No DVR/NVR needed.", pros: ["Zero cable installation", "DIY friendly", "MicroSD + Cloud storage", "Instant mobile alerts"] },
];

const cameraTechs: { value: CameraTech; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "night_vision", label: "Night Vision (IR)", icon: <Moon className="h-5 w-5" />, desc: "Black & white recording in darkness using infrared LEDs. Reliable, long-range (20-80m)." },
  { value: "night_vision_audio", label: "Night Vision + Audio", icon: <Volume2 className="h-5 w-5" />, desc: "IR night vision with built-in microphone for audio recording. Hear what is happening." },
  { value: "color_audio", label: "Full Color + Audio", icon: <Palette className="h-5 w-5" />, desc: "Records in full color even at night using ColorVu/Full-Color technology. Includes audio." },
  { value: "two_way_talk", label: "Two-Way Talk", icon: <MessageSquare className="h-5 w-5" />, desc: "Full color night vision + audio + built-in speaker for two-way communication through app." },
];

const retentionOptions = [7, 10, 15, 20, 30, 45, 60, 90];

// ═══════════════════════════════════════════════════════════════
// CCTV DOMAIN-ACCURATE CALCULATION ENGINE
// ═══════════════════════════════════════════════════════════════

// Camera density per 1000 sq ft by property type
function getCameraSuggestion(area: number, propType: PropertyType): { min: number; max: number; suggested: number } {
  const camerasPer1000sqft: Record<PropertyType, number> = {
    home: 1.2, apartment: 1.5, office: 1.8, shop: 2.0,
    warehouse: 0.8, factory: 1.0, restaurant: 2.5, hospital: 2.0,
    school: 1.5, villa: 1.0, other: 1.2,
  };
  const rate = camerasPer1000sqft[propType] || 1.2;
  const suggested = Math.max(2, Math.ceil((area / 1000) * rate));
  return { min: Math.max(2, suggested - 2), max: suggested + 4, suggested };
}

// ═══ RECORDER CONFIG ═══
// Real market channel counts:
//   DVR (analog): 4ch, 8ch, 16ch, 32ch   (max 32ch for DVR)
//   NVR (IP):     4ch, 8ch, 16ch, 32ch, 64ch, 128ch, 256ch
// If cameras exceed the largest available single unit, multiple units are suggested.
function getRecorderConfig(totalCameras: number, system: CameraSystem): { type: string; units: { channels: number; usedPorts: number }[]; summary: string; exceedsMax: boolean } {
  if (system === "wifi") {
    return { type: "None", units: [], summary: "WiFi cameras do not need a DVR/NVR. They record on MicroSD card or cloud.", exceedsMax: false };
  }

  const type = system === "analog" ? "DVR" : "NVR";
  // DVR max is 32ch. NVR goes up to 256ch.
  const availableChannels = system === "analog" ? [4, 8, 16, 32] : [4, 8, 16, 32, 64, 128, 256];
  const maxSingleUnit = availableChannels[availableChannels.length - 1];
  const exceedsMax = totalCameras > maxSingleUnit;

  const units: { channels: number; usedPorts: number }[] = [];
  let remaining = totalCameras;

  while (remaining > 0) {
    // Pick the smallest channel count that covers remaining, or the biggest available
    const fitting = availableChannels.filter(ch => ch >= remaining);
    const chosen = fitting.length > 0 ? fitting[0] : availableChannels[availableChannels.length - 1];
    const used = Math.min(remaining, chosen);
    units.push({ channels: chosen, usedPorts: used });
    remaining -= used;
  }

  // Build summary string
  if (units.length === 1) {
    const u = units[0];
    return { type, units, summary: `${type} ${u.channels}-Channel (${u.usedPorts} camera${u.usedPorts > 1 ? "s" : ""} connected)`, exceedsMax };
  }

  const unitDescs = units.map(u => {
    if (u.usedPorts === u.channels) return `${u.channels}ch`;
    return `${u.channels}ch (${u.usedPorts} used)`;
  }).join(" + ");

  const totalChannels = units.reduce((s, u) => s + u.channels, 0);
  return {
    type,
    units,
    summary: `${units.length}x ${type} units: ${unitDescs} = ${totalChannels} total channels for ${totalCameras} cameras`,
    exceedsMax,
  };
}

// ═══ POWER SUPPLY CONFIG ═══
// Real market PoE switch ports: 4, 8, 16, 24  (32-port and 48-port PoE switches do NOT exist)
// SMPS channels for analog: 4ch, 8ch, 16ch
function getPowerConfig(totalCameras: number, system: CameraSystem, hasAbove2mp: boolean): { units: { type: string; ports: number; usedPorts: number; variant: "standard" | "giga" }[]; summary: string } {
  if (system === "wifi") {
    return { units: [], summary: "WiFi cameras use included 12V adapters. No separate power supply needed." };
  }

  if (system === "analog") {
    // SMPS: 4ch, 8ch, 16ch
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

    const unitDescs = units.map(u => {
      if (u.usedPorts === u.ports) return `${u.ports}-Channel SMPS`;
      return `${u.ports}-Channel SMPS (${u.usedPorts} used)`;
    }).join(" + ");

    return { units, summary: `${units.length}x SMPS units: ${unitDescs} (12V DC)` };
  }

  // IP system - PoE Switch
  // Real market: 4-port, 8-port, 16-port, 24-port PoE switches (max 24)
  // Gigabit needed for >2MP cameras (higher bandwidth)
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
  const unitDescs = units.map(u => {
    if (u.usedPorts === u.ports) return `${u.ports}-Port ${variantLabel}`;
    return `${u.ports}-Port (${u.usedPorts} used)`;
  }).join(" + ");

  const totalPorts = units.reduce((s, u) => s + u.ports, 0);
  return { units, summary: `${units.length}x ${variantLabel} PoE switches: ${unitDescs} = ${totalPorts} total ports for ${totalCameras} cameras` };
}

// ═══ HDD SIZE CALCULATION ═══
// Real-world H.265+ bitrates (Mbps) at 15fps continuous recording:
//   2MP  (1080p): 2 Mbps   → ~21.6 GB/day/camera
//   3MP:          3 Mbps   → ~32.4 GB/day/camera
//   4MP  (2K):    4 Mbps   → ~43.2 GB/day/camera
//   5MP:          6 Mbps   → ~64.8 GB/day/camera
//   8MP  (4K):    8 Mbps   → ~86.4 GB/day/camera
//   12MP:         16 Mbps  → ~172.8 GB/day/camera
// With H.265+ motion recording (~70% activity factor), multiply by 0.7
// Formula per camera: GB/day = (bitrate_Mbps / 8) * 3600 * 24 * 0.7
// Total GB = Sum(camera_qty_i * GB_per_day_i * retention_days)

const BITRATE_GB_PER_DAY: Record<string, number> = {
  "1MP": 7.6,     // (1/8)*86400*0.7
  "2MP": 15.1,    // (2/8)*86400*0.7 = 15120 MB = 14.8 GB → rounded
  "3MP": 22.7,
  "4MP": 30.2,
  "5MP": 45.4,
  "8MP": 60.5,
  "12MP": 120.9,
};

const HDD_SIZES_GB = [500, 1000, 2000, 3000, 4000, 6000, 8000, 10000, 12000, 16000];

function calculateHdd(cameraSelections: CameraSelection[], retentionDays: number): { size: string; breakdown: string } {
  if (cameraSelections.length === 0 || retentionDays <= 0) return { size: "", breakdown: "" };

  let totalGB = 0;
  const details: string[] = [];

  for (const cam of cameraSelections) {
    const gbPerDay = BITRATE_GB_PER_DAY[cam.mp] || 30.2;
    const camTotal = gbPerDay * cam.qty * retentionDays;
    totalGB += camTotal;
    details.push(`${cam.qty}x ${cam.mp} ${cam.form}: ${Math.round(camTotal / 1024 * 10) / 10} TB`);
  }

  // Find smallest standard HDD that fits
  let hddLabel = "";
  for (const size of HDD_SIZES_GB) {
    if (size >= totalGB) {
      hddLabel = size >= 1000 ? `${size / 1000} TB` : `${size} GB`;
      break;
    }
  }
  if (!hddLabel) {
    const tb = Math.ceil(totalGB / 1000);
    hddLabel = `${tb}+ TB (Multiple HDDs needed)`;
  }

  // Build breakdown
  const totalTB = (totalGB / 1024).toFixed(1);
  const breakdown = `Total: ~${totalTB} TB for ${retentionDays} days retention`;

  return { size: hddLabel, breakdown };
}

function getTotalCableMeters(cameraQty: number, metersPerCam: number): number {
  return cameraQty * metersPerCam;
}

function getCableRolls(totalMeters: number, rollLength: number): number {
  return Math.ceil(totalMeters / rollLength);
}

// ═══════════════════════════════════════════════════════════════
// STEP BADGE
// ═══════════════════════════════════════════════════════════════

function StepBadge({ num, title, active, done }: { num: number; title: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2 transition-colors",
        done ? "bg-emerald-500 border-emerald-500 text-white" :
        active ? "bg-emerald-100 border-emerald-500 text-emerald-700" :
        "bg-muted border-muted-foreground/30 text-muted-foreground"
      )}>
        {done ? <CheckCircle2 className="h-5 w-5" /> : num}
      </div>
      <div>
        <p className={cn("font-semibold text-sm", active ? "text-foreground" : "text-muted-foreground")}>Step {num}: {title}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUANTITY CONTROL
// ═══════════════════════════════════════════════════════════════

function QtyControl({ value, onChange, min = 0, max = 256 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}><Minus className="h-3 w-3" /></Button>
      <span className="w-10 text-center font-bold text-sm">{value}</span>
      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}><Plus className="h-3 w-3" /></Button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN BUILDER COMPONENT
// ═══════════════════════════════════════════════════════════════

export function CctvBuilder() {
  const store = useBuilderStore();

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

  // ─── Auto-calculated: Recorder Config ───
  const recorderConfig = useMemo(() => {
    if (totalCameras === 0) return null;
    return getRecorderConfig(totalCameras, store.cameraSystem as CameraSystem);
  }, [totalCameras, store.cameraSystem]);

  // ─── Auto-calculated: Power Config ───
  const powerConfig = useMemo(() => {
    if (totalCameras === 0) return null;
    return getPowerConfig(totalCameras, store.cameraSystem as CameraSystem, hasAbove2mp);
  }, [totalCameras, store.cameraSystem, hasAbove2mp]);

  // ─── Auto-calculated: HDD Size ───
  const hddCalc = useMemo(() => {
    if (totalCameras === 0 || store.cameraSystem === "wifi") return { size: "", breakdown: "" };
    return calculateHdd(store.cameraSelections, store.retentionDays);
  }, [totalCameras, store.cameraSelections, store.retentionDays, store.cameraSystem]);

  // ─── Auto-calculated: Cable ───
  const totalCableMeters = useMemo(() => getTotalCableMeters(totalCameras, store.cableLengthPerCamera), [totalCameras, store.cableLengthPerCamera]);
  const cableRolls90 = useMemo(() => getCableRolls(totalCableMeters, 90), [totalCableMeters]);
  const cableRolls180 = useMemo(() => getCableRolls(totalCableMeters, 180), [totalCableMeters]);
  const cableRolls100 = useMemo(() => getCableRolls(totalCableMeters, 100), [totalCableMeters]);
  const cableRolls305 = useMemo(() => getCableRolls(totalCableMeters, 305), [totalCableMeters]);

  // ─── Sync auto-calculated values to store ───
  useEffect(() => {
    if (recorderConfig) {
      store.setRecorderUnits(recorderConfig.units.map(u => ({ ...u, type: recorderConfig.type })));
    } else {
      store.setRecorderUnits([]);
    }
  }, [recorderConfig, store.setRecorderUnits]);

  useEffect(() => {
    if (powerConfig) {
      store.setPowerUnits(powerConfig.units);
    } else {
      store.setPowerUnits([]);
    }
  }, [powerConfig, store.setPowerUnits]);

  useEffect(() => {
    store.setHddSuggestion(hddCalc.size);
    store.setHddBreakdown(hddCalc.breakdown);
  }, [hddCalc.size, hddCalc.breakdown, store.setHddSuggestion, store.setHddBreakdown]);

  useEffect(() => {
    if (cameraSuggestion) {
      store.setSuggestedCameras(cameraSuggestion.suggested);
    }
  }, [cameraSuggestion, store.setSuggestedCameras]);

  // ─── Auto-calculate accessories ───
  useEffect(() => {
    if (totalCameras === 0) {
      store.setJunctionBox4x4(0);
      store.setJunctionBox5x5(0);
      store.setDcConnector(0);
      store.setBncConnector(0);
      store.setRj45Connector(0);
      return;
    }
    const bulletCount = store.cameraSelections.filter(c => c.form === "bullet").reduce((s, c) => s + c.qty, 0);
    const domeCount = store.cameraSelections.filter(c => c.form === "dome").reduce((s, c) => s + c.qty, 0);
    if (store.cameraSystem === "analog") {
      store.setJunctionBox4x4(bulletCount);
      store.setJunctionBox5x5(domeCount);
      store.setDcConnector(totalCameras);
      store.setBncConnector(totalCameras * 2);
      store.setRj45Connector(0);
    } else if (store.cameraSystem === "ip") {
      store.setJunctionBox4x4(bulletCount);
      store.setJunctionBox5x5(domeCount);
      store.setDcConnector(0);
      store.setBncConnector(0);
      store.setRj45Connector(totalCameras * 2);
    } else {
      store.setJunctionBox4x4(0);
      store.setJunctionBox5x5(0);
      store.setDcConnector(0);
      store.setBncConnector(0);
      store.setRj45Connector(0);
    }
  }, [totalCameras, store.cameraSystem, store.cameraSelections, store.setJunctionBox4x4, store.setJunctionBox5x5, store.setDcConnector, store.setBncConnector, store.setRj45Connector]);

  // ─── Product Fetching (for Step 6) ───
  const [availableProducts, setAvailableProducts] = useState<CctvProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productTypeFilter, setProductTypeFilter] = useState("all");

  // Fetch camera products when system type changes
  useEffect(() => {
    if (!store.cameraSystem) return;
    fetch("/api/products?sortBy=price&order=asc")
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          // Filter out recorders (DVR/NVR camera types) — only show actual cameras
          const cameras = (data.data as CctvProduct[]).filter((p: CctvProduct) => {
            if (p.cameraType === "DVR" || p.cameraType === "NVR") return false;
            // Filter by system type
            if (store.cameraSystem === "analog") return p.recorderType === "DVR" || p.technology === "HD-TVI" || p.technology === "HD-CVI" || p.technology === "AHD";
            if (store.cameraSystem === "ip") return p.recorderType === "NVR" || p.recorderType === "Cloud/NVR" || p.technology === "IP";
            if (store.cameraSystem === "wifi") return p.cameraType === "WiFi" || p.cameraType === "4G" || p.technology === "WiFi IP" || p.recorderType === "Cloud/SD Card";
            return true;
          });
          setAvailableProducts(cameras);
        }
      })
      .catch(() => setAvailableProducts([]))
      .finally(() => setProductsLoading(false));
  }, [store.cameraSystem]);

  // Filter products for display
  const filteredProducts = useMemo(() => {
    let list = availableProducts;
    if (productTypeFilter !== "all") {
      list = list.filter(p => p.cameraType === productTypeFilter);
    }
    if (productSearch) {
      const s = productSearch.toLowerCase();
      list = list.filter(p => p.brand.toLowerCase().includes(s) || p.modelName.toLowerCase().includes(s) || p.resolution.toLowerCase().includes(s));
    }
    return list;
  }, [availableProducts, productSearch, productTypeFilter]);

  // ─── Product-based Camera Selection Handlers ───
  const addProduct = (product: CctvProduct) => {
    const current = [...store.cameraSelections];
    const idx = current.findIndex(c => c.productId === product.id);
    const defaultTech = store.cameraTechs.length > 0 ? store.cameraTechs[0] : "night_vision" as CameraTech;
    if (idx >= 0) {
      current[idx] = { ...current[idx], qty: Math.min(256, current[idx].qty + 1) };
    } else {
      current.push({
        productId: product.id,
        brand: product.brand,
        modelName: product.modelName,
        mp: normalizeResolution(product.resolution),
        form: cameraTypeToForm(product.cameraType),
        qty: 1,
        tech: defaultTech,
        price: product.price,
        salePrice: product.salePrice,
        imageUrl: product.imageUrl || "",
        cameraType: product.cameraType,
      });
    }
    store.setCameraSelections(current);
  };

  const updateSelectionQty = (productId: string, newQty: number) => {
    const current = [...store.cameraSelections];
    const idx = current.findIndex(c => c.productId === productId);
    if (idx < 0) return;
    if (newQty <= 0) {
      current.splice(idx, 1);
    } else {
      current[idx] = { ...current[idx], qty: Math.min(256, newQty) };
    }
    store.setCameraSelections(current);
  };

  const updateSelectionTech = (productId: string, tech: CameraTech) => {
    const current = [...store.cameraSelections];
    const idx = current.findIndex(c => c.productId === productId);
    if (idx >= 0) {
      current[idx] = { ...current[idx], tech };
      store.setCameraSelections(current);
    }
  };

  const removeSelection = (productId: string) => {
    store.setCameraSelections(store.cameraSelections.filter(c => c.productId !== productId));
  };

  // Camera total price
  const totalPrice = useMemo(() => store.cameraSelections.reduce((s, c) => {
    const unitPrice = c.salePrice && c.salePrice < c.price ? c.salePrice : c.price;
    return s + unitPrice * c.qty;
  }, 0), [store.cameraSelections]);

  // ─── Step visibility ───
  const stepActive = (step: number) => {
    switch (step) {
      case 1: return true;
      case 2: return hasPropertyType;
      case 3: return hasPropertyType && hasArea;
      case 4: return hasPropertyType && hasArea;
      case 5: return hasSystem;
      case 6: return hasTech;
      case 7: return totalCameras > 0;
      case 8: return totalCameras > 0 && store.cameraSystem !== "wifi";
      case 9: return totalCameras > 0 && store.cameraSystem !== "wifi";
      case 10: return totalCameras > 0 && store.cameraSystem !== "wifi";
      case 11: return totalCameras > 0;
      default: return false;
    }
  };

  const stepDone = (step: number) => {
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
  };

  // ─── Quote text (reusable for copy, WhatsApp, Razorpay) ───
  const quoteText = (() => {
    const lines: string[] = [];
    lines.push("=== CCTV SETUP QUOTE - ConnectZ Sales & Services ===");
    lines.push("");
    lines.push("Property: " + (propertyTypes.find(p => p.value === store.propertyType)?.label || "-"));
    lines.push("Area: " + (store.areaSqft || "-") + " sq ft");
    lines.push("System: " + (store.cameraSystem || "-").toUpperCase());
    lines.push("");
    lines.push("--- CAMERAS ---");
    for (const cam of store.cameraSelections) {
      const techLabel = cameraTechs.find(t => t.value === cam.tech)?.label || cam.tech;
      const unitPrice = cam.salePrice && cam.salePrice < cam.price ? cam.salePrice : cam.price;
      lines.push(`${cam.qty}x ${cam.brand} ${cam.modelName} (${cam.mp} ${cam.cameraType}, ${techLabel}) - ${fmt(unitPrice)} each = ${fmt(unitPrice * cam.qty)}`);
    }
    lines.push("Total Cameras: " + totalCameras);
    lines.push("Camera Subtotal: " + fmt(totalPrice));
    if (recorderConfig && recorderConfig.units.length > 0) {
      lines.push("");
      lines.push("--- RECORDER ---");
      lines.push(recorderConfig.summary);
    }
    if (powerConfig && powerConfig.units.length > 0) {
      lines.push("");
      lines.push("--- POWER SUPPLY ---");
      lines.push(powerConfig.summary);
    }
    if (hddCalc.size) {
      lines.push("");
      lines.push("--- STORAGE ---");
      lines.push("HDD Required: " + hddCalc.size);
      lines.push("Retention: " + store.retentionDays + " days");
      lines.push(hddCalc.breakdown);
    }
    if (store.cameraSystem !== "wifi" && totalCameras > 0) {
      lines.push("");
      lines.push("--- CABLING ---");
      lines.push("Total Cable: " + totalCableMeters + " meters (" + store.cableLengthPerCamera + "m per camera)");
      if (store.cameraSystem === "analog") {
        lines.push("Coaxial 90m rolls: " + cableRolls90 + " OR 180m rolls: " + cableRolls180);
      } else {
        lines.push("Cat6 100m rolls: " + cableRolls100 + " OR 305m rolls: " + cableRolls305);
      }
    }
    lines.push("");
    lines.push("--- ACCESSORIES ---");
    if (store.junctionBox4x4 > 0) lines.push("Junction Box 4x4 (bullet): " + store.junctionBox4x4);
    if (store.junctionBox5x5 > 0) lines.push("Junction Box 5x5 (dome): " + store.junctionBox5x5);
    if (store.dcConnector > 0) lines.push("DC Connector: " + store.dcConnector);
    if (store.bncConnector > 0) lines.push("BNC Connector: " + store.bncConnector);
    if (store.rj45Connector > 0) lines.push("RJ45 Connector: " + store.rj45Connector);
    if (store.networkingRack > 0) lines.push("Networking Rack: " + store.networkingRack);
    if (store.monitor > 0) lines.push("Monitor " + store.monitorSize + ": " + store.monitor);
    if (store.extensionBoard > 0) lines.push("Extension Board: " + store.extensionBoard);
    if (store.wirelessMouse > 0) lines.push("Wireless Mouse: " + store.wirelessMouse);
    if (store.wirelessKeyboard > 0) lines.push("Wireless Keyboard: " + store.wirelessKeyboard);
    if (store.ups > 0) lines.push("UPS: " + store.ups);
    return lines.join("\n");
  })();

  const handleCopyQuote = () => {
    if (!quoteText || totalCameras === 0) return;
    navigator.clipboard.writeText(quoteText).then(() => {
      toast.success("Quote copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy");
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">

      {/* ═══ HEADER ═══ */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-200">
          <Shield className="h-4 w-4" /> CCTV Setup Builder
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Build Your Complete <span className="text-emerald-600">CCTV Setup</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Follow each step below to configure your complete CCTV system. We auto-calculate the recorder, power supply, cables, HDD, and accessories based on your selections.
        </p>
        <div className="flex justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopyQuote} disabled={totalCameras === 0}>
            <Copy className="h-3.5 w-3.5" /> Copy Quote
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()} disabled={totalCameras === 0}>
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
          <WhatsAppShare text={quoteText} label="WhatsApp" variant="outline" size="sm" className="text-green-700 border-green-300 hover:bg-green-50" />
          <RazorpayCheckout amount={totalPrice} quoteData={{ quote: quoteText, selections: store.cameraSelections }} label="Pay Now" variant="outline" size="sm" className="text-purple-700 border-purple-300 hover:bg-purple-50" />
          <Button variant="outline" size="sm" className="gap-1.5 text-red-600 hover:text-red-700" onClick={() => { store.resetBuilder(); toast.success("Configuration reset"); }}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        </div>
      </div>

      {/* ═══ STEP 1: PROPERTY TYPE ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(1) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={1} title="Select Property Type" active={stepActive(1)} done={stepDone(1)} />
        </CardHeader>
        {stepActive(1) && (
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">Choose the type of property where you want to install CCTV cameras.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {propertyTypes.map((pt) => (
                <button key={pt.value} onClick={() => store.setPropertyType(pt.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center hover:shadow-md",
                    store.propertyType === pt.value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-muted hover:border-emerald-300"
                  )}>
                  <div className={cn("p-2 rounded-lg", store.propertyType === pt.value ? "bg-emerald-100" : "bg-muted")}>{pt.icon}</div>
                  <span className="text-sm font-semibold">{pt.label}</span>
                  <span className="text-[11px] text-muted-foreground leading-tight">{pt.desc}</span>
                </button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* ═══ STEP 2: AREA ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(2) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={2} title="Property Area (sq ft)" active={stepActive(2)} done={stepDone(2)} />
        </CardHeader>
        {stepActive(2) && (
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">Enter the total area of your property in square feet. This helps us estimate how many cameras you need.</p>
            <div className="max-w-xs">
              <Label>Area (sq ft)</Label>
              <Input type="number" placeholder="e.g. 1200" value={store.areaSqft} onChange={(e) => store.setAreaSqft(e.target.value)} className="mt-1.5 text-lg" min="0" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* ═══ STEP 3: CAMERA PROBABILITY ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(3) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={3} title="Recommended Camera Quantity" active={stepActive(3)} done={stepDone(3)} />
        </CardHeader>
        {stepActive(3) && cameraSuggestion && (
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">Based on your <strong>{propertyTypes.find(p => p.value === store.propertyType)?.label}</strong> property of <strong>{area.toLocaleString()} sq ft</strong>, here is our camera recommendation:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-amber-600 font-medium uppercase">Minimum</p>
                  <p className="text-3xl font-bold text-amber-700 mt-1">{cameraSuggestion.min}</p>
                  <p className="text-xs text-muted-foreground">cameras</p>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-emerald-600 font-medium uppercase">Recommended</p>
                  <p className="text-3xl font-bold text-emerald-700 mt-1">{cameraSuggestion.suggested}</p>
                  <p className="text-xs text-muted-foreground">cameras</p>
                </CardContent>
              </Card>
              <Card className="bg-sky-50 border-sky-200">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-sky-600 font-medium uppercase">Maximum</p>
                  <p className="text-3xl font-bold text-sky-700 mt-1">{cameraSuggestion.max}</p>
                  <p className="text-xs text-muted-foreground">cameras</p>
                </CardContent>
              </Card>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-700">These are estimates. You can choose the exact quantity in Step 6. Cover all entry points, parking areas, corridors, and blind spots. Outdoor areas typically need more coverage than indoor spaces.</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ═══ STEP 4: CAMERA SYSTEM TYPE ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(4) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={4} title="Camera System Type" active={stepActive(4)} done={stepDone(4)} />
        </CardHeader>
        {stepActive(4) && (
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">Choose the type of CCTV system. This determines cable type, recorder, and power supply.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cameraSystems.map((cs) => (
                <button key={cs.value} onClick={() => store.setCameraSystem(cs.value)}
                  className={cn(
                    "text-left p-5 rounded-xl border-2 transition-all hover:shadow-md",
                    store.cameraSystem === cs.value ? "border-emerald-500 bg-emerald-50 shadow-sm ring-2 ring-emerald-200" : "border-muted hover:border-emerald-300"
                  )}>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3", store.cameraSystem === cs.value ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground")}>{cs.icon}</div>
                  <h3 className="font-bold text-sm">{cs.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{cs.desc}</p>
                  {store.cameraSystem === cs.value && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-xs font-semibold text-emerald-600">Key Benefits:</p>
                      {cs.pros.map(p => <p key={p} className="text-xs flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" />{p}</p>)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* ═══ STEP 5: CAMERA TECHNOLOGY (MULTI-SELECT) ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(5) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={5} title="Camera Technology (Select Multiple)" active={stepActive(5)} done={stepDone(5)} />
        </CardHeader>
        {stepActive(5) && (
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">Choose one or more camera technology levels. You can mix different technologies in your setup — for example, some cameras with basic night vision and a few with two-way talk at the entrance.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cameraTechs.map((ct) => {
                const isSelected = store.cameraTechs.includes(ct.value);
                return (
                  <button key={ct.value} onClick={() => store.toggleCameraTech(ct.value)}
                    className={cn(
                      "text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all",
                      isSelected ? "border-emerald-500 bg-emerald-50" : "border-muted hover:border-emerald-300"
                    )}>
                    <div className={cn("p-2 rounded-lg shrink-0", isSelected ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground")}>{ct.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{ct.label}</h3>
                        <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ml-2", isSelected ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground/30")}>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{ct.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            {store.cameraTechs.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <p className="text-sm text-emerald-700">Selected: {store.cameraTechs.map(t => cameraTechs.find(ct => ct.value === t)?.label).join(", ")}</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ═══ STEP 6: SELECT CAMERAS FROM PRODUCT CATALOG ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(6) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={6} title="Select Cameras (from Product Catalog)" active={stepActive(6)} done={stepDone(6)} />
        </CardHeader>
        {stepActive(6) && (
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose cameras from your product catalog. Click a product to add it. Adjust quantities with +/-.
              {cameraSuggestion && <span> <strong>Recommended: {cameraSuggestion.suggested} cameras total.</strong></span>}
            </p>

            {/* Product Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by brand, model, resolution..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="pl-9 h-9 text-sm" />
              </div>
              <Select value={productTypeFilter} onValueChange={setProductTypeFilter}>
                <SelectTrigger className="w-32 h-9 text-sm"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Dome">Dome</SelectItem>
                  <SelectItem value="Bullet">Bullet</SelectItem>
                  <SelectItem value="PTZ">PTZ</SelectItem>
                  <SelectItem value="WiFi">WiFi</SelectItem>
                  <SelectItem value="4G">4G</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Available Products Grid */}
            {productsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border rounded-xl p-3 space-y-2 animate-pulse">
                    <div className="aspect-square bg-muted rounded-lg" />
                    <div className="h-3 bg-muted rounded w-16" />
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-3 bg-muted rounded w-20" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                <Package className="h-10 w-10 mx-auto text-amber-400 mb-2" />
                <p className="text-sm font-medium text-amber-700">No cameras found for {store.cameraSystem.toUpperCase()} system</p>
                <p className="text-xs text-amber-600 mt-1">Add {store.cameraSystem === "analog" ? "analog (DVR)" : store.cameraSystem === "ip" ? "IP (NVR)" : "WiFi"} cameras via the Admin panel first.</p>
                <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={() => useStore.getState().setView("admin")}>
                  <Shield className="h-3.5 w-3.5" /> Go to Admin Panel
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredProducts.map((product) => {
                  const isSelected = store.cameraSelections.some(c => c.productId === product.id);
                  const selectedQty = store.cameraSelections.find(c => c.productId === product.id)?.qty || 0;
                  const unitPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
                  return (
                    <button key={product.id} onClick={() => addProduct(product)}
                      className={cn(
                        "text-left rounded-xl border-2 p-3 transition-all hover:shadow-md relative",
                        isSelected ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-muted hover:border-emerald-300"
                      )}>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {selectedQty}
                        </div>
                      )}
                      <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.modelName} className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase">{product.brand}</p>
                      <p className="text-xs font-semibold truncate" title={product.modelName}>{product.modelName}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{product.resolution}</Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{product.cameraType}</Badge>
                      </div>
                      <div className="mt-1.5">
                        {product.salePrice && product.salePrice < product.price ? (
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-emerald-600">{fmt(unitPrice)}</span>
                            <span className="text-[10px] text-muted-foreground line-through">{fmt(product.price)}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold">{fmt(product.price)}</span>
                        )}
                      </div>
                      {isSelected && <p className="text-[10px] text-emerald-600 font-medium mt-1">{selectedQty} added (click to +1)</p>}
                    </button>
                  );
                })}
              </div>
            )}

            <p className="text-xs text-muted-foreground">{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available</p>

            {/* Selected Cameras Table */}
            {store.cameraSelections.length > 0 && (
              <div className="border rounded-xl overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-0 bg-muted px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span>Product</span><span>Resolution</span><span>Technology</span><span className="text-center">Qty</span><span className="text-right">Price</span><span className="w-8"></span>
                </div>
                {store.cameraSelections.map((cam) => {
                  const unitPrice = cam.salePrice && cam.salePrice < cam.price ? cam.salePrice : cam.price;
                  return (
                    <div key={cam.productId} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-0 px-4 py-3 items-center border-t">
                      <div className="flex items-center gap-2 min-w-0">
                        {cam.imageUrl ? (
                          <img src={cam.imageUrl} alt="" className="w-8 h-8 rounded object-contain bg-muted border shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <div className="w-8 h-8 rounded bg-muted border flex items-center justify-center shrink-0"><Camera className="h-4 w-4 text-muted-foreground" /></div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">{cam.brand} {cam.modelName}</p>
                          <p className="text-[10px] text-muted-foreground">{cam.cameraType}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="w-fit text-xs">{cam.mp}</Badge>
                      <Select value={cam.tech} onValueChange={(v) => updateSelectionTech(cam.productId, v as CameraTech)}>
                        <SelectTrigger className="h-8 text-xs w-full max-w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cameraTechs.filter(ct => store.cameraTechs.includes(ct.value)).map(ct => (
                            <SelectItem key={ct.value} value={ct.value}>{ct.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex justify-center">
                        <QtyControl value={cam.qty} onChange={(v) => updateSelectionQty(cam.productId, v)} />
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold">{fmt(unitPrice * cam.qty)}</p>
                        <p className="text-[10px] text-muted-foreground">{fmt(unitPrice)} x {cam.qty}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:text-red-600" onClick={() => removeSelection(cam.productId)}>
                        <span className="text-lg leading-none">&times;</span>
                      </Button>
                    </div>
                  );
                })}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-0 px-4 py-3 bg-emerald-50 border-t font-bold text-sm">
                  <span>{totalCameras} camera{totalCameras !== 1 ? "s" : ""}</span>
                  <span></span><span></span>
                  <span></span>
                  <span className="text-right text-emerald-700">{fmt(totalPrice)}</span>
                  <span></span>
                </div>
              </div>
            )}

            {/* Empty selected state */}
            {store.cameraSelections.length === 0 && !productsLoading && filteredProducts.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">Click on any product above to add it to your configuration. You can add the same product multiple times — click again to increase quantity, or use +/- in the table below.</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ═══ STEP 7: DVR/NVR SUGGESTION ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(7) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={7} title="Recorder (DVR/NVR) — Auto Suggested" active={stepActive(7)} done={stepDone(7)} />
        </CardHeader>
        {stepActive(7) && (
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">Based on your <strong>{totalCameras} camera{totalCameras !== 1 ? "s" : ""}</strong> and <strong>{store.cameraSystem}</strong> system, here is the recommended recorder configuration:</p>
            {recorderConfig ? (
              <div className="space-y-3">
                {/* Summary */}
                <Card className={cn("border-2", store.cameraSystem === "analog" ? "border-sky-200 bg-sky-50" : store.cameraSystem === "ip" ? "border-emerald-200 bg-emerald-50" : "border-violet-200 bg-violet-50")}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={cn("p-3 rounded-xl shrink-0", store.cameraSystem === "analog" ? "bg-sky-100 text-sky-700" : store.cameraSystem === "ip" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700")}>
                        {store.cameraSystem === "analog" ? <HardDrive className="h-6 w-6" /> : store.cameraSystem === "ip" ? <Server className="h-6 w-6" /> : <Cloud className="h-6 w-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{recorderConfig.type}</h3>
                          {recorderConfig.units.length > 0 && <Badge variant="secondary">{recorderConfig.units.length} unit{recorderConfig.units.length > 1 ? "s" : ""} required</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{recorderConfig.summary}</p>
                        {store.cameraSystem === "analog" && (
                          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-amber-700">Match the DVR brand with camera brand — Hikvision cameras need Hikvision DVR (HD-TVI), Dahua cameras need Dahua DVR (HD-CVI). They are NOT cross-compatible.</p>
                          </div>
                        )}
                        {recorderConfig.exceedsMax && (
                          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2 flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-red-700">
                              {totalCameras} cameras exceed the maximum available single {recorderConfig.type} ({store.cameraSystem === "analog" ? "32" : "256"} channels). Multiple {recorderConfig.type} units are required as shown above.
                            </p>
                          </div>
                        )}
                      </div>
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                    </div>
                  </CardContent>
                </Card>

                {/* Individual unit cards — always show when multiple units OR when exceeds max */}
                {(recorderConfig.units.length > 1 || recorderConfig.exceedsMax) && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Unit Breakdown</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {recorderConfig.units.map((unit, i) => (
                        <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 border">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <HardDrive className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{unit.channels}-Channel {recorderConfig.type} #{i + 1}</p>
                            <p className="text-xs text-muted-foreground">{unit.usedPorts} camera{unit.usedPorts !== 1 ? "s" : ""} connected, {unit.channels - unit.usedPorts} channel{unit.channels - unit.usedPorts !== 1 ? "s" : ""} spare</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Add cameras in Step 6 to see the recorder recommendation.</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ═══ STEP 8: POWER SUPPLY ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(8) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={8} title="Power Supply — Auto Suggested" active={stepActive(8)} done={stepDone(8)} />
        </CardHeader>
        {stepActive(8) && (
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">
              {store.cameraSystem === "wifi"
                ? "WiFi cameras are powered by the included adapter. No separate power supply is needed."
                : `Based on your ${totalCameras} camera${totalCameras !== 1 ? "s" : ""}, here is the recommended power solution:`}
            </p>
            {store.cameraSystem === "wifi" ? (
              <Card className="border-2 border-violet-200 bg-violet-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <Plug className="h-5 w-5 text-violet-500" />
                  <div>
                    <p className="font-semibold text-sm">No Separate Power Supply Needed</p>
                    <p className="text-xs text-muted-foreground">Each WiFi camera comes with its own 12V power adapter. Just plug into a nearby power outlet.</p>
                  </div>
                </CardContent>
              </Card>
            ) : powerConfig ? (
              <div className="space-y-3">
                <Card className="border-2 border-amber-200 bg-amber-50">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-amber-100 text-amber-700 p-3 rounded-xl shrink-0">
                        {store.cameraSystem === "analog" ? <Zap className="h-6 w-6" /> : <Router className="h-6 w-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{store.cameraSystem === "analog" ? "SMPS Power Supply" : "PoE Switch"}</h3>
                          {powerConfig.units.length > 0 && <Badge variant="secondary">{powerConfig.units.length} unit{powerConfig.units.length > 1 ? "s" : ""} required</Badge>}
                          {hasAbove2mp && store.cameraSystem === "ip" && <Badge className="bg-amber-600 text-white">Gigabit</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{powerConfig.summary}</p>
                        {hasAbove2mp && store.cameraSystem === "ip" && (
                          <div className="mt-2 bg-amber-100 border border-amber-300 rounded-lg p-2">
                            <p className="text-xs text-amber-700 flex items-center gap-1"><Info className="h-3 w-3" /> Gigabit PoE switch is required because you selected cameras above 2MP which need higher bandwidth.</p>
                          </div>
                        )}
                      </div>
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                    </div>
                  </CardContent>
                </Card>

                {/* Individual unit cards */}
                {powerConfig.units.length > 1 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Unit Breakdown</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {powerConfig.units.map((unit, i) => (
                        <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 border">
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", store.cameraSystem === "analog" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>
                            {store.cameraSystem === "analog" ? <Zap className="h-5 w-5" /> : <Router className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{unit.ports}-{store.cameraSystem === "analog" ? "Channel SMPS" : "Port PoE Switch"} #{i + 1}</p>
                            <p className="text-xs text-muted-foreground">{unit.usedPorts} camera{unit.usedPorts !== 1 ? "s" : ""} connected, {unit.ports - unit.usedPorts} port{unit.ports - unit.usedPorts !== 1 ? "s" : ""} spare</p>
                            {unit.variant === "giga" && <Badge className="mt-1 bg-amber-600 text-white text-[10px]">Gigabit</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {store.cameraSystem === "ip" && totalCameras > 24 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-700">PoE switches are available in 4, 8, 16, and 24-port variants in the market. For {totalCameras} cameras, we recommend {powerConfig.units.length}x PoE switches. 32-port and 48-port PoE switches do not exist.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <Zap className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Add cameras in Step 6 to see the power supply recommendation.</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ═══ STEP 9: HDD / RETENTION ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(9) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={9} title="Storage (HDD) & Retention Days" active={stepActive(9)} done={stepDone(9)} />
        </CardHeader>
        {stepActive(9) && (
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">
              {store.cameraSystem === "wifi"
                ? "WiFi cameras use MicroSD cards. A 64GB card gives approximately 7-10 days for 1 camera."
                : "Choose how many days of recording you want to keep. We calculate the required HDD size using real H.265+ bitrate data."}
            </p>
            {store.cameraSystem === "wifi" ? (
              <Card className="border-2 border-violet-200 bg-violet-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <HardDrive className="h-5 w-5 text-violet-500" />
                  <div>
                    <p className="font-semibold text-sm">MicroSD Card Storage</p>
                    <p className="text-xs text-muted-foreground">Recommended: 64GB or 128GB MicroSD card per camera. Supports 7-20 days depending on recording mode.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Retention Days (How long to keep recordings)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {retentionOptions.map(d => (
                      <button key={d} onClick={() => store.setRetentionDays(d)}
                        className={cn("px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all",
                          store.retentionDays === d ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-muted hover:border-emerald-300"
                        )}>
                        {d} days
                      </button>
                    ))}
                  </div>
                </div>
                {hddCalc.size && (
                  <div className="space-y-3">
                    <Card className="border-2 border-emerald-200 bg-emerald-50">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl shrink-0">
                          <HardDrive className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{hddCalc.size} HDD Required</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{hddCalc.breakdown}</p>
                          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                            <p className="text-xs text-blue-700 flex items-center gap-1">
                              <Calculator className="h-3 w-3" />
                              Calculated using H.265+ compression at ~70% motion activity factor per camera
                            </p>
                          </div>
                        </div>
                        <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                      </CardContent>
                    </Card>

                    {/* Per-camera-type breakdown */}
                    {store.cameraSelections.length > 1 && (
                      <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Storage Breakdown by Camera Type</p>
                        {store.cameraSelections.map((cam, i) => {
                          const gbPerDay = BITRATE_GB_PER_DAY[cam.mp] || 30.2;
                          const totalGB = gbPerDay * cam.qty * store.retentionDays;
                          return (
                            <div key={cam.productId || i} className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{cam.qty}x {cam.brand} {cam.modelName} ({cam.mp})</span>
                              <span className="font-medium">{(totalGB / 1024).toFixed(1)} TB</span>
                            </div>
                          );
                        })}
                        <Separator className="my-1" />
                        <div className="flex justify-between text-xs font-bold">
                          <span>Total for {store.retentionDays} days</span>
                          <span>{hddCalc.size}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        )}
      </Card>

      {/* ═══ STEP 10: CABLE ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(10) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={10} title="Cable — Auto Calculated" active={stepActive(10)} done={stepDone(10)} />
        </CardHeader>
        {stepActive(10) && (
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">
              {store.cameraSystem === "analog"
                ? "Analog cameras use RG59 coaxial cable. Available in 90m and 180m rolls. Average cable run per camera is 20-30 meters."
                : "IP cameras use Cat6 Ethernet cable. Available in 100m and 305m (bulk box) rolls. Maximum cable run per camera is 100m (Ethernet limit)."}
            </p>
            <div className="max-w-xs">
              <Label>Average cable length per camera (meters)</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input type="number" value={store.cableLengthPerCamera} onChange={(e) => store.setCableLengthPerCamera(Math.max(1, Math.min(store.cameraSystem === "ip" ? 100 : 300, parseInt(e.target.value) || 20)))} className="w-24" min="1" />
                <span className="text-sm text-muted-foreground">meters</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Typical: 20-30m per camera. Adjust based on your property layout.</p>
            </div>
            {totalCameras > 0 && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-blue-500" />
                    <p className="text-sm font-medium text-blue-700">
                      Total Cable: <strong>{totalCableMeters} meters</strong> ({totalCameras} cameras x {store.cableLengthPerCamera}m)
                    </p>
                  </div>
                </div>
                {store.cameraSystem === "analog" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onClick={() => store.setCableSelection({ type: "90m", qty: cableRolls90 })}
                      className={cn("text-left p-4 rounded-xl border-2 transition-all", store.cableSelection?.type === "90m" ? "border-emerald-500 bg-emerald-50" : "border-muted hover:border-emerald-300")}>
                      <p className="font-bold">RG59 Coaxial — 90m Roll</p>
                      <p className="text-2xl font-bold text-emerald-700 mt-1">{cableRolls90} <span className="text-sm font-normal text-muted-foreground">rolls</span></p>
                      <p className="text-xs text-muted-foreground mt-1">Better for smaller properties. Easier to handle during installation.</p>
                    </button>
                    <button onClick={() => store.setCableSelection({ type: "180m", qty: cableRolls180 })}
                      className={cn("text-left p-4 rounded-xl border-2 transition-all", store.cableSelection?.type === "180m" ? "border-emerald-500 bg-emerald-50" : "border-muted hover:border-emerald-300")}>
                      <p className="font-bold">RG59 Coaxial — 180m Roll</p>
                      <p className="text-2xl font-bold text-emerald-700 mt-1">{cableRolls180} <span className="text-sm font-normal text-muted-foreground">rolls</span></p>
                      <p className="text-xs text-muted-foreground mt-1">Better value for larger properties. Less joints needed.</p>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onClick={() => store.setCableSelection({ type: "100m", qty: cableRolls100 })}
                      className={cn("text-left p-4 rounded-xl border-2 transition-all", store.cableSelection?.type === "100m" ? "border-emerald-500 bg-emerald-50" : "border-muted hover:border-emerald-300")}>
                      <p className="font-bold">Cat6 Ethernet — 100m Roll</p>
                      <p className="text-2xl font-bold text-emerald-700 mt-1">{cableRolls100} <span className="text-sm font-normal text-muted-foreground">rolls</span></p>
                      <p className="text-xs text-muted-foreground mt-1">Standard length. Matches maximum Ethernet distance of 100m per run.</p>
                    </button>
                    <button onClick={() => store.setCableSelection({ type: "305m", qty: cableRolls305 })}
                      className={cn("text-left p-4 rounded-xl border-2 transition-all", store.cableSelection?.type === "305m" ? "border-emerald-500 bg-emerald-50" : "border-muted hover:border-emerald-300")}>
                      <p className="font-bold">Cat6 Ethernet — 305m Box</p>
                      <p className="text-2xl font-bold text-emerald-700 mt-1">{cableRolls305} <span className="text-sm font-normal text-muted-foreground">boxes</span></p>
                      <p className="text-xs text-muted-foreground mt-1">Bulk box (1000ft). Best value for installations with many cameras.</p>
                    </button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ═══ STEP 11: ACCESSORIES ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(11) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={11} title="Accessories — Auto Calculated + Optional" active={stepActive(11)} done={stepDone(11)} />
        </CardHeader>
        {stepActive(11) && totalCameras > 0 && (
          <CardContent className="pt-0 space-y-6">

            {/* Auto-calculated accessories */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Auto-Calculated (based on your {totalCameras} cameras)</p>
              {store.cameraSystem === "wifi" ? (
                <p className="text-sm text-muted-foreground">WiFi cameras do not need junction boxes, connectors, or cables.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {store.junctionBox4x4 > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <Box className="h-4 w-4 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Junction Box 4x4 (Bullet)</p>
                      <p className="text-lg font-bold">{store.junctionBox4x4}</p>
                    </div>
                  )}
                  {store.junctionBox5x5 > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <Box className="h-4 w-4 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Junction Box 5x5 (Dome)</p>
                      <p className="text-lg font-bold">{store.junctionBox5x5}</p>
                    </div>
                  )}
                  {store.dcConnector > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <Link className="h-4 w-4 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">DC Connector (1 per camera)</p>
                      <p className="text-lg font-bold">{store.dcConnector}</p>
                    </div>
                  )}
                  {store.bncConnector > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <Link className="h-4 w-4 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">BNC Connector (2 per camera)</p>
                      <p className="text-lg font-bold">{store.bncConnector}</p>
                    </div>
                  )}
                  {store.rj45Connector > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <Link className="h-4 w-4 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">RJ45 Connector (2 per camera)</p>
                      <p className="text-lg font-bold">{store.rj45Connector}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Extra / Optional accessories */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Optional Extra Accessories</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Networking Rack */}
                <div className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Networking Rack</span>
                    </div>
                    <QtyControl value={store.networkingRack} onChange={(v) => store.setNetworkingRack(v)} min={0} max={4} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">To mount NVR, PoE switches, and router. 6U or 9U rack recommended. Needed for {totalCameras > 4 ? "large" : "small"} setups.</p>
                </div>

                {/* Monitor */}
                <div className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Monitor</span>
                    </div>
                    <QtyControl value={store.monitor} onChange={(v) => store.setMonitor(v)} min={0} max={4} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-[11px] text-muted-foreground">Size:</Label>
                    <Select value={store.monitorSize} onValueChange={(v) => store.setMonitorSize(v)}>
                      <SelectTrigger className="h-7 text-xs w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="21.5">21.5 inch</SelectItem>
                        <SelectItem value="27">27 inch</SelectItem>
                        <SelectItem value="32">32 inch</SelectItem>
                        <SelectItem value="43">43 inch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-[11px] text-muted-foreground">For live viewing. 21.5 inch for 4-8 cameras, 32 inch for 16+, 43 inch for 32+.</p>
                </div>

                {/* Extension Board */}
                <div className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plug className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Extension Board</span>
                    </div>
                    <QtyControl value={store.extensionBoard} onChange={(v) => store.setExtensionBoard(v)} min={0} max={4} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">6-way or 8-way extension board with surge protection for powering all equipment at the setup location.</p>
                </div>

                {/* Wireless Mouse */}
                <div className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mouse className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Wireless Mouse</span>
                    </div>
                    <QtyControl value={store.wirelessMouse} onChange={(v) => store.setWirelessMouse(v)} min={0} max={2} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">USB wireless mouse for NVR/DVR navigation. Much easier than using the front panel buttons.</p>
                </div>

                {/* Wireless Keyboard */}
                <div className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Keyboard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Wireless Keyboard</span>
                    </div>
                    <QtyControl value={store.wirelessKeyboard} onChange={(v) => store.setWirelessKeyboard(v)} min={0} max={2} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">USB wireless keyboard with touchpad for NVR/DVR operation and text input (search, camera naming).</p>
                </div>

                {/* UPS */}
                <div className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">UPS (Uninterruptible Power Supply)</span>
                    </div>
                    <QtyControl value={store.ups} onChange={(v) => store.setUps(v)} min={0} max={4} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Keeps your NVR/DVR running during power cuts. Recommended: 1KVA for small setups, 2KVA for 16+ cameras.</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ═══ FINAL SUMMARY ═══ */}
      {totalCameras > 0 && (
        <Card className="border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <p className="font-bold text-emerald-800">Complete Setup Summary — {totalCameras} Camera{totalCameras !== 1 ? "s" : ""}</p>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Property:</span><span className="font-medium">{propertyTypes.find(p => p.value === store.propertyType)?.label}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Area:</span><span className="font-medium">{store.areaSqft} sq ft</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">System:</span><span className="font-medium uppercase">{store.cameraSystem}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Technologies:</span><span className="font-medium">{store.cameraTechs.map(t => cameraTechs.find(ct => ct.value === t)?.label).join(", ")}</span></div>
            </div>
            <Separator />
            {/* Camera Line Items */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cameras</p>
              {store.cameraSelections.map((cam) => {
                const unitPrice = cam.salePrice && cam.salePrice < cam.price ? cam.salePrice : cam.price;
                return (
                  <div key={cam.productId} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{cam.qty}x {cam.brand} {cam.modelName} ({cam.mp})</span>
                    <span className="font-medium">{fmt(unitPrice * cam.qty)}</span>
                  </div>
                );
              })}
              <div className="flex justify-between text-sm font-bold text-emerald-700 pt-1 border-t">
                <span>Camera Subtotal</span><span>{fmt(totalPrice)}</span>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {recorderConfig && recorderConfig.units.length > 0 && (
                <div className="flex justify-between"><span className="text-muted-foreground">Recorder:</span><span className="font-medium">{recorderConfig.units.map(u => `${u.channels}ch ${recorderConfig.type}`).join(" + ")}</span></div>
              )}
              {powerConfig && powerConfig.units.length > 0 && (
                <div className="flex justify-between"><span className="text-muted-foreground">Power:</span><span className="font-medium">{powerConfig.units.map(u => `${u.ports}-${store.cameraSystem === "analog" ? "ch SMPS" : "port PoE"}`).join(" + ")}</span></div>
              )}
              {hddCalc.size && (
                <div className="flex justify-between"><span className="text-muted-foreground">Storage ({store.retentionDays}d):</span><span className="font-medium">{hddCalc.size} HDD</span></div>
              )}
              {store.cableSelection && (
                <div className="flex justify-between"><span className="text-muted-foreground">Cable ({totalCableMeters}m):</span><span className="font-medium">{store.cableSelection.qty}x {store.cableSelection.type} roll{store.cableSelection.qty > 1 ? "s" : ""}</span></div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" className="gap-1.5" onClick={handleCopyQuote}>
                <Copy className="h-3.5 w-3.5" /> Copy Full Quote
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => window.print()}>
                <Printer className="h-3.5 w-3.5" /> Print Quote
              </Button>
              <WhatsAppShare text={quoteText} label="WhatsApp Quote" variant="outline" size="sm" className="text-green-700 border-green-300 hover:bg-green-50" />
              <RazorpayCheckout amount={totalPrice} quoteData={{ quote: quoteText, selections: store.cameraSelections }} label="Pay Now" variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700" />
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}