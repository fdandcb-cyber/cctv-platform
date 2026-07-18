"use client";

import { useEffect, useMemo } from "react";
import { useBuilderStore, type CameraForm, type CameraSelection, type CameraSystem, type CameraTech, type PropertyType } from "@/store/builder-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Home, Building2, Store, Warehouse, Factory, UtensilsCrossed,
  GraduationCap, Hospital, Castle, HelpCircle,
  Camera, Wifi, Cable, Radio, Shield, HardDrive, Cloud,
  Monitor, Plug, Plus, Minus, ChevronRight, CheckCircle2,
  AlertTriangle, Lightbulb, Router, Cpu, Server, Battery,
  Mouse, Keyboard, MonitorSpeaker, Zap, Box, Link,
  Calculator, RotateCcw, Info, Eye, Volume2, MessageSquare,
  Sun, Moon, Palette,
} from "lucide-react";

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

const cameraSystems: { value: CameraSystem; label: string; icon: React.ReactNode; desc: string; pros: string[]; cons: string[] }[] = [
  { value: "analog", label: "Analog (HD-TVI / HD-CVI)", icon: <Cable className="h-6 w-6" />, desc: "Uses coaxial cable + DVR. Budget-friendly, easy to install, reliable for standard setups.", pros: ["Most affordable", "Easy installation", "Long cable runs (300m+)", "Proven technology"], cons: ["Lower max resolution (8MP)", "Separate power cable needed", "Limited smart features", "Brand-locked (Hikvision/Dahua)"] },
  { value: "ip", label: "IP (Network Camera)", icon: <Wifi className="h-6 w-6" />, desc: "Uses Ethernet cable + NVR with PoE. Best quality, single cable for data+power, smart features.", pros: ["Best video quality (up to 12MP)", "PoE - one cable carries everything", "Smart AI features", "Cross-brand compatible (ONVIF)"], cons: ["More expensive", "100m max cable per run", "Requires network knowledge", "Higher bandwidth needed"] },
  { value: "wifi", label: "WiFi (Wireless)", icon: <Radio className="h-6 w-6" />, desc: "No cables at all. Camera connects to WiFi, stores on MicroSD card or cloud. No DVR/NVR needed.", pros: ["Zero cable installation", "DIY friendly", "Works with MicroSD + Cloud", "Instant mobile alerts"], cons: ["Depends on WiFi strength", "Limited to 1-3 cameras", "Not for large properties", "Higher running cost (cloud)"] },
];

const cameraTechs: { value: CameraTech; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "night_vision", label: "Night Vision (IR)", icon: <Moon className="h-5 w-5" />, desc: "Black & white recording in darkness using infrared LEDs. Reliable, long-range (20-80m)." },
  { value: "night_vision_audio", label: "Night Vision + Audio", icon: <Volume2 className="h-5 w-5" />, desc: "IR night vision with built-in microphone for audio recording. You can hear what's happening." },
  { value: "color_audio", label: "Full Color + Audio", icon: <Palette className="h-5 w-5" />, desc: "Records in full color even at night using ColorVu/Full-Color technology. Includes audio." },
  { value: "two_way_talk", label: "Two-Way Talk", icon: <MessageSquare className="h-5 w-5" />, desc: "Full color night vision + audio + built-in speaker for two-way communication through the app." },
];

const mpOptions = ["2MP", "3MP", "4MP", "5MP", "8MP", "12MP"];
const formOptions: { value: CameraForm; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "dome", label: "Dome", icon: <Camera className="h-5 w-5" />, desc: "Indoor, vandal-proof, hidden direction" },
  { value: "bullet", label: "Bullet", icon: <Camera className="h-5 w-5" />, desc: "Outdoor, long-range IR, visible deterrent" },
  { value: "ptz", label: "PTZ", icon: <Radio className="h-5 w-5" />, desc: "Pan-tilt-zoom, 360° coverage, auto-track" },
];

const retentionOptions = [7, 10, 15, 20, 30, 45, 60, 90];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

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

function getSuggestedChannels(camCount: number): number {
  if (camCount <= 4) return 4;
  if (camCount <= 8) return 8;
  if (camCount <= 16) return 16;
  return 32;
}

function getHddSize(totalCameras: number, avgMp: number, retentionDays: number, system: CameraSystem): string {
  const mpMap: Record<string, number> = { "2MP": 2, "3MP": 3, "4MP": 4, "5MP": 5, "8MP": 8, "12MP": 12 };
  const mpVal = mpMap[avgMp] || 4;
  // GB per camera per day (H.265+ compression, motion recording ~70% of 24/7)
  const gbPerCamPerDay = (mpVal * 2.5 * 0.7) / (system === "wifi" ? 2 : 1);
  const totalGb = totalCameras * gbPerCamPerDay * retentionDays;
  // Available HDD sizes in TB
  const hddSizes = [500, 1000, 2000, 3000, 4000, 6000, 8000, 10000];
  for (const size of hddSizes) {
    if (size >= totalGb) return size >= 1000 ? `${(size / 1000).toFixed(0)} TB` : `${size} GB`;
  }
  return "10+ TB (Multiple HDDs)";
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

function QtyControl({ value, onChange, min = 0, max = 32 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}><Minus className="h-3 w-3" /></Button>
      <span className="w-8 text-center font-bold text-sm">{value}</span>
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
  const hasTech = store.cameraTech !== "";

  const cameraSuggestion = useMemo(() => {
    if (!hasPropertyType || !hasArea) return null;
    return getCameraSuggestion(area, store.propertyType);
  }, [hasPropertyType, hasArea, area, store.propertyType]);

  const totalCameras = useMemo(() => store.cameraSelections.reduce((s, c) => s + c.qty, 0), [store.cameraSelections]);
  const suggestedChannels = useMemo(() => getSuggestedChannels(totalCameras), [totalCameras]);

  const recorderSuggestion = useMemo(() => {
    if (totalCameras === 0) return null;
    if (store.cameraSystem === "wifi") return { type: "None (MicroSD/Cloud)", channels: 0, label: "WiFi cameras do not need a DVR/NVR — they record on MicroSD card or cloud." };
    if (store.cameraSystem === "analog") return { type: "DVR", channels: suggestedChannels, label: `${suggestedChannels}-Channel DVR (HD-TVI or HD-CVI, match camera brand)` };
    return { type: "NVR", channels: suggestedChannels, label: `${suggestedChannels}-Channel NVR with PoE (supports up to ${suggestedChannels} IP cameras)` };
  }, [totalCameras, store.cameraSystem, suggestedChannels]);

  const powerSuggestion = useMemo(() => {
    if (totalCameras === 0 || store.cameraSystem === "wifi") return null;
    const hasAbove2mp = store.cameraSelections.some(c => c.mp !== "2MP");
    if (store.cameraSystem === "analog") {
      return { type: "SMPS", channels: suggestedChannels, variant: "standard" as const, label: `${suggestedChannels}-Channel SMPS Power Supply (12V DC)` };
    }
    if (hasAbove2mp) {
      return { type: "PoE Switch", channels: suggestedChannels, variant: "giga" as const, label: `${suggestedChannels}-Port Gigabit PoE Switch (required for cameras above 2MP)` };
    }
    return { type: "PoE Switch", channels: suggestedChannels, variant: "standard" as const, label: `${suggestedChannels}-Port Fast Ethernet PoE Switch (sufficient for 2MP cameras)` };
  }, [totalCameras, store.cameraSystem, suggestedChannels, store.cameraSelections]);

  const hddSize = useMemo(() => {
    if (totalCameras === 0 || store.cameraSystem === "wifi") return "";
    const mps = store.cameraSelections.map(c => c.mp);
    if (mps.length === 0) return "";
    const avgMp = mps[0];
    return getHddSize(totalCameras, avgMp, store.retentionDays, store.cameraSystem);
  }, [totalCameras, store.cameraSelections, store.retentionDays, store.cameraSystem]);

  const totalCableMeters = useMemo(() => getTotalCableMeters(totalCameras, store.cableLengthPerCamera), [totalCameras, store.cableLengthPerCamera]);

  const cableRolls90 = useMemo(() => getCableRolls(totalCableMeters, 90), [totalCableMeters]);
  const cableRolls180 = useMemo(() => getCableRolls(totalCableMeters, 180), [totalCableMeters]);
  const cableRolls100 = useMemo(() => getCableRolls(totalCableMeters, 100), [totalCableMeters]);
  const cableRolls305 = useMemo(() => getCableRolls(totalCableMeters, 305), [totalCableMeters]);

  // ─── Auto-calculate accessories ───
  useEffect(() => {
    if (totalCameras === 0) return;
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
    }
  }, [totalCameras, store.cameraSystem, store.cameraSelections]);

  useEffect(() => {
    store.setRecorderSuggestion(recorderSuggestion);
  }, [recorderSuggestion, store.setRecorderSuggestion]);

  useEffect(() => {
    store.setPowerSuggestion(powerSuggestion);
  }, [powerSuggestion, store.setPowerSuggestion]);

  useEffect(() => {
    store.setHddSuggestion(hddSize);
  }, [hddSize, store.setHddSuggestion]);

  useEffect(() => {
    if (cameraSuggestion) {
      store.setSuggestedCameras(cameraSuggestion.suggested);
    }
  }, [cameraSuggestion, store.setSuggestedCameras]);

  // ─── Camera Selection Handlers ───
  const updateCameraQty = (mp: string, form: CameraForm, delta: number) => {
    const current = [...store.cameraSelections];
    const idx = current.findIndex(c => c.mp === mp && c.form === form);
    if (idx >= 0) {
      const newQty = Math.max(0, Math.min(32, current[idx].qty + delta));
      if (newQty === 0) {
        current.splice(idx, 1);
      } else {
        current[idx].qty = newQty;
      }
    } else if (delta > 0) {
      current.push({ mp, form, qty: 1, tech: store.cameraTech as CameraTech });
    }
    store.setCameraSelections(current);
  };

  // ─── Determine which steps are active/reached ───
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
      case 7: return recorderSuggestion !== null;
      case 8: return powerSuggestion !== null || store.cameraSystem === "wifi";
      case 9: return hddSize !== "" || store.cameraSystem === "wifi";
      case 10: return totalCameras > 0;
      case 11: return totalCameras > 0;
      default: return false;
    }
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
          Follow each step below to configure your complete CCTV system. We will auto-calculate the recorder, power supply, cables, HDD, and accessories based on your selections.
        </p>
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
              <p className="text-sm text-blue-700">These are estimates. You can choose the exact quantity in Step 6. Consider covering all entry points, parking, and blind spots. Outdoor areas need more coverage than indoor spaces.</p>
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
            <p className="text-sm text-muted-foreground">Choose the type of CCTV system. This determines the cable type, recorder, and power supply you will need.</p>
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
                      <p className="text-xs font-semibold text-emerald-600">Advantages:</p>
                      {cs.pros.map(p => <p key={p} className="text-xs flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" />{p}</p>)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* ═══ STEP 5: CAMERA TECHNOLOGY ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(5) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={5} title="Camera Technology" active={stepActive(5)} done={stepDone(5)} />
        </CardHeader>
        {stepActive(5) && (
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">Choose the camera technology level. Higher technology means better night recording and audio capabilities.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cameraTechs.map((ct) => (
                <button key={ct.value} onClick={() => store.setCameraTech(ct.value)}
                  className={cn(
                    "text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all",
                    store.cameraTech === ct.value ? "border-emerald-500 bg-emerald-50" : "border-muted hover:border-emerald-300"
                  )}>
                  <div className={cn("p-2 rounded-lg shrink-0", store.cameraTech === ct.value ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground")}>{ct.icon}</div>
                  <div>
                    <h3 className="font-semibold text-sm">{ct.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{ct.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* ═══ STEP 6: MEGAPIXEL + CAMERA FORM + QTY ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(6) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={6} title="Select Cameras (Megapixel + Type + Quantity)" active={stepActive(6)} done={stepDone(6)} />
        </CardHeader>
        {stepActive(6) && (
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">
              Select the megapixel resolution and camera form factor. You can choose multiple combinations. Use +/- to adjust quantity.
              {cameraSuggestion && <span> <strong>Recommended: {cameraSuggestion.suggested} cameras total.</strong></span>}
            </p>

            {/* MP Selection */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Megapixel Resolution</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {mpOptions.map(mp => {
                  const hasThisMp = store.cameraSelections.some(c => c.mp === mp);
                  return (
                    <button key={mp} onClick={() => updateCameraQty(mp, "dome", hasThisMp ? 0 : 1)}
                      className={cn("px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all", hasThisMp ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-muted hover:border-emerald-300")}>
                      {mp}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Camera Grid: MP × Form with Qty */}
            {store.cameraSelections.length > 0 && (
              <div className="border rounded-xl overflow-hidden">
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-0 bg-muted px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span>Resolution</span><span>Camera Type</span><span>Technology</span><span className="text-right pr-2">Quantity</span>
                </div>
                {[...store.cameraSelections].sort((a, b) => mpOptions.indexOf(a.mp) - mpOptions.indexOf(b.mp)).map((cam, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-0 px-4 py-3 items-center border-t">
                    <Badge variant="outline" className="w-fit">{cam.mp}</Badge>
                    <div className="flex items-center gap-1.5">
                      {formOptions.find(f => f.value === cam.form)?.icon}
                      <span className="text-sm capitalize">{cam.form}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{cameraTechs.find(t => t.value === cam.tech)?.label}</span>
                    <div className="flex items-center justify-end gap-1">
                      <QtyControl value={cam.qty} onChange={(v) => updateCameraQty(cam.mp, cam.form, v - cam.qty)} />
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:text-red-600" onClick={() => updateCameraQty(cam.mp, cam.form, -cam.qty)}>
                        <span className="text-lg leading-none">&times;</span>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-0 px-4 py-3 bg-emerald-50 border-t font-bold text-sm">
                  <span>Total</span><span></span><span></span><span className="text-right pr-3 text-emerald-700">{totalCameras} camera{totalCameras !== 1 ? "s" : ""}</span>
                </div>
              </div>
            )}

            {/* Quick Add Buttons */}
            {store.cameraSelections.length === 0 && (
              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <Camera className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click on a megapixel option above to start adding cameras. You can then add different form factors (Dome, Bullet, PTZ).</p>
              </div>
            )}

            {/* Add More Form Factor for existing MP */}
            {store.cameraSelections.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Add More Cameras</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mpOptions.filter(mp => store.cameraSelections.some(c => c.mp === mp)).flatMap(mp =>
                    formOptions.filter(f => !store.cameraSelections.some(c => c.mp === mp && c.form === f.value)).map(f => (
                      <Button key={mp + "-" + f.value} variant="outline" size="sm" className="gap-1.5 text-xs"
                        onClick={() => updateCameraQty(mp, f.value, 1)}>
                        {f.icon} {mp} {f.label} <Plus className="h-3 w-3" />
                      </Button>
                    ))
                  )}
                </div>
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
            <p className="text-sm text-muted-foreground">Based on your {totalCameras} camera{totalCameras !== 1 ? "s" : ""} and {store.cameraSystem} system, here is the recommended recorder:</p>
            {recorderSuggestion ? (
              <Card className={cn("border-2", store.cameraSystem === "analog" ? "border-sky-200 bg-sky-50" : store.cameraSystem === "ip" ? "border-emerald-200 bg-emerald-50" : "border-violet-200 bg-violet-50")}>
                <CardContent className="p-5 flex items-start gap-4">
                  <div className={cn("p-3 rounded-xl", store.cameraSystem === "analog" ? "bg-sky-100 text-sky-700" : store.cameraSystem === "ip" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700")}>
                    {store.cameraSystem === "analog" ? <HardDrive className="h-6 w-6" /> : store.cameraSystem === "ip" ? <Cloud className="h-6 w-6" /> : <Wifi className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{recorderSuggestion.type}</h3>
                      {recorderSuggestion.channels > 0 && <Badge variant="secondary">{recorderSuggestion.channels}-Channel</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{recorderSuggestion.label}</p>
                    {store.cameraSystem === "analog" && (
                      <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-700">Match the DVR brand with camera brand — Hikvision cameras need Hikvision DVR, Dahua cameras need Dahua DVR.</p>
                      </div>
                    )}
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                </CardContent>
              </Card>
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
            ) : powerSuggestion ? (
              <Card className="border-2 border-amber-200 bg-amber-50">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="bg-amber-100 text-amber-700 p-3 rounded-xl">
                    {store.cameraSystem === "analog" ? <Zap className="h-6 w-6" /> : <Router className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{powerSuggestion.type}</h3>
                      <Badge variant="secondary">{powerSuggestion.channels > 0 ? (store.cameraSystem === "analog" ? `${powerSuggestion.channels}-Channel` : `${powerSuggestion.channels}-Port`) : ""}</Badge>
                      {powerSuggestion.variant === "giga" && <Badge className="bg-amber-600 text-white">Gigabit</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{powerSuggestion.label}</p>
                    {powerSuggestion.variant === "giga" && (
                      <div className="mt-2 bg-amber-100 border border-amber-300 rounded-lg p-2">
                        <p className="text-xs text-amber-700 flex items-center gap-1"><Info className="h-3 w-3" /> Gigabit PoE switch is required because you selected cameras above 2MP which need higher bandwidth.</p>
                      </div>
                    )}
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                </CardContent>
              </Card>
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
                ? "WiFi cameras use MicroSD cards. A 64GB card gives approximately 7-10 days for 1 camera. You can also use cloud storage."
                : "Choose how many days of recording you want to keep. We will calculate the required HDD size."}
            </p>
            {store.cameraSystem === "wifi" ? (
              <Card className="border-2 border-violet-200 bg-violet-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <HardDrive className="h-5 w-5 text-violet-500" />
                  <div>
                    <p className="font-semibold text-sm">MicroSD Card Storage</p>
                    <p className="text-xs text-muted-foreground">Recommended: 64GB or 128GB MicroSD card per camera. Supports up to 7-20 days depending on recording mode.</p>
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
                {hddSize && (
                  <Card className="border-2 border-emerald-200 bg-emerald-50">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl"><HardDrive className="h-6 w-6" /></div>
                      <div className="flex-1">
                        <h3 className="font-bold">Recommended HDD: {hddSize}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          For {totalCameras} camera{totalCameras !== 1 ? "s" : ""} ({store.cameraSelections[0]?.mp || "4MP"}) with {store.retentionDays}-day retention using H.265+ compression
                        </p>
                      </div>
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                    </CardContent>
                  </Card>
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
            {store.cameraSystem === "wifi" ? (
              <Card className="border-2 border-violet-200 bg-violet-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <Wifi className="h-5 w-5 text-violet-500" />
                  <div>
                    <p className="font-semibold text-sm">No Cable Needed</p>
                    <p className="text-xs text-muted-foreground">WiFi cameras are completely wireless. Just power them with the included adapter.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Cable is auto-calculated based on {totalCameras} camera{totalCameras !== 1 ? "s" : ""}. Adjust the average cable length per camera if needed (standard: 20-30 meters).
                </p>
                <div className="flex items-center gap-4 max-w-sm">
                  <div className="flex-1">
                    <Label>Avg. Cable per Camera (meters)</Label>
                    <Input type="number" value={store.cableLengthPerCamera} onChange={(e) => store.setCableLengthPerCamera(Math.max(5, parseInt(e.target.value) || 20))} min="5" max="100" className="mt-1" />
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">Total cable needed: <strong>{totalCableMeters} meters</strong> ({totalCameras} cameras &times; {store.cableLengthPerCamera}m average)</p>
                </div>
                {store.cameraSystem === "analog" ? (
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Coaxial Cable (RG59) — Select Roll Length</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {[
                        { roll: 90, qty: cableRolls90, label: "90 meter roll" },
                        { roll: 180, qty: cableRolls180, label: "180 meter roll" },
                      ].map(opt => (
                        <Card key={opt.roll} className={cn("border-2 cursor-pointer transition-all hover:shadow-sm", "border-sky-200 hover:border-sky-400")}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-sm">{opt.label}</p>
                              <p className="text-xs text-muted-foreground">Rolls needed: <strong>{opt.qty}</strong></p>
                              <p className="text-xs text-muted-foreground">Total: {opt.qty * opt.roll}m cable</p>
                            </div>
                            <Badge className="bg-sky-100 text-sky-700 border-sky-200">{opt.qty} roll{opt.qty !== 1 ? "s" : ""}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">💡 180m rolls are more economical for larger installations (fewer joints).</p>
                  </div>
                ) : (
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Ethernet Cable (Cat6) — Select Roll Length</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {[
                        { roll: 100, qty: cableRolls100, label: "100 meter box" },
                        { roll: 305, qty: cableRolls305, label: "305 meter box" },
                      ].map(opt => (
                        <Card key={opt.roll} className={cn("border-2 cursor-pointer transition-all hover:shadow-sm", "border-emerald-200 hover:border-emerald-400")}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-sm">{opt.label}</p>
                              <p className="text-xs text-muted-foreground">Boxes needed: <strong>{opt.qty}</strong></p>
                              <p className="text-xs text-muted-foreground">Total: {opt.qty * opt.roll}m cable</p>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{opt.qty} box{opt.qty !== 1 ? "es" : ""}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">💡 305m boxes are more economical. Cat6 supports up to 10Gbps and is required for PoE+ cameras.</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        )}
      </Card>

      {/* ═══ STEP 11: ACCESSORIES ═══ */}
      <Card className={cn("border-2 transition-colors", stepActive(11) ? "border-emerald-300" : "border-muted opacity-60")}>
        <CardHeader className="pb-3">
          <StepBadge num={11} title="Accessories" active={stepActive(11)} done={stepDone(11)} />
        </CardHeader>
        {stepActive(11) && (
          <CardContent className="pt-0 space-y-5">
            {store.cameraSystem === "wifi" ? (
              <p className="text-sm text-muted-foreground">WiFi cameras include mounting hardware. Below are optional accessories you may want.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Junction boxes and connectors are auto-calculated based on your camera selections. Below are optional extras.</p>
            )}

            {/* Auto-calculated Accessories */}
            {store.cameraSystem !== "wifi" && totalCameras > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5"><Calculator className="h-3.5 w-3.5" /> Auto-Calculated (based on your {totalCameras} cameras)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {store.junctionBox4x4 > 0 && (
                    <Card className="border bg-slate-50"><CardContent className="p-3 text-center"><Box className="h-5 w-5 mx-auto text-slate-500 mb-1" /><p className="text-xs font-semibold">Junction Box 4&times;4</p><p className="text-lg font-bold text-slate-700">{store.junctionBox4x4}</p><p className="text-[10px] text-muted-foreground">For bullet cameras</p></CardContent></Card>
                  )}
                  {store.junctionBox5x5 > 0 && (
                    <Card className="border bg-slate-50"><CardContent className="p-3 text-center"><Box className="h-5 w-5 mx-auto text-slate-500 mb-1" /><p className="text-xs font-semibold">Junction Box 5&times;5</p><p className="text-lg font-bold text-slate-700">{store.junctionBox5x5}</p><p className="text-[10px] text-muted-foreground">For dome cameras</p></CardContent></Card>
                  )}
                  {store.dcConnector > 0 && (
                    <Card className="border bg-slate-50"><CardContent className="p-3 text-center"><Plug className="h-5 w-5 mx-auto text-slate-500 mb-1" /><p className="text-xs font-semibold">DC Connector</p><p className="text-lg font-bold text-slate-700">{store.dcConnector}</p><p className="text-[10px] text-muted-foreground">1 per camera</p></CardContent></Card>
                  )}
                  {store.bncConnector > 0 && (
                    <Card className="border bg-slate-50"><CardContent className="p-3 text-center"><Link className="h-5 w-5 mx-auto text-slate-500 mb-1" /><p className="text-xs font-semibold">BNC Connector</p><p className="text-lg font-bold text-slate-700">{store.bncConnector}</p><p className="text-[10px] text-muted-foreground">2 per camera</p></CardContent></Card>
                  )}
                  {store.rj45Connector > 0 && (
                    <Card className="border bg-slate-50"><CardContent className="p-3 text-center"><Link className="h-5 w-5 mx-auto text-slate-500 mb-1" /><p className="text-xs font-semibold">RJ45 Connector</p><p className="text-lg font-bold text-slate-700">{store.rj45Connector}</p><p className="text-[10px] text-muted-foreground">2 per camera</p></CardContent></Card>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Optional Accessories */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> Optional Accessories</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Networking Rack */}
                <Card className="border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Server className="h-5 w-5 text-slate-500" />
                      <div><p className="text-sm font-semibold">Networking Rack</p><p className="text-[11px] text-muted-foreground">To mount DVR/NVR, switch, UPS</p></div>
                    </div>
                    <QtyControl value={store.networkingRack} onChange={store.setNetworkingRack} max={4} />
                  </CardContent>
                </Card>
                {/* Monitor */}
                <Card className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-5 w-5 text-slate-500" />
                        <div><p className="text-sm font-semibold">Monitor</p><p className="text-[11px] text-muted-foreground">For live viewing</p></div>
                      </div>
                      <QtyControl value={store.monitor} onChange={store.setMonitor} max={4} />
                    </div>
                    {store.monitor > 0 && (
                      <div className="flex gap-2 mt-1">
                        {['21.5"', '27"', '32"', '43"'].map(size => (
                          <button key={size} onClick={() => store.setMonitorSize(size)}
                            className={cn("px-2 py-1 rounded text-xs border transition-all", store.monitorSize === size ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold" : "border-muted hover:border-emerald-300")}>
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                {/* Extension Board */}
                <Card className="border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Plug className="h-5 w-5 text-slate-500" />
                      <div><p className="text-sm font-semibold">Extension Board</p><p className="text-[11px] text-muted-foreground">Power for DVR, monitor, router</p></div>
                    </div>
                    <QtyControl value={store.extensionBoard} onChange={store.setExtensionBoard} max={4} />
                  </CardContent>
                </Card>
                {/* Wireless Mouse */}
                <Card className="border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mouse className="h-5 w-5 text-slate-500" />
                      <div><p className="text-sm font-semibold">Wireless Mouse</p><p className="text-[11px] text-muted-foreground">For DVR/NVR navigation</p></div>
                    </div>
                    <QtyControl value={store.wirelessMouse} onChange={store.setWirelessMouse} max={4} />
                  </CardContent>
                </Card>
                {/* Wireless Keyboard */}
                <Card className="border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Keyboard className="h-5 w-5 text-slate-500" />
                      <div><p className="text-sm font-semibold">Wireless Keyboard</p><p className="text-[11px] text-muted-foreground">For DVR/NVR text input</p></div>
                    </div>
                    <QtyControl value={store.wirelessKeyboard} onChange={store.setWirelessKeyboard} max={4} />
                  </CardContent>
                </Card>
                {/* UPS */}
                <Card className="border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Battery className="h-5 w-5 text-slate-500" />
                      <div><p className="text-sm font-semibold">UPS (Backup Power)</p><p className="text-[11px] text-muted-foreground">Keeps CCTV running during power cuts</p></div>
                    </div>
                    <QtyControl value={store.ups} onChange={store.setUps} max={4} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ═══ FINAL SUMMARY ═══ */}
      {totalCameras > 0 && (
        <Card className="border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-sky-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" /> Your Complete CCTV Setup Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Property Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 border text-center">
                <p className="text-[10px] text-muted-foreground uppercase">Property</p>
                <p className="font-bold text-sm mt-0.5">{propertyTypes.find(p => p.value === store.propertyType)?.label}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border text-center">
                <p className="text-[10px] text-muted-foreground uppercase">Area</p>
                <p className="font-bold text-sm mt-0.5">{area.toLocaleString()} sq ft</p>
              </div>
              <div className="bg-white rounded-lg p-3 border text-center">
                <p className="text-[10px] text-muted-foreground uppercase">System</p>
                <p className="font-bold text-sm mt-0.5 capitalize">{store.cameraSystem === "ip" ? "IP (Network)" : store.cameraSystem === "analog" ? "Analog (HD-TVI/CVI)" : "WiFi (Wireless)"}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border text-center">
                <p className="text-[10px] text-muted-foreground uppercase">Total Cameras</p>
                <p className="font-bold text-lg text-emerald-700 mt-0.5">{totalCameras}</p>
              </div>
            </div>

            <Separator />

            {/* Camera Breakdown */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Camera Breakdown</h4>
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="grid grid-cols-4 gap-0 px-3 py-2 bg-muted text-xs font-semibold uppercase text-muted-foreground">
                  <span>MP</span><span>Type</span><span>Technology</span><span className="text-right">Qty</span>
                </div>
                {[...store.cameraSelections].sort((a, b) => mpOptions.indexOf(a.mp) - mpOptions.indexOf(b.mp)).map((cam, i) => (
                  <div key={i} className="grid grid-cols-4 gap-0 px-3 py-2 border-t text-sm">
                    <span className="font-medium">{cam.mp}</span>
                    <span className="capitalize">{cam.form}</span>
                    <span className="text-xs text-muted-foreground">{cameraTechs.find(t => t.value === cam.tech)?.label?.split(" ")[0]}</span>
                    <span className="text-right font-bold">{cam.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Components List */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Complete Component List</h4>
              <div className="space-y-1.5">
                {/* Cameras */}
                {[...store.cameraSelections].sort((a, b) => mpOptions.indexOf(a.mp) - mpOptions.indexOf(b.mp)).map((cam, i) => (
                  <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-emerald-500" />
                      <span>{cam.mp} {cam.form.charAt(0).toUpperCase() + cam.form.slice(1)} Camera ({cameraTechs.find(t => t.value === cam.tech)?.label})</span>
                    </div>
                    <Badge variant="secondary">×{cam.qty}</Badge>
                  </div>
                ))}
                {/* Recorder */}
                {recorderSuggestion && recorderSuggestion.channels > 0 && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2">
                      {store.cameraSystem === "analog" ? <HardDrive className="h-4 w-4 text-sky-500" /> : <Cloud className="h-4 w-4 text-emerald-500" />}
                      <span>{recorderSuggestion.label}</span>
                    </div>
                    <Badge variant="secondary">×1</Badge>
                  </div>
                )}
                {/* Power */}
                {powerSuggestion && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2">
                      {store.cameraSystem === "analog" ? <Zap className="h-4 w-4 text-amber-500" /> : <Router className="h-4 w-4 text-amber-500" />}
                      <span>{powerSuggestion.label}</span>
                    </div>
                    <Badge variant="secondary">×1</Badge>
                  </div>
                )}
                {/* HDD */}
                {hddSize && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-slate-500" /><span>HDD ({hddSize}) — {store.retentionDays}-day retention</span></div>
                    <Badge variant="secondary">×1</Badge>
                  </div>
                )}
                {/* Cable */}
                {store.cameraSystem !== "wifi" && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2">
                      <Cable className="h-4 w-4 text-slate-500" />
                      <span>{store.cameraSystem === "analog" ? "Coaxial Cable (RG59)" : "Ethernet Cable (Cat6)"} — {totalCableMeters}m total</span>
                    </div>
                    <Badge variant="secondary">
                      {store.cameraSystem === "analog" ? `${cableRolls180} × 180m roll${cableRolls180 !== 1 ? "s" : ""}` : `${cableRolls305} × 305m box${cableRolls305 !== 1 ? "es" : ""}`}
                    </Badge>
                  </div>
                )}
                {/* Junction Boxes */}
                {store.junctionBox4x4 > 0 && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2"><Box className="h-4 w-4 text-slate-500" /><span>Junction Box 4×4 (for bullet cameras)</span></div>
                    <Badge variant="secondary">×{store.junctionBox4x4}</Badge>
                  </div>
                )}
                {store.junctionBox5x5 > 0 && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2"><Box className="h-4 w-4 text-slate-500" /><span>Junction Box 5×5 (for dome cameras)</span></div>
                    <Badge variant="secondary">×{store.junctionBox5x5}</Badge>
                  </div>
                )}
                {/* Connectors */}
                {store.dcConnector > 0 && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2"><Plug className="h-4 w-4 text-slate-500" /><span>DC Connector (1 per camera)</span></div>
                    <Badge variant="secondary">×{store.dcConnector}</Badge>
                  </div>
                )}
                {store.bncConnector > 0 && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2"><Link className="h-4 w-4 text-slate-500" /><span>BNC Connector (2 per camera)</span></div>
                    <Badge variant="secondary">×{store.bncConnector}</Badge>
                  </div>
                )}
                {store.rj45Connector > 0 && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2"><Link className="h-4 w-4 text-slate-500" /><span>RJ45 Connector (2 per camera)</span></div>
                    <Badge variant="secondary">×{store.rj45Connector}</Badge>
                  </div>
                )}
                {/* Optional Accessories */}
                {store.networkingRack > 0 && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2"><Server className="h-4 w-4 text-slate-500" /><span>Networking Rack</span></div>
                    <Badge variant="secondary">×{store.networkingRack}</Badge>
                  </div>
                )}
                {store.monitor > 0 && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2"><Monitor className="h-4 w-4 text-slate-500" /><span>Monitor ({store.monitorSize})</span></div>
                    <Badge variant="secondary">×{store.monitor}</Badge>
                  </div>
                )}
                {store.extensionBoard > 0 && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2"><Plug className="h-4 w-4 text-slate-500" /><span>Extension Board</span></div>
                    <Badge variant="secondary">×{store.extensionBoard}</Badge>
                  </div>
                )}
                {store.wirelessMouse > 0 && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2"><Mouse className="h-4 w-4 text-slate-500" /><span>Wireless Mouse</span></div>
                    <Badge variant="secondary">×{store.wirelessMouse}</Badge>
                  </div>
                )}
                {store.wirelessKeyboard > 0 && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2"><Keyboard className="h-4 w-4 text-slate-500" /><span>Wireless Keyboard</span></div>
                    <Badge variant="secondary">×{store.wirelessKeyboard}</Badge>
                  </div>
                )}
                {store.ups > 0 && (
                  <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border text-sm">
                    <div className="flex items-center gap-2"><Battery className="h-4 w-4 text-slate-500" /><span>UPS (Backup Power)</span></div>
                    <Badge variant="secondary">×{store.ups}</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => store.resetBuilder()}>
                <RotateCcw className="h-4 w-4" /> Reset All Selections
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}