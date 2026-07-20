import type { Metadata } from "next";
import { LearningSystem } from "@/components/learning-system";

export const metadata: Metadata = {
  title: "CCTV Learning Center",
  description:
    "Learn about CCTV security systems — camera types, resolutions, installation tips, and more from ConnectZ experts.",
};

export default function LearnRoute() {
  return <LearningSystem />;
}