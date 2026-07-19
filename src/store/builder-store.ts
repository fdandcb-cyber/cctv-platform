import { create } from "zustand";

export type PropertyType = "home" | "apartment" | "office" | "shop" | "warehouse" | "factory" | "restaurant" | "hospital" | "school" | "villa" | "other";
export type CameraSystem = "analog" | "ip" | "wifi";
export type CameraTech = "night_vision" | "night_vision_audio" | "color_audio" | "two_way_talk";
export type CameraForm = "dome" | "bullet" | "ptz";

export interface CameraSelection {
  productId: string;
  brand: string;
  modelName: string;
  mp: string;         // normalized resolution: "1MP", "2MP", "3MP", "4MP", "5MP", "8MP", "12MP"
  form: CameraForm;   // dome / bullet / ptz
  qty: number;
  tech: CameraTech;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  cameraType: string;  // original cameraType from product (Dome, Bullet, WiFi, PTZ, 4G)
}

export interface RecorderUnit {
  type: string;      // "DVR" or "NVR"
  channels: number;  // 4, 8, 16, 32, 64, 128, 256
  usedPorts: number; // how many cameras will connect
}

export interface PowerUnit {
  type: string;      // "SMPS Power Supply" or "PoE Switch"
  ports: number;     // 4, 8, 16, 24
  usedPorts: number;
  variant: "standard" | "giga"; // giga for PoE with >2MP cameras
}

export interface CableSelection {
  type: string;     // "90m" or "180m" for analog, "100m" or "305m" for IP
  qty: number;
}

export interface BuilderState {
  // Step 1
  propertyType: PropertyType | "";
  // Step 2
  areaSqft: string;
  // Step 3 (auto-calculated)
  suggestedCameras: number;
  // Step 4
  cameraSystem: CameraSystem | "";
  // Step 5 — MULTI-SELECT
  cameraTechs: CameraTech[];
  // Step 6 — product-based selections
  cameraSelections: CameraSelection[];
  // Step 7 (auto-suggested) — ARRAY of units
  recorderUnits: RecorderUnit[];
  // Step 8 (auto-suggested) — ARRAY of units
  powerUnits: PowerUnit[];
  // Step 9
  retentionDays: number;
  hddSuggestion: string;
  hddBreakdown: string;
  // Step 10
  cableLengthPerCamera: number;
  cableSelection: CableSelection | null;
  // Step 11
  junctionBox4x4: number;
  junctionBox5x5: number;
  dcConnector: number;
  bncConnector: number;
  rj45Connector: number;
  // Extra accessories
  networkingRack: number;
  monitor: number;
  monitorSize: string;
  extensionBoard: number;
  wirelessMouse: number;
  wirelessKeyboard: number;
  ups: number;

  // Actions
  setPropertyType: (v: PropertyType) => void;
  setAreaSqft: (v: string) => void;
  setSuggestedCameras: (v: number) => void;
  setCameraSystem: (v: CameraSystem) => void;
  toggleCameraTech: (v: CameraTech) => void;
  setCameraTechs: (v: CameraTech[]) => void;
  setCameraSelections: (v: CameraSelection[]) => void;
  setRecorderUnits: (v: RecorderUnit[]) => void;
  setPowerUnits: (v: PowerUnit[]) => void;
  setRetentionDays: (v: number) => void;
  setHddSuggestion: (v: string) => void;
  setHddBreakdown: (v: string) => void;
  setCableLengthPerCamera: (v: number) => void;
  setCableSelection: (v: CableSelection | null) => void;
  setJunctionBox4x4: (v: number) => void;
  setJunctionBox5x5: (v: number) => void;
  setDcConnector: (v: number) => void;
  setBncConnector: (v: number) => void;
  setRj45Connector: (v: number) => void;
  setNetworkingRack: (v: number) => void;
  setMonitor: (v: number) => void;
  setMonitorSize: (v: string) => void;
  setExtensionBoard: (v: number) => void;
  setWirelessMouse: (v: number) => void;
  setWirelessKeyboard: (v: number) => void;
  setUps: (v: number) => void;
  resetBuilder: () => void;
}

const initialState = {
  propertyType: "" as PropertyType | "",
  areaSqft: "",
  suggestedCameras: 0,
  cameraSystem: "" as CameraSystem | "",
  cameraTechs: [] as CameraTech[],
  cameraSelections: [] as CameraSelection[],
  recorderUnits: [] as RecorderUnit[],
  powerUnits: [] as PowerUnit[],
  retentionDays: 15,
  hddSuggestion: "",
  hddBreakdown: "",
  cableLengthPerCamera: 25,
  cableSelection: null as CableSelection | null,
  junctionBox4x4: 0,
  junctionBox5x5: 0,
  dcConnector: 0,
  bncConnector: 0,
  rj45Connector: 0,
  networkingRack: 0,
  monitor: 0,
  monitorSize: '21.5',
  extensionBoard: 0,
  wirelessMouse: 0,
  wirelessKeyboard: 0,
  ups: 0,
};

export const useBuilderStore = create<BuilderState>((set) => ({
  ...initialState,
  setPropertyType: (v) => set({ propertyType: v }),
  setAreaSqft: (v) => set({ areaSqft: v }),
  setSuggestedCameras: (v) => set({ suggestedCameras: v }),
  setCameraSystem: (v) => set({
    cameraSystem: v,
    cameraTechs: [],
    cameraSelections: [],
    recorderUnits: [],
    powerUnits: [],
    cableSelection: null,
    hddSuggestion: "",
    hddBreakdown: "",
  }),
  toggleCameraTech: (v) => set((s) => ({
    cameraTechs: s.cameraTechs.includes(v)
      ? s.cameraTechs.filter(t => t !== v)
      : [...s.cameraTechs, v]
  })),
  setCameraTechs: (v) => set({ cameraTechs: v }),
  setCameraSelections: (v) => set({ cameraSelections: v }),
  setRecorderUnits: (v) => set({ recorderUnits: v }),
  setPowerUnits: (v) => set({ powerUnits: v }),
  setRetentionDays: (v) => set({ retentionDays: v }),
  setHddSuggestion: (v) => set({ hddSuggestion: v }),
  setHddBreakdown: (v) => set({ hddBreakdown: v }),
  setCableLengthPerCamera: (v) => set({ cableLengthPerCamera: v }),
  setCableSelection: (v) => set({ cableSelection: v }),
  setJunctionBox4x4: (v) => set({ junctionBox4x4: v }),
  setJunctionBox5x5: (v) => set({ junctionBox5x5: v }),
  setDcConnector: (v) => set({ dcConnector: v }),
  setBncConnector: (v) => set({ bncConnector: v }),
  setRj45Connector: (v) => set({ rj45Connector: v }),
  setNetworkingRack: (v) => set({ networkingRack: v }),
  setMonitor: (v) => set({ monitor: v }),
  setMonitorSize: (v) => set({ monitorSize: v }),
  setExtensionBoard: (v) => set({ extensionBoard: v }),
  setWirelessMouse: (v) => set({ wirelessMouse: v }),
  setWirelessKeyboard: (v) => set({ wirelessKeyboard: v }),
  setUps: (v) => set({ ups: v }),
  resetBuilder: () => set(initialState),
}));

// ═══ HELPERS ═══
// Normalize product resolution string to our bitrate map key
export function normalizeResolution(res: string): string {
  if (!res) return "2MP";
  const r = res.toUpperCase().trim();
  if (r.includes("4K") || r === "8MP") return "8MP";
  if (r === "12MP") return "12MP";
  if (r === "5MP") return "5MP";
  if (r === "4MP" || r === "1440P") return "4MP";
  if (r === "3MP") return "3MP";
  if (r === "2MP" || r === "1080P") return "2MP";
  if (r === "1MP" || r === "720P") return "1MP";
  // Fallback: try to extract number
  const match = r.match(/(\d+)MP/);
  if (match) return match[1] + "MP";
  return "2MP";
}

// Map product cameraType to form factor
export function cameraTypeToForm(cameraType: string): CameraForm {
  const ct = cameraType.toLowerCase();
  if (ct === "bullet") return "bullet";
  if (ct === "ptz") return "ptz";
  return "dome"; // Dome, WiFi, 4G all default to dome form
}