import { db } from "@/lib/db";

const seedProducts = [
  {
    brand: "Hikvision", modelName: "DS-2CE56D0T-IRP", cameraType: "Bullet", resolution: "2MP",
    technology: "HD-TVI", recorderType: "DVR", nightVision: "IR (20m)", weatherRating: "IP67",
    price: 1500, salePrice: 1299, irRange: "20m", fieldOfView: "87°",
    description: "Hikvision Turbo HD bullet camera with 20m IR night vision. Ideal for outdoor perimeter surveillance of homes, driveways, and entry points. Easy to install with adjustable mounting bracket.",
    features: "2MP 1080p, EXIR 2.0, 20m IR range, IP67 weatherproof, OSD menu, Smart IR",
    imageUrl: "/uploads/hikvision-bullet.jpg", sampleVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    brand: "Hikvision", modelName: "DS-2CE5AD0T-IRP", cameraType: "Dome", resolution: "2MP",
    technology: "HD-TVI", recorderType: "DVR", nightVision: "IR (20m)", weatherRating: "IP66",
    price: 1800, salePrice: 1599, irRange: "20m", fieldOfView: "103°",
    description: "Compact indoor dome camera from Hikvision Turbo HD series. Wide 103-degree field of view makes it perfect for monitoring large indoor areas like living rooms and hallways.",
    features: "2MP 1080p, 103° wide angle, IR 20m, vandal-proof housing, 3D DNR, Smart IR",
    imageUrl: "/uploads/hikvision-dome.jpg", sampleVideoUrl: "",
  },
  {
    brand: "Hikvision", modelName: "Ezviz C6N", cameraType: "WiFi", resolution: "2MP",
    technology: "WiFi IP", recorderType: "Cloud/NVR", nightVision: "IR (10m)", weatherRating: "Indoor",
    price: 2500, salePrice: 2199, irRange: "10m", fieldOfView: "360° (pan-tilt)",
    description: "Smart WiFi pan-tilt camera from Hikvision's Ezviz brand. No DVR needed — connects directly to your phone via WiFi. Perfect for homes and apartments.",
    features: "2MP, 360° pan-tilt, two-way audio, motion tracking, night vision 10m, microSD slot",
    imageUrl: "/uploads/ezviz-c6n.jpg", sampleVideoUrl: "",
  },
  {
    brand: "Hikvision", modelName: "DS-2DE4A425IWG-E", cameraType: "PTZ", resolution: "4MP",
    technology: "IP", recorderType: "NVR", nightVision: "IR (150m)", weatherRating: "IP67",
    price: 8500, salePrice: 7999, irRange: "150m", fieldOfView: "360° (25x zoom)",
    description: "Professional PTZ camera with 25x optical zoom for large area surveillance. Auto-tracking follows moving objects. Ideal for farms, warehouses, and large properties.",
    features: "4MP, 25x optical zoom, 360° pan, IR 150m, auto-tracking, smart line crossing",
    imageUrl: "/uploads/hikvision-ptz.jpg", sampleVideoUrl: "",
  },
  {
    brand: "Hikvision", modelName: "DS-7104HI-K1", cameraType: "DVR", resolution: "4MP",
    technology: "HD-TVI", recorderType: "DVR", nightVision: "N/A", weatherRating: "N/A",
    price: 3500, salePrice: 3199, irRange: "N/A", fieldOfView: "N/A",
    description: "4-channel Hikvision DVR supporting up to 4 Turbo HD cameras. Records in 4MP resolution. Supports Hik-Connect for remote mobile viewing.",
    features: "4-channel, 4MP recording, H.265+ compression, 1 SATA port, Hik-Connect, iVMS-4500",
    imageUrl: "/uploads/hikvision-dvr.jpg", sampleVideoUrl: "",
  },
  {
    brand: "Dahua", modelName: "DH-HFW1200T1-A-IL", cameraType: "Bullet", resolution: "2MP",
    technology: "HD-CVI", recorderType: "DVR", nightVision: "IR (30m)", weatherRating: "IP67",
    price: 1200, salePrice: 1099, irRange: "30m", fieldOfView: "90°",
    description: "Affordable Dahua HD-CVI bullet camera with impressive 30m IR range. Excellent value for money with reliable night vision performance.",
    features: "2MP, IR 30m, IP67, HD-CVI, Smart IR, 3D DNR, OSD menu",
    imageUrl: "/uploads/dahua-bullet.jpg", sampleVideoUrl: "",
  },
  {
    brand: "Dahua", modelName: "IPC-HDW1230S", cameraType: "Dome", resolution: "2MP",
    technology: "IP", recorderType: "NVR", nightVision: "IR (30m)", weatherRating: "IP67",
    price: 1400, salePrice: 1249, irRange: "30m", fieldOfView: "105°",
    description: "Compact IP dome camera from Dahua with wide 105-degree field of view. Supports PoE for easy single-cable installation.",
    features: "2MP, 105° FOV, IR 30m, IP67, PoE, H.265+, Smart IR, DWDR",
    imageUrl: "/uploads/dahua-dome.jpg", sampleVideoUrl: "",
  },
  {
    brand: "Dahua", modelName: "Imou Ranger 2", cameraType: "WiFi", resolution: "4MP",
    technology: "WiFi IP", recorderType: "Cloud/NVR", nightVision: "IR (10m)", weatherRating: "IP65",
    price: 3500, salePrice: 3199, irRange: "10m", fieldOfView: "360° (pan-tilt)",
    description: "Premium WiFi pan-tilt camera from Dahua's Imou brand. 4MP resolution with AI-powered person detection and auto-tracking.",
    features: "4MP, 360° pan-tilt, AI person detection, auto-tracking, two-way audio, IP65",
    imageUrl: "/uploads/imou-ranger.jpg", sampleVideoUrl: "",
  },
  {
    brand: "Dahua", modelName: "XVR5108HS-4KL-I3", cameraType: "DVR", resolution: "4K",
    technology: "HD-CVI", recorderType: "DVR", nightVision: "N/A", weatherRating: "N/A",
    price: 4000, salePrice: 3699, irRange: "N/A", fieldOfView: "N/A",
    description: "8-channel Dahua DVR with 4K recording capability. Tri-brid technology supports HD-CVI, AHD, and IP cameras simultaneously.",
    features: "8-channel, 4K recording, tri-brid (CVI/AHD/IP), H.265+, DMSS app, 2 SATA",
    imageUrl: "/uploads/dahua-dvr.jpg", sampleVideoUrl: "",
  },
  {
    brand: "Hikvision", modelName: "DS-2XS6A47G0-F", cameraType: "4G", resolution: "4MP",
    technology: "4G LTE", recorderType: "Cloud/SD Card", nightVision: "Color (15m)", weatherRating: "IP67",
    price: 14000, salePrice: 12500, irRange: "15m (color)", fieldOfView: "130°",
    description: "Solar-powered 4G LTE camera for remote locations. No WiFi or power cables needed. Ideal for farms, construction sites, and vacation homes.",
    features: "4MP, 4G LTE, solar powered, built-in battery, color night vision, PIR motion",
    imageUrl: "/uploads/hikvision-4g.jpg", sampleVideoUrl: "",
  },
  {
    brand: "Dahua", modelName: "IPC-HFW8242E-Z4E-4G", cameraType: "4G", resolution: "4MP",
    technology: "4G LTE", recorderType: "Cloud/SD Card", nightVision: "IR (50m)", weatherRating: "IP67",
    price: 11000, salePrice: 9999, irRange: "50m", fieldOfView: "95°",
    description: "4G LTE bullet camera for locations without WiFi. 2.7-13.5mm motorized varifocal lens for flexible field of view adjustment.",
    features: "4MP, 4G LTE, varifocal 2.7-13.5mm, IR 50m, IP67, SD card slot, DMSS",
    imageUrl: "/uploads/dahua-4g.jpg", sampleVideoUrl: "",
  },
  {
    brand: "Hikvision", modelName: "DS-76NI-K1", cameraType: "NVR", resolution: "4K",
    technology: "IP", recorderType: "NVR", nightVision: "N/A", weatherRating: "N/A",
    price: 5500, salePrice: 4999, irRange: "N/A", fieldOfView: "N/A",
    description: "4-channel PoE NVR from Hikvision. Plug cameras directly into the NVR — no separate power supply needed. 4K recording with H.265+ compression.",
    features: "4-channel PoE NVR, 4K recording, H.265+, 1 SATA, Hik-Connect, iVMS-4500",
    imageUrl: "/uploads/hikvision-nvr.jpg", sampleVideoUrl: "",
  },
];

async function seed() {
  console.log("Seeding CCTV products...");
  for (const p of seedProducts) {
    await db.cctvProduct.create({ data: p });
  }
  console.log(`Seeded ${seedProducts.length} products`);
}

seed().catch(console.error);