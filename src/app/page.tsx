"use client";

import { useEffect, useCallback, useState } from "react";
import { useStore, type CctvProduct } from "@/store/cctv-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LearningSystem } from "@/components/learning-system";
import { CctvBuilder } from "@/components/cctv-builder";
import {
  Search, Plus, Shield, Eye, GitCompareArrows, Trash2, X,
  Camera, Wifi, Radio, Signal, MonitorPlay, ChevronLeft,
  Tag, DollarSign, Zap, Droplets, Wind, Video, CheckCircle2, Star,
  GraduationCap, Wrench,
} from "lucide-react";
import { toast } from "sonner";

// ─── Camera type icons/colors ───
const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Dome: { icon: <Camera className="h-4 w-4" />, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  Bullet: { icon: <Camera className="h-4 w-4" />, color: "text-sky-700", bg: "bg-sky-50 border-sky-200" },
  WiFi: { icon: <Wifi className="h-4 w-4" />, color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  PTZ: { icon: <Radio className="h-4 w-4" />, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  "4G": { icon: <Signal className="h-4 w-4" />, color: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
  DVR: { icon: <MonitorPlay className="h-4 w-4" />, color: "text-slate-700", bg: "bg-slate-50 border-slate-200" },
  NVR: { icon: <MonitorPlay className="h-4 w-4" />, color: "text-slate-700", bg: "bg-slate-50 border-slate-200" },
};

// ─── Price formatter ───
function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function DiscountBadge({ sale, price }: { sale: number | null; price: number }) {
  if (!sale || sale >= price) return null;
  const pct = Math.round(((price - sale) / price) * 100);
  return <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold">-{pct}%</Badge>;
}

// ═══════════════════════════════════════════
// Product Card
// ═══════════════════════════════════════════
function ProductCard({ p }: { p: CctvProduct }) {
  const { selectedProduct: sel, setSelectedProduct, toggleCompare, compareList } = useStore();
  const isCompared = compareList.some((c) => c.id === p.id);
  const cfg = typeConfig[p.cameraType] || typeConfig.Bullet;

  return (
    <Card className="group overflow-hidden border hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      <div className="relative aspect-[4/3] bg-muted overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(p)}>
        <img
          src={p.imageUrl}
          alt={`${p.brand} ${p.modelName}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = "/logo.svg"; }}
        />
        <DiscountBadge sale={p.salePrice} price={p.price} />
        <Badge variant="outline" className={`absolute top-2 left-2 ${cfg.bg} ${cfg.color} border gap-1 text-xs`}>
          {cfg.icon} {p.cameraType}
        </Badge>
        {p.sampleVideoUrl && (
          <Badge className="absolute bottom-2 left-2 bg-black/70 text-white text-xs gap-1">
            <Video className="h-3 w-3" /> Sample Video
          </Badge>
        )}
      </div>
      <CardContent className="p-4 flex-1 flex flex-col gap-2" onClick={() => setSelectedProduct(p)}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{p.brand}</p>
            <h3 className="font-semibold text-sm leading-tight mt-0.5">{p.modelName}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{p.resolution}</Badge>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{p.technology}</Badge>
          {p.weatherRating !== "N/A" && p.weatherRating !== "Indoor" && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{p.weatherRating}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="font-bold text-base">{fmt(p.salePrice ?? p.price)}</span>
          {p.salePrice && p.salePrice < p.price && (
            <span className="text-xs text-muted-foreground line-through">{fmt(p.price)}</span>
          )}
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant={isCompared ? "default" : "outline"} className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); toggleCompare(p); }}>
            <GitCompareArrows className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// ═══════════════════════════════════════════
// Product Detail View
// ═══════════════════════════════════════════
function ProductDetail({ product, onBack }: { product: CctvProduct; onBack: () => void }) {
  const { toggleCompare, compareList } = useStore();
  const isCompared = compareList.some((c) => c.id === product.id);
  const cfg = typeConfig[product.cameraType] || typeConfig.Bullet;
  const featureList = product.features.split(",").map((f) => f.trim()).filter(Boolean);
  const specs = [
    { label: "Brand", value: product.brand },
    { label: "Model", value: product.modelName },
    { label: "Type", value: product.cameraType },
    { label: "Resolution", value: product.resolution },
    { label: "Technology", value: product.technology },
    { label: "Recorder", value: product.recorderType },
    { label: "Night Vision", value: product.nightVision },
    { label: "IR Range", value: product.irRange },
    { label: "Field of View", value: product.fieldOfView },
    { label: "Weather Rating", value: product.weatherRating },
  ];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
        <ChevronLeft className="h-4 w-4" /> Back to Catalog
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-muted border">
            <img src={product.imageUrl} alt={product.modelName} className="w-full h-full object-contain p-4"
              onError={(e) => { (e.target as HTMLImageElement).src = "/logo.svg"; }} />
          </div>
          {product.sampleVideoUrl && (
            <div className="aspect-video rounded-xl overflow-hidden bg-muted border">
              <iframe src={product.sampleVideoUrl} className="w-full h-full" allowFullScreen title="Sample video" />
            </div>
          )}
        </div>
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={`${cfg.bg} ${cfg.color} border gap-1`}>{cfg.icon} {product.cameraType}</Badge>
              <Badge variant="secondary">{product.resolution}</Badge>
              <Badge variant="secondary">{product.technology}</Badge>
            </div>
            <h1 className="text-2xl font-bold">{product.brand} {product.modelName}</h1>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-emerald-600">{fmt(product.salePrice ?? product.price)}</span>
            {product.salePrice && product.salePrice < product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">{fmt(product.price)}</span>
                <Badge className="bg-red-500 text-white">Save {fmt(product.price - product.salePrice)}</Badge>
              </>
            )}
          </div>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          <Separator />
          <div>
            <h3 className="font-semibold mb-3">Key Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {featureList.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{f}</div>
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-3">Specifications</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between py-1 border-b border-muted">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
          <Button className="w-full" size="lg" variant={isCompared ? "secondary" : "default"} onClick={() => toggleCompare(product)}>
            <GitCompareArrows className="h-4 w-4 mr-2" />
            {isCompared ? "Remove from Compare" : "Add to Compare"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Compare View
// ═══════════════════════════════════════════
function CompareView() {
  const { compareList, clearCompare, setView, setSelectedProduct } = useStore();
  if (compareList.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <GitCompareArrows className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="text-xl font-semibold">No products to compare</h2>
        <p className="text-muted-foreground">Add products using the compare button on product cards.</p>
        <Button onClick={() => setView("catalog")}>Browse Catalog</Button>
      </div>
    );
  }
  const rows = [
    { label: "Image", fn: (p: CctvProduct) => <img src={p.imageUrl} alt={p.modelName} className="w-full max-w-[140px] h-24 object-contain mx-auto" onError={(e) => { (e.target as HTMLImageElement).src = "/logo.svg"; }} /> },
    { label: "Brand", fn: (p: CctvProduct) => <Badge variant="outline">{p.brand}</Badge> },
    { label: "Model", fn: (p: CctvProduct) => <span className="font-semibold text-sm">{p.modelName}</span> },
    { label: "Type", fn: (p: CctvProduct) => <Badge variant="secondary">{p.cameraType}</Badge> },
    { label: "Resolution", fn: (p: CctvProduct) => p.resolution },
    { label: "Technology", fn: (p: CctvProduct) => p.technology },
    { label: "Recorder", fn: (p: CctvProduct) => p.recorderType },
    { label: "Night Vision", fn: (p: CctvProduct) => p.nightVision },
    { label: "IR Range", fn: (p: CctvProduct) => p.irRange || "-" },
    { label: "Field of View", fn: (p: CctvProduct) => p.fieldOfView || "-" },
    { label: "Weather", fn: (p: CctvProduct) => p.weatherRating },
    { label: "Price", fn: (p: CctvProduct) => <span className="font-bold">{fmt(p.price)}</span> },
    { label: "Sale Price", fn: (p: CctvProduct) => p.salePrice ? <span className="font-bold text-emerald-600">{fmt(p.salePrice)}</span> : "-" },
    { label: "Video", fn: (p: CctvProduct) => p.sampleVideoUrl ? <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 gap-1"><Video className="h-3 w-3" /> Available</Badge> : <span className="text-muted-foreground text-sm">None</span> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Compare Products ({compareList.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearCompare}>Clear All</Button>
          <Button variant="outline" size="sm" onClick={() => setView("catalog")}>Back to Catalog</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-3 w-28 bg-muted rounded-tl-lg sticky left-0 z-10">Feature</th>
              {compareList.map((p) => (
                <th key={p.id} className="p-3 text-center bg-muted min-w-[180px]">
                  <div className="relative">
                    <button onClick={() => setSelectedProduct(p)} className="font-semibold hover:underline cursor-pointer">{p.brand}</button>
                    <button onClick={() => setSelectedProduct(p)} className="block text-xs text-muted-foreground hover:underline cursor-pointer">{p.modelName}</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                <td className="p-3 font-medium text-muted-foreground bg-background sticky left-0 z-10 border-r">{row.label}</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3 text-center">{row.fn(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Admin Add/Edit Form
// ═══════════════════════════════════════════
function AdminForm({ editProduct, onClose }: { editProduct?: CctvProduct; onClose: () => void }) {
  const [form, setForm] = useState(
    editProduct
      ? { ...editProduct, price: String(editProduct.price), salePrice: editProduct.salePrice ? String(editProduct.salePrice) : "" }
      : { brand: "", modelName: "", cameraType: "Bullet", resolution: "2MP", technology: "HD-TVI", recorderType: "DVR", nightVision: "", weatherRating: "", price: "", salePrice: "", description: "", features: "", imageUrl: "", videoUrl: "", sampleVideoUrl: "", irRange: "", fieldOfView: "" }
  );
  const [saving, setSaving] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageUpload = async (field: "imageUrl" | "videoUrl" | "sampleVideoUrl", file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) { update(field, data.url); toast.success("Uploaded successfully"); }
    else toast.error("Upload failed");
  };

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
              <SelectItem value="Dome">Dome</SelectItem><SelectItem value="Bullet">Bullet</SelectItem><SelectItem value="WiFi">WiFi</SelectItem><SelectItem value="PTZ">PTZ</SelectItem><SelectItem value="4G">4G</SelectItem><SelectItem value="DVR">DVR</SelectItem><SelectItem value="NVR">NVR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Resolution</Label>
          <Select value={form.resolution} onValueChange={(v) => update("resolution", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1MP">1MP (720p)</SelectItem><SelectItem value="2MP">2MP (1080p)</SelectItem><SelectItem value="4MP">4MP (1440p)</SelectItem><SelectItem value="5MP">5MP</SelectItem><SelectItem value="4K">4K (8MP)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Technology</Label>
          <Select value={form.technology} onValueChange={(v) => update("technology", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="HD-TVI">HD-TVI (Hikvision)</SelectItem><SelectItem value="HD-CVI">HD-CVI (Dahua)</SelectItem><SelectItem value="IP">IP</SelectItem><SelectItem value="WiFi IP">WiFi IP</SelectItem><SelectItem value="4G LTE">4G LTE</SelectItem><SelectItem value="AHD">AHD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Compatible Recorder</Label>
          <Select value={form.recorderType} onValueChange={(v) => update("recorderType", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="DVR">DVR</SelectItem><SelectItem value="NVR">NVR</SelectItem><SelectItem value="Cloud/NVR">Cloud / NVR</SelectItem><SelectItem value="Cloud/SD Card">Cloud / SD Card</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Price (INR) *</Label><Input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="1500" /></div>
        <div className="space-y-2"><Label>Sale Price (INR)</Label><Input type="number" value={form.salePrice} onChange={(e) => update("salePrice", e.target.value)} placeholder="1299 (optional)" /></div>
        <div className="space-y-2"><Label>Night Vision</Label><Input value={form.nightVision} onChange={(e) => update("nightVision", e.target.value)} placeholder="IR (20m) / ColorVu / Starlight" /></div>
        <div className="space-y-2"><Label>Weather Rating</Label><Input value={form.weatherRating} onChange={(e) => update("weatherRating", e.target.value)} placeholder="IP67 / IP66 / Indoor" /></div>
        <div className="space-y-2"><Label>IR Range</Label><Input value={form.irRange} onChange={(e) => update("irRange", e.target.value)} placeholder="20m / 50m" /></div>
        <div className="space-y-2"><Label>Field of View</Label><Input value={form.fieldOfView} onChange={(e) => update("fieldOfView", e.target.value)} placeholder="90° / 360°" /></div>
      </div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} placeholder="Product description..." /></div>
      <div className="space-y-2"><Label>Features (comma separated)</Label><Textarea value={form.features} onChange={(e) => update("features", e.target.value)} rows={2} placeholder="2MP, IR 20m, IP67, Smart IR" /></div>
      <div className="space-y-2">
        <Label>Product Image</Label>
        <div className="flex gap-2 items-center">
          <Input value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="/uploads/image.jpg or URL" />
          <label className="cursor-pointer"><Input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload("imageUrl", e.target.files[0])} /><Button variant="outline" size="sm" asChild><span>Upload</span></Button></label>
        </div>
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

// ═══════════════════════════════════════════
// Admin Panel
// ═══════════════════════════════════════════
function AdminPanel({ onBack }: { onBack: () => void }) {
  const { products, setProducts } = useStore();
  const [editing, setEditing] = useState<CctvProduct | undefined>();
  const [adding, setAdding] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    if (data.success) setProducts(data.data);
  }, [setProducts]);

  const handleDialogClose = () => { setEditing(undefined); setAdding(false); refresh(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Product Management</h2>
        <div className="flex gap-2">
          <Dialog open={adding} onOpenChange={setAdding}>
            <DialogTrigger asChild><Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add Product</Button></DialogTrigger>
            <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader><AdminForm onClose={handleDialogClose} /></DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={onBack}>Back to Catalog</Button>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-[70vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left">Model</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Sale</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-muted/50">
                  <td className="p-2"><img src={p.imageUrl} alt="" className="w-12 h-10 object-contain bg-muted rounded" onError={(e) => { (e.target as HTMLImageElement).src = "/logo.svg"; }} /></td>
                  <td className="p-3 font-medium">{p.brand}</td>
                  <td className="p-3">{p.modelName}</td>
                  <td className="p-3"><Badge variant="secondary" className="text-xs">{p.cameraType}</Badge></td>
                  <td className="p-3 text-right">{fmt(p.price)}</td>
                  <td className="p-3 text-right text-emerald-600">{p.salePrice ? fmt(p.salePrice) : "-"}</td>
                  <td className="p-3 text-center">
                    <Dialog open={editing?.id === p.id} onOpenChange={(open) => { if (open) setEditing(p); else setEditing(undefined); }}>
                      <DialogTrigger asChild><Button variant="ghost" size="sm">Edit</Button></DialogTrigger>
                      <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader><AdminForm editProduct={p} onClose={handleDialogClose} /></DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Filter Sidebar
// ═══════════════════════════════════════════
function FilterSidebar() {
  const { filters, setFilter, products, compareList, setView } = useStore();
  const brands = [...new Set(products.map((p) => p.brand))].sort();
  const types = [...new Set(products.map((p) => p.cameraType))].sort();
  const recorders = [...new Set(products.map((p) => p.recorderType))].sort();

  return (
    <aside className="space-y-5 w-full lg:w-64 shrink-0">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Search</Label>
        <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={filters.search} onChange={(e) => setFilter("search", e.target.value)} placeholder="Search brand or model..." className="pl-9" /></div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Brand</Label>
        <Select value={filters.brand} onValueChange={(v) => setFilter("brand", v)}>
          <SelectTrigger><SelectValue placeholder="All Brands" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Brands</SelectItem>{brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Camera Type</Label>
        <Select value={filters.cameraType} onValueChange={(v) => setFilter("cameraType", v)}>
          <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Types</SelectItem>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Recorder Type</Label>
        <Select value={filters.recorderType} onValueChange={(v) => setFilter("recorderType", v)}>
          <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All</SelectItem>{recorders.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Max Price (INR)</Label>
        <Input type="number" value={filters.maxPrice} onChange={(e) => setFilter("maxPrice", e.target.value)} placeholder="e.g. 10000" />
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Sort By</Label>
        <Select value={filters.sortBy} onValueChange={(v) => setFilter("sortBy", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="createdAt">Newest First</SelectItem>
            <SelectItem value="brand">Brand A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {compareList.length > 0 && (
        <Button variant="outline" className="w-full gap-2" onClick={() => setView("compare")}>
          <GitCompareArrows className="h-4 w-4" /> Compare ({compareList.length})
        </Button>
      )}
    </aside>
  );
}

// ═══════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════
export default function Home() {
  const { view, products, filters, setProducts, loading, setLoading, setView, setLearnSection } = useStore();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.brand && filters.brand !== "all") params.set("brand", filters.brand);
    if (filters.cameraType && filters.cameraType !== "all") params.set("cameraType", filters.cameraType);
    if (filters.recorderType && filters.recorderType !== "all") params.set("recorderType", filters.recorderType);
    if (filters.search) params.set("search", filters.search);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sortBy) {
      if (filters.sortBy === "price_desc") { params.set("sortBy", "price"); params.set("order", "desc"); }
      else { params.set("sortBy", filters.sortBy); }
    }
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    if (data.success) setProducts(data.data);
    setLoading(false);
  }, [filters, setProducts, setLoading]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button onClick={() => setView("catalog")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Shield className="h-6 w-6 text-emerald-600" />
              <span className="font-bold text-lg hidden sm:inline">CCTV Catalog</span>
            </button>
            <div className="flex items-center gap-2">
              <Tabs value={view} onValueChange={(v) => { if (v === 'learn') setLearnSection('overview'); setView(v as typeof view); }}>
                <TabsList className="h-9">
                  <TabsTrigger value="builder" className="text-xs px-3 gap-1"><Wrench className="h-3.5 w-3.5 hidden sm:inline" />Builder</TabsTrigger>
                  <TabsTrigger value="catalog" className="text-xs px-3 gap-1"><Camera className="h-3.5 w-3.5 hidden sm:inline" />Catalog</TabsTrigger>
                  <TabsTrigger value="learn" className="text-xs px-3 gap-1"><GraduationCap className="h-3.5 w-3.5 hidden sm:inline" />Learn</TabsTrigger>
                  <TabsTrigger value="compare" className="text-xs px-3 gap-1"><GitCompareArrows className="h-3.5 w-3.5 hidden sm:inline" />Compare</TabsTrigger>
                  <TabsTrigger value="admin" className="text-xs px-3 gap-1"><Plus className="h-3.5 w-3.5 hidden sm:inline" />Admin</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {view === "builder" ? (
          <CctvBuilder />
        ) : view === "learn" ? (
          <LearningSystem />
        ) : view === "detail" && useStore.getState().selectedProduct ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ProductDetail product={useStore.getState().selectedProduct!} onBack={() => setView("catalog")} />
          </div>
        ) : view === "compare" ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <CompareView />
          </div>
        ) : view === "admin" ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AdminPanel onBack={() => setView("catalog")} />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Hero Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { icon: <Camera className="h-5 w-5" />, label: "Products", value: products.length, color: "text-emerald-600" },
                { icon: <Star className="h-5 w-5" />, label: "Brands", value: [...new Set(products.map((p) => p.brand))].length, color: "text-amber-600" },
                { icon: <Tag className="h-5 w-5" />, label: "On Sale", value: products.filter((p) => p.salePrice).length, color: "text-red-600" },
                { icon: <DollarSign className="h-5 w-5" />, label: "Under 5K", value: products.filter((p) => p.price < 5000).length, color: "text-sky-600" },
              ].map((s) => (
                <Card key={s.label} className="flex items-center gap-3 p-3">
                  <div className={`${s.color}`}>{s.icon}</div>
                  <div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
                </Card>
              ))}
            </div>

            {/* Camera Type Quick Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["all", "Dome", "Bullet", "WiFi", "PTZ", "4G", "DVR", "NVR"].map((t) => {
                const active = filters.cameraType === t;
                const cfg = typeConfig[t];
                return (
                  <Button key={t} variant={active ? "default" : "outline"} size="sm" className="gap-1.5 text-xs" onClick={() => setFilter("cameraType", t)}>
                    {cfg?.icon || <Camera className="h-3.5 w-3.5" />}
                    {t === "all" ? "All Types" : t}
                  </Button>
                );
              })}
            </div>

            {/* Filters + Grid */}
            <div className="flex flex-col lg:flex-row gap-6">
              <FilterSidebar />
              <div className="flex-1">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="overflow-hidden"><div className="aspect-[4/3] bg-muted animate-pulse" /><div className="p-4 space-y-2"><div className="h-3 bg-muted rounded animate-pulse w-20" /><div className="h-4 bg-muted rounded animate-pulse w-32" /><div className="h-3 bg-muted rounded animate-pulse w-16" /></div></Card>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-16">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-semibold">No products found</h3>
                    <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">{products.length} product{products.length !== 1 ? "s" : ""} found</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {products.map((p) => (
                        <ProductCard key={p.id} p={p} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>CCTV Product Catalog Platform — Manage and compare security camera systems</p>
          <p>Supports Hikvision, Dahua, and more</p>
        </div>
      </footer>
    </div>
  );
}