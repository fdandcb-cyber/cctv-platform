"use client";

import { useState, useCallback, useEffect } from "react";
import { useStore, type CctvProduct } from "@/store/cctv-store";
import { useBuilderStore } from "@/store/builder-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Plus, Trash2, Pencil, Package, FileText, Settings,
  Camera, Shield, Clock, IndianRupee, ChevronLeft,
  ClipboardCopy, Download, Trash,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// PRODUCT FORM (Add/Edit)
// ═══════════════════════════════════════════════════════════════

function AdminForm({ editProduct, onClose }: { editProduct?: CctvProduct; onClose: () => void }) {
  const [form, setForm] = useState(
    editProduct
      ? { ...editProduct, price: String(editProduct.price), salePrice: editProduct.salePrice ? String(editProduct.salePrice) : "", videoUrl: editProduct.videoUrl || "", sampleVideoUrl: editProduct.sampleVideoUrl || "", imageUrl: editProduct.imageUrl || "" }
      : { brand: "", modelName: "", cameraType: "Bullet", resolution: "2MP", technology: "HD-TVI", recorderType: "DVR", nightVision: "", weatherRating: "", price: "", salePrice: "", description: "", features: "", imageUrl: "", videoUrl: "", sampleVideoUrl: "", irRange: "", fieldOfView: "" }
  );
  const [saving, setSaving] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.brand || !form.modelName || !form.price) { toast.error("Brand, Model, and Price are required"); return; }
    setSaving(true);
    try {
      const url = editProduct ? `/api/products/${editProduct.id}` : "/api/products";
      const method = editProduct ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        toast.success(editProduct ? "Product updated!" : "Product added!");
        onClose();
      } else toast.error(data.error || "Failed");
    } catch { toast.error("Network error"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!editProduct) return;
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${editProduct.id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { toast.success("Deleted"); onClose(); }
    else toast.error("Failed to delete");
  };

  return (
    <div className="space-y-4 max-h-[85vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Brand *</Label><Input value={form.brand} onChange={(e) => update("brand", e.target.value)} placeholder="Hikvision / Dahua" /></div>
        <div className="space-y-2"><Label>Model Number *</Label><Input value={form.modelName} onChange={(e) => update("modelName", e.target.value)} placeholder="DS-2CE56D0T-IRP" /></div>
        <div className="space-y-2"><Label>Camera Type</Label>
          <Select value={form.cameraType} onValueChange={(v) => update("cameraType", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Dome">Dome</SelectItem><SelectItem value="Bullet">Bullet</SelectItem>
              <SelectItem value="WiFi">WiFi</SelectItem><SelectItem value="PTZ">PTZ</SelectItem>
              <SelectItem value="4G">4G</SelectItem><SelectItem value="DVR">DVR</SelectItem><SelectItem value="NVR">NVR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Resolution</Label>
          <Select value={form.resolution} onValueChange={(v) => update("resolution", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1MP">1MP (720p)</SelectItem><SelectItem value="2MP">2MP (1080p)</SelectItem>
              <SelectItem value="4MP">4MP (1440p)</SelectItem><SelectItem value="5MP">5MP</SelectItem><SelectItem value="4K">4K (8MP)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Technology</Label>
          <Select value={form.technology} onValueChange={(v) => update("technology", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="HD-TVI">HD-TVI (Hikvision)</SelectItem><SelectItem value="HD-CVI">HD-CVI (Dahua)</SelectItem>
              <SelectItem value="IP">IP</SelectItem><SelectItem value="WiFi IP">WiFi IP</SelectItem>
              <SelectItem value="4G LTE">4G LTE</SelectItem><SelectItem value="AHD">AHD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Compatible Recorder</Label>
          <Select value={form.recorderType} onValueChange={(v) => update("recorderType", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="DVR">DVR</SelectItem><SelectItem value="NVR">NVR</SelectItem>
              <SelectItem value="Cloud/NVR">Cloud / NVR</SelectItem><SelectItem value="Cloud/SD Card">Cloud / SD Card</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Price (INR) *</Label><Input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="1500" /></div>
        <div className="space-y-2"><Label>Sale Price (INR)</Label><Input type="number" value={form.salePrice} onChange={(e) => update("salePrice", e.target.value)} placeholder="1299 (optional)" /></div>
        <div className="space-y-2"><Label>Night Vision</Label><Input value={form.nightVision} onChange={(e) => update("nightVision", e.target.value)} placeholder="IR (20m) / ColorVu / Starlight" /></div>
        <div className="space-y-2"><Label>Weather Rating</Label><Input value={form.weatherRating} onChange={(e) => update("weatherRating", e.target.value)} placeholder="IP67 / IP66 / Indoor" /></div>
        <div className="space-y-2"><Label>IR Range</Label><Input value={form.irRange} onChange={(e) => update("irRange", e.target.value)} placeholder="20m / 50m" /></div>
        <div className="space-y-2"><Label>Field of View</Label><Input value={form.fieldOfView} onChange={(e) => update("fieldOfView", e.target.value)} placeholder="90 degrees / 360 degrees" /></div>
      </div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} placeholder="Product description..." /></div>
      <div className="space-y-2"><Label>Features (comma separated)</Label><Textarea value={form.features} onChange={(e) => update("features", e.target.value)} rows={2} placeholder="2MP, IR 20m, IP67, Smart IR" /></div>
      <div className="space-y-2">
        <Label>Product Image URL</Label>
        <Input value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="/uploads/image.jpg or external URL" />
        {form.imageUrl && <img src={form.imageUrl} alt="preview" className="w-24 h-24 object-contain rounded border bg-muted mt-1" />}
      </div>
      <div className="space-y-2">
        <Label>Sample Video URL (YouTube embed)</Label>
        <Input value={form.sampleVideoUrl} onChange={(e) => update("sampleVideoUrl", e.target.value)} placeholder="https://www.youtube.com/embed/..." />
      </div>
      <div className="flex gap-2 pt-2">
        <Button onClick={handleSubmit} disabled={saving} className="flex-1">{saving ? "Saving..." : editProduct ? "Update Product" : "Add Product"}</Button>
        {editProduct && <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4" /></Button>}
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SAVED QUOTES MANAGEMENT
// ═══════════════════════════════════════════════════════════════

interface SavedQuote {
  id: string;
  name: string;
  date: string;
  data: string; // JSON string of builder state
  summary: string;
}

function QuotesTab() {
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [loadedQuote, setLoadedQuote] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cctv_saved_quotes");
      if (stored) setQuotes(JSON.parse(stored));
    } catch { /* empty */ }
  }, []);

  const saveQuote = () => {
    const state = useBuilderStore.getState();
    const totalCams = state.cameraSelections.reduce((s, c) => s + c.qty, 0);
    if (totalCams === 0) {
      toast.error("No cameras configured. Build a setup first!");
      return;
    }
    const name = prompt("Quote name (e.g., Customer Name - Site):") || "Untitled Quote";
    const quote: SavedQuote = {
      id: Date.now().toString(),
      name,
      date: new Date().toLocaleDateString("en-IN"),
      data: JSON.stringify({
        propertyType: state.propertyType,
        areaSqft: state.areaSqft,
        cameraSystem: state.cameraSystem,
        cameraTechs: state.cameraTechs,
        cameraSelections: state.cameraSelections,
        recorderUnits: state.recorderUnits,
        powerUnits: state.powerUnits,
        retentionDays: state.retentionDays,
        hddSuggestion: state.hddSuggestion,
        cableLengthPerCamera: state.cableLengthPerCamera,
        cableSelection: state.cableSelection,
        junctionBox4x4: state.junctionBox4x4,
        junctionBox5x5: state.junctionBox5x5,
        dcConnector: state.dcConnector,
        bncConnector: state.bncConnector,
        rj45Connector: state.rj45Connector,
        networkingRack: state.networkingRack,
        monitor: state.monitor,
        monitorSize: state.monitorSize,
        extensionBoard: state.extensionBoard,
        wirelessMouse: state.wirelessMouse,
        wirelessKeyboard: state.wirelessKeyboard,
        ups: state.ups,
      }),
      summary: `${totalCams} cameras | ${state.cameraSystem.toUpperCase()} | ${state.areaSqft} sq ft`,
    };
    const updated = [quote, ...quotes];
    setQuotes(updated);
    localStorage.setItem("cctv_saved_quotes", JSON.stringify(updated));
    toast.success("Quote saved!");
  };

  const deleteQuote = (id: string) => {
    if (!confirm("Delete this saved quote?")) return;
    const updated = quotes.filter(q => q.id !== id);
    setQuotes(updated);
    localStorage.setItem("cctv_saved_quotes", JSON.stringify(updated));
    toast.success("Quote deleted");
  };

  const loadQuote = (quote: SavedQuote) => {
    try {
      const data = JSON.parse(quote.data);
      const store = useBuilderStore.getState();
      Object.keys(data).forEach((key) => {
        const actionKey = "set" + key.charAt(0).toUpperCase() + key.slice(1) as keyof typeof store;
        if (typeof store[actionKey] === "function") {
          (store[actionKey] as (v: unknown) => void)(data[key]);
        }
      });
      setLoadedQuote(quote.id);
      toast.success("Quote loaded! Go to Builder tab to view.");
      setTimeout(() => setLoadedQuote(null), 3000);
    } catch {
      toast.error("Failed to load quote");
    }
  };

  const copyQuoteText = (quote: SavedQuote) => {
    try {
      const data = JSON.parse(quote.data);
      const lines: string[] = [];
      lines.push("=== CCTV QUOTE ===");
      lines.push("Name: " + quote.name);
      lines.push("Date: " + quote.date);
      lines.push("Property: " + data.propertyType);
      lines.push("Area: " + data.areaSqft + " sq ft");
      lines.push("System: " + (data.cameraSystem || "").toUpperCase());
      lines.push("");
      if (data.cameraSelections) {
        lines.push("--- CAMERAS ---");
        let total = 0;
        for (const cam of data.cameraSelections) {
          lines.push(cam.qty + "x " + cam.mp + " " + cam.form);
          total += cam.qty;
        }
        lines.push("Total: " + total + " cameras");
      }
      if (data.recorderUnits && data.recorderUnits.length > 0) {
        lines.push("");
        lines.push("--- RECORDER ---");
        for (const u of data.recorderUnits) {
          lines.push(u.channels + "-Channel " + u.type + " (" + u.usedPorts + " used)");
        }
      }
      if (data.powerUnits && data.powerUnits.length > 0) {
        lines.push("");
        lines.push("--- POWER ---");
        for (const u of data.powerUnits) {
          lines.push(u.ports + "-" + (u.type.includes("SMPS") ? "Channel SMPS" : "Port PoE") + " (" + u.usedPorts + " used)");
        }
      }
      if (data.hddSuggestion) {
        lines.push("");
        lines.push("--- STORAGE ---");
        lines.push("HDD: " + data.hddSuggestion);
        lines.push("Retention: " + data.retentionDays + " days");
      }
      lines.push("");
      lines.push("--- ACCESSORIES ---");
      if (data.junctionBox4x4 > 0) lines.push("Junction Box 4x4: " + data.junctionBox4x4);
      if (data.junctionBox5x5 > 0) lines.push("Junction Box 5x5: " + data.junctionBox5x5);
      if (data.dcConnector > 0) lines.push("DC Connector: " + data.dcConnector);
      if (data.bncConnector > 0) lines.push("BNC Connector: " + data.bncConnector);
      if (data.rj45Connector > 0) lines.push("RJ45 Connector: " + data.rj45Connector);
      if (data.networkingRack > 0) lines.push("Networking Rack: " + data.networkingRack);
      if (data.monitor > 0) lines.push("Monitor: " + data.monitor + "x " + data.monitorSize);
      if (data.extensionBoard > 0) lines.push("Extension Board: " + data.extensionBoard);
      if (data.wirelessMouse > 0) lines.push("Wireless Mouse: " + data.wirelessMouse);
      if (data.ups > 0) lines.push("UPS: " + data.ups);

      navigator.clipboard.writeText(lines.join("\n")).then(() => toast.success("Quote copied!")).catch(() => toast.error("Copy failed"));
    } catch { toast.error("Failed to read quote data"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Saved Quotes</h3>
          <p className="text-xs text-muted-foreground">Save and manage CCTV configuration quotes. Quotes are stored in your browser.</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={saveQuote}>
          <Download className="h-3.5 w-3.5" /> Save Current Config
        </Button>
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No saved quotes yet. Configure a setup in the Builder tab, then save it here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {quotes.map((q) => (
            <div key={q.id} className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
              loadedQuote === q.id ? "border-emerald-400 bg-emerald-50" : "border-muted hover:border-emerald-300"
            )}>
              <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-lg shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{q.name}</p>
                <p className="text-xs text-muted-foreground">{q.summary}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {q.date}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button size="sm" variant="outline" className="gap-1 text-xs h-8" onClick={() => loadQuote(q)}>
                  <Download className="h-3 w-3" /> Load
                </Button>
                <Button size="sm" variant="outline" className="gap-1 text-xs h-8" onClick={() => copyQuoteText(q)}>
                  <ClipboardCopy className="h-3 w-3" /> Copy
                </Button>
                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600 h-8 w-8 p-0" onClick={() => deleteQuote(q.id)}>
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS TAB
// ═══════════════════════════════════════════════════════════════

function SettingsTab() {
  const [companyName, setCompanyName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [defaultRetention, setDefaultRetention] = useState("15");
  const [defaultCableLength, setDefaultCableLength] = useState("25");

  useEffect(() => {
    try {
      const s = localStorage.getItem("cctv_admin_settings");
      if (s) {
        const d = JSON.parse(s);
        setCompanyName(d.companyName || "");
        setCompanyPhone(d.companyPhone || "");
        setCompanyAddress(d.companyAddress || "");
        setDefaultRetention(d.defaultRetention || "15");
        setDefaultCableLength(d.defaultCableLength || "25");
      }
    } catch { /* empty */ }
  }, []);

  const saveSettings = () => {
    const settings = { companyName, companyPhone, companyAddress, defaultRetention, defaultCableLength };
    localStorage.setItem("cctv_admin_settings", JSON.stringify(settings));
    toast.success("Settings saved!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-1">Company Information</h3>
        <p className="text-xs text-muted-foreground mb-4">This info appears on printed quotes and invoices.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your Company Name" />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="+91 98765 43210" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Address</Label>
            <Textarea value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} rows={2} placeholder="Shop No. X, Area, City, State - PIN" />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-1">Builder Defaults</h3>
        <p className="text-xs text-muted-foreground mb-4">Default values used when creating new configurations.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Default Retention (days)</Label>
            <Select value={defaultRetention} onValueChange={setDefaultRetention}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="10">10 days</SelectItem>
                <SelectItem value="15">15 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="45">45 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Default Cable Length (meters/camera)</Label>
            <Input type="number" value={defaultCableLength} onChange={(e) => setDefaultCableLength(e.target.value)} placeholder="25" min="1" max="300" />
          </div>
        </div>
      </div>

      <Button onClick={saveSettings}>Save Settings</Button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SEED SAMPLE DATA BUTTON
// ═══════════════════════════════════════════════════════════════

const SEED_PRODUCTS = [
  // ANALOG - Hikvision HD-TVI
  { brand: "Hikvision", modelName: "DS-2CE56D0T-IRP", cameraType: "Bullet", resolution: "2MP", technology: "HD-TVI", recorderType: "DVR", nightVision: "IR (20m)", weatherRating: "IP67", price: "1499", salePrice: "1299", description: "2MP HD-TVI bullet camera with IR night vision, 20m range, IP67 weatherproof.", features: "2MP, IR 20m, IP67, Smart IR, HD-TVI", imageUrl: "/cctv-guide-images/bullet-camera.png", irRange: "20m", fieldOfView: "90 degrees" },
  { brand: "Hikvision", modelName: "DS-2CE5AD0T-IRP", cameraType: "Dome", resolution: "2MP", technology: "HD-TVI", recorderType: "DVR", nightVision: "IR (20m)", weatherRating: "IP67", price: "1399", salePrice: "1199", description: "2MP HD-TVI dome camera with IR night vision, vandal-proof, IP67.", features: "2MP, IR 20m, IP67, Vandal-proof, HD-TVI", imageUrl: "/cctv-guide-images/dome-camera.png", irRange: "20m", fieldOfView: "100 degrees" },
  { brand: "Hikvision", modelName: "DS-2CE56D5T-IRP", cameraType: "Bullet", resolution: "4MP", technology: "HD-TVI", recorderType: "DVR", nightVision: "IR (30m)", weatherRating: "IP67", price: "2199", salePrice: "", description: "4MP HD-TVI bullet camera with 30m IR range, IP67 weatherproof.", features: "4MP, IR 30m, IP67, Smart IR, HD-TVI", imageUrl: "/cctv-guide-images/bullet-camera.png", irRange: "30m", fieldOfView: "87 degrees" },
  { brand: "Hikvision", modelName: "DS-2CE7AD3T-IRP", cameraType: "Dome", resolution: "4MP", technology: "HD-TVI", recorderType: "DVR", nightVision: "IR (30m)", weatherRating: "IP67", price: "2499", salePrice: "", description: "4MP HD-TVI dome camera with 30m IR, vandal-proof housing.", features: "4MP, IR 30m, IP67, Vandal-proof, HD-TVI", imageUrl: "/cctv-guide-images/dome-camera.png", irRange: "30m", fieldOfView: "100 degrees" },
  // ANALOG - Dahua HD-CVI
  { brand: "Dahua", modelName: "HFW-B2421T-ZAS", cameraType: "Bullet", resolution: "2MP", technology: "HD-CVI", recorderType: "DVR", nightVision: "IR (30m)", weatherRating: "IP67", price: "1350", salePrice: "1150", description: "2MP HD-CVI bullet with 30m IR, IP67, built-in mic.", features: "2MP, IR 30m, IP67, Built-in Mic, HD-CVI", imageUrl: "/cctv-guide-images/bullet-camera.png", irRange: "30m", fieldOfView: "90 degrees" },
  { brand: "Dahua", modelName: "HDBW-2421R-ZAS", cameraType: "Dome", resolution: "2MP", technology: "HD-CVI", recorderType: "DVR", nightVision: "IR (30m)", weatherRating: "IP67", price: "1450", salePrice: "", description: "2MP HD-CVI dome with 30m IR, vandal-proof, built-in mic.", features: "2MP, IR 30m, IP67, Vandal-proof, HD-CVI", imageUrl: "/cctv-guide-images/dome-camera.png", irRange: "30m", fieldOfView: "100 degrees" },
  // IP - Hikvision
  { brand: "Hikvision", modelName: "DS-2CD2143G2-I", cameraType: "Bullet", resolution: "4MP", technology: "IP", recorderType: "NVR", nightVision: "ColorVu (30m)", weatherRating: "IP67", price: "3999", salePrice: "3499", description: "4MP IP bullet with ColorVu technology, full color night vision, IP67.", features: "4MP, ColorVu, IP67, PoE, AcuSense, H.265+", imageUrl: "/cctv-guide-images/bullet-camera.png", irRange: "30m", fieldOfView: "87 degrees" },
  { brand: "Hikvision", modelName: "DS-2CD2343G2-I", cameraType: "Dome", resolution: "4MP", technology: "IP", recorderType: "NVR", nightVision: "ColorVu (30m)", weatherRating: "IP67", price: "4299", salePrice: "", description: "4MP IP dome with ColorVu, vandal-proof, built-in mic.", features: "4MP, ColorVu, IP67, Vandal-proof, PoE, H.265+", imageUrl: "/cctv-guide-images/dome-camera.png", irRange: "30m", fieldOfView: "100 degrees" },
  { brand: "Hikvision", modelName: "DS-2CD2T86G2-4", cameraType: "Bullet", resolution: "4K", technology: "IP", recorderType: "NVR", nightVision: "IR (40m)", weatherRating: "IP67", price: "7999", salePrice: "6999", description: "8MP (4K) IP bullet with 40m IR, AcuSense AI, IP67.", features: "4K 8MP, IR 40m, IP67, AcuSense AI, PoE, H.265+", imageUrl: "/cctv-guide-images/bullet-camera.png", irRange: "40m", fieldOfView: "97 degrees" },
  { brand: "Hikvision", modelName: "DS-2CD2T87G2-4", cameraType: "Dome", resolution: "4K", technology: "IP", recorderType: "NVR", nightVision: "IR (40m)", weatherRating: "IP67", price: "8499", salePrice: "", description: "8MP (4K) IP dome with 40m IR, AcuSense AI, vandal-proof.", features: "4K 8MP, IR 40m, IP67, AcuSense AI, PoE, H.265+", imageUrl: "/cctv-guide-images/dome-camera.png", irRange: "40m", fieldOfView: "105 degrees" },
  { brand: "Hikvision", modelName: "DS-2DE4A425IW-DE", cameraType: "PTZ", resolution: "4MP", technology: "IP", recorderType: "NVR", nightVision: "IR (150m)", weatherRating: "IP67", price: "35000", salePrice: "", description: "4MP IP PTZ with 25x zoom, 150m IR, auto-tracking, IP67.", features: "4MP, 25x Zoom, IR 150m, Auto-Tracking, PoE, IP67", imageUrl: "/cctv-guide-images/ptz-camera.png", irRange: "150m", fieldOfView: "360 degrees" },
  // IP - Dahua
  { brand: "Dahua", modelName: "IPC-HFW2831T-ZAS-S2", cameraType: "Bullet", resolution: "4K", technology: "IP", recorderType: "NVR", nightVision: "IR (50m)", weatherRating: "IP67", price: "6999", salePrice: "5999", description: "8MP (4K) IP bullet with 50m IR, SMD 4.0 AI, IP67.", features: "4K 8MP, IR 50m, IP67, SMD 4.0 AI, PoE, H.265+", imageUrl: "/cctv-guide-images/bullet-camera.png", irRange: "50m", fieldOfView: "100 degrees" },
  { brand: "Dahua", modelName: "IPC-HDBW2831E-S-S2", cameraType: "Dome", resolution: "4K", technology: "IP", recorderType: "NVR", nightVision: "IR (40m)", weatherRating: "IP67", price: "7499", salePrice: "", description: "8MP (4K) IP dome with 40m IR, SMD 4.0 AI, vandal-proof.", features: "4K 8MP, IR 40m, IP67, SMD 4.0 AI, PoE, H.265+", imageUrl: "/cctv-guide-images/dome-camera.png", irRange: "40m", fieldOfView: "105 degrees" },
  // WiFi
  { brand: "TP-Link", modelName: "Tapo C200", cameraType: "WiFi", resolution: "2MP", technology: "WiFi IP", recorderType: "Cloud/SD Card", nightVision: "IR (9m)", weatherRating: "Indoor", price: "2999", salePrice: "2499", description: "2MP WiFi indoor camera with IR night vision, two-way audio, SD card slot.", features: "2MP, WiFi, IR 9m, Two-Way Audio, SD Card, Motion Detection", imageUrl: "/cctv-guide-images/wifi-camera.png", irRange: "9m", fieldOfView: "110 degrees" },
  { brand: "TP-Link", modelName: "Tapo C320WS", cameraType: "WiFi", resolution: "2MP", technology: "WiFi IP", recorderType: "Cloud/SD Card", nightVision: "Color (30m)", weatherRating: "IP66", price: "4999", salePrice: "", description: "2MP WiFi outdoor camera with color night vision, spotlights, IP66.", features: "2MP, WiFi, Color Night, Spotlights, IP66, SD Card", imageUrl: "/cctv-guide-images/wifi-camera.png", irRange: "30m", fieldOfView: "120 degrees" },
  // DVR / NVR recorders
  { brand: "Hikvision", modelName: "DS-7204HGHI-F1", cameraType: "DVR", resolution: "4MP", technology: "HD-TVI", recorderType: "DVR", nightVision: "", weatherRating: "", price: "4999", salePrice: "4499", description: "4-channel 4MP HD-TVI DVR with H.265+, 1 SATA, HDMI output.", features: "4CH, 4MP, HD-TVI, H.265+, 1x SATA, HDMI", imageUrl: "", irRange: "", fieldOfView: "" },
  { brand: "Hikvision", modelName: "DS-7216HGHI-F2", cameraType: "DVR", resolution: "4MP", technology: "HD-TVI", recorderType: "DVR", nightVision: "", weatherRating: "", price: "8999", salePrice: "", description: "16-channel 4MP HD-TVI DVR with H.265+, 2 SATA, HDMI.", features: "16CH, 4MP, HD-TVI, H.265+, 2x SATA, HDMI", imageUrl: "", irRange: "", fieldOfView: "" },
  { brand: "Hikvision", modelName: "DS-7608NI-K2", cameraType: "NVR", resolution: "4K", technology: "IP", recorderType: "NVR", nightVision: "", weatherRating: "", price: "7999", salePrice: "6999", description: "8-channel 4K NVR with PoE (4 ports), 2 SATA, H.265+.", features: "8CH, 4K, PoE 4-port, H.265+, 2x SATA", imageUrl: "", irRange: "", fieldOfView: "" },
  { brand: "Hikvision", modelName: "DS-7616NI-K2", cameraType: "NVR", resolution: "4K", technology: "IP", recorderType: "NVR", nightVision: "", weatherRating: "", price: "12999", salePrice: "", description: "16-channel 4K NVR with PoE (8 ports), 2 SATA, H.265+.", features: "16CH, 4K, PoE 8-port, H.265+, 2x SATA", imageUrl: "", irRange: "", fieldOfView: "" },
  { brand: "Dahua", modelName: "XVR5108HS-4KL", cameraType: "DVR", resolution: "4K", technology: "HD-CVI", recorderType: "DVR", nightVision: "", weatherRating: "", price: "6999", salePrice: "", description: "8-channel 4K HD-CVI DVR with AI coding, 1 SATA, HDMI.", features: "8CH, 4K, HD-CVI/AHD/TVI/CVI, H.265+, 1x SATA", imageUrl: "", irRange: "", fieldOfView: "" },
];

function SeedDataButton({ onDone }: { onDone: () => void }) {
  const [seeding, setSeeding] = useState(false);
  const handleSeed = async () => {
    if (!confirm("This will add 20 sample CCTV products (cameras, DVRs, NVRs) to the database. Continue?")) return;
    setSeeding(true);
    try {
      for (const p of SEED_PRODUCTS) {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        });
      }
      toast.success("20 sample products added successfully!");
      onDone();
    } catch {
      toast.error("Failed to seed data");
    }
    setSeeding(false);
  };
  return (
    <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={handleSeed} disabled={seeding}>
      <Package className="h-3.5 w-3.5" /> {seeding ? "Adding..." : "Seed Sample Data"}
    </Button>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ═══════════════════════════════════════════════════════════════

export function AdminPanel({ onBack }: { onBack: () => void }) {
  const { products, setProducts } = useStore();
  const [editing, setEditing] = useState<CctvProduct | undefined>();
  const [adding, setAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const refresh = useCallback(async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    if (data.success) setProducts(data.data);
  }, [setProducts]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleDialogClose = () => { setEditing(undefined); setAdding(false); refresh(); };

  // Filter products for admin table
  const filteredProducts = products.filter(p => {
    if (typeFilter !== "all" && p.cameraType !== typeFilter) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return p.brand.toLowerCase().includes(s) || p.modelName.toLowerCase().includes(s);
    }
    return true;
  });

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  // Stats
  const totalProducts = products.length;
  const totalBrands = [...new Set(products.map(p => p.brand))].length;
  const onSale = products.filter(p => p.salePrice && p.salePrice < p.price).length;
  const avgPrice = totalProducts > 0 ? Math.round(products.reduce((s, p) => s + p.price, 0) / totalProducts) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2"><Shield className="h-5 w-5 text-emerald-600" /> Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Manage products, quotes, and settings</p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg"><Package className="h-5 w-5" /></div>
            <div><p className="text-2xl font-bold">{totalProducts}</p><p className="text-xs text-muted-foreground">Products</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 text-amber-700 p-2 rounded-lg"><Camera className="h-5 w-5" /></div>
            <div><p className="text-2xl font-bold">{totalBrands}</p><p className="text-xs text-muted-foreground">Brands</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 text-red-700 p-2 rounded-lg"><Trash2 className="h-5 w-5" /></div>
            <div><p className="text-2xl font-bold">{onSale}</p><p className="text-xs text-muted-foreground">On Sale</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-sky-100 text-sky-700 p-2 rounded-lg"><IndianRupee className="h-5 w-5" /></div>
            <div><p className="text-2xl font-bold">{fmt(avgPrice)}</p><p className="text-xs text-muted-foreground">Avg Price</p></div>
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="products">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="products" className="gap-1.5 text-xs"><Package className="h-3.5 w-3.5" /> Products</TabsTrigger>
            <TabsTrigger value="quotes" className="gap-1.5 text-xs"><FileText className="h-3.5 w-3.5" /> Quotes</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5 text-xs"><Settings className="h-3.5 w-3.5" /> Settings</TabsTrigger>
          </TabsList>
          <SeedDataButton onDone={refresh} />
        </div>

        {/* ─── PRODUCTS TAB ─── */}
        <TabsContent value="products" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." className="w-60 pl-9 h-9 text-sm" />
                <Camera className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32 h-9 text-sm"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Dome">Dome</SelectItem>
                  <SelectItem value="Bullet">Bullet</SelectItem>
                  <SelectItem value="WiFi">WiFi</SelectItem>
                  <SelectItem value="PTZ">PTZ</SelectItem>
                  <SelectItem value="4G">4G</SelectItem>
                  <SelectItem value="DVR">DVR</SelectItem>
                  <SelectItem value="NVR">NVR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={adding} onOpenChange={setAdding}>
              <DialogTrigger asChild><Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Product</Button></DialogTrigger>
              <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader><AdminForm onClose={handleDialogClose} /></DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-xl overflow-hidden">
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0 z-10">
                  <tr>
                    <th className="p-3 text-left text-xs font-semibold">Image</th>
                    <th className="p-3 text-left text-xs font-semibold">Brand</th>
                    <th className="p-3 text-left text-xs font-semibold">Model</th>
                    <th className="p-3 text-left text-xs font-semibold">Type</th>
                    <th className="p-3 text-left text-xs font-semibold">Resolution</th>
                    <th className="p-3 text-right text-xs font-semibold">Price</th>
                    <th className="p-3 text-right text-xs font-semibold">Sale</th>
                    <th className="p-3 text-center text-xs font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-muted/50 transition-colors">
                      <td className="p-2">
                        <img src={p.imageUrl} alt="" className="w-14 h-11 object-contain bg-muted rounded border" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </td>
                      <td className="p-3 font-medium">{p.brand}</td>
                      <td className="p-3 text-xs font-mono">{p.modelName}</td>
                      <td className="p-3"><Badge variant="secondary" className="text-[11px]">{p.cameraType}</Badge></td>
                      <td className="p-3 text-xs">{p.resolution}</td>
                      <td className="p-3 text-right font-medium">{fmt(p.price)}</td>
                      <td className="p-3 text-right">
                        {p.salePrice ? (
                          <div>
                            <span className="text-emerald-600 font-medium">{fmt(p.salePrice)}</span>
                            <span className="text-[10px] text-muted-foreground line-through ml-1">{fmt(p.price)}</span>
                          </div>
                        ) : <span className="text-muted-foreground">-</span>}
                      </td>
                      <td className="p-3 text-center">
                        <Dialog open={editing?.id === p.id} onOpenChange={(open) => { if (open) setEditing(p); else setEditing(undefined); }}>
                          <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-8 gap-1 text-xs"><Pencil className="h-3 w-3" /> Edit</Button></DialogTrigger>
                          <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader><AdminForm editProduct={p} onClose={handleDialogClose} /></DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No products found</p>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Showing {filteredProducts.length} of {products.length} products</p>
        </TabsContent>

        {/* ─── QUOTES TAB ─── */}
        <TabsContent value="quotes" className="mt-4">
          <QuotesTab />
        </TabsContent>

        {/* ─── SETTINGS TAB ─── */}
        <TabsContent value="settings" className="mt-4">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}