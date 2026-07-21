import type { Metadata } from "next";
import { AuthPage } from "@/components/pages/auth-page";

export const metadata: Metadata = {
  title: "Login / Sign Up",
  description: "Sign in to your ConnectZ account or create a new one.",
};

export default function AuthRoute() {
  return <AuthPage />;
}