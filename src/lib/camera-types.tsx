import React from "react";
import { Camera, Wifi, Radio, Signal, MonitorPlay } from "lucide-react";

export const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Dome: { icon: <Camera className="h-4 w-4" />, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" },
  Bullet: { icon: <Camera className="h-4 w-4" />, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800" },
  WiFi: { icon: <Wifi className="h-4 w-4" />, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800" },
  PTZ: { icon: <Radio className="h-4 w-4" />, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800" },
  "4G": { icon: <Signal className="h-4 w-4" />, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800" },
  DVR: { icon: <MonitorPlay className="h-4 w-4" />, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700" },
  NVR: { icon: <MonitorPlay className="h-4 w-4" />, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800" },
};

export const QUICK_TYPES = ["all", "Dome", "Bullet", "WiFi", "PTZ", "4G", "DVR", "NVR"] as const;
