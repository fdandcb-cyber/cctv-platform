"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAppStore } from "@/store/app-store";
import { Shield, Loader2, ArrowLeft, Mail, Lock, User, Phone } from "lucide-react";
import { toast } from "sonner";

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthPage() {
  const { login, signup, setView } = useAppStore();

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!validateEmail(loginForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (loginForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoginLoading(true);
    try {
      const success = await login(loginForm.email, loginForm.password);
      if (success) {
        toast.success("Logged in successfully!");
        setView("home");
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async () => {
    if (
      !signupForm.name ||
      !signupForm.email ||
      !signupForm.phone ||
      !signupForm.password ||
      !signupForm.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!validateEmail(signupForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (signupForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSignupLoading(true);
    try {
      const success = await signup({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        phone: signupForm.phone,
      });
      if (success) {
        toast.success("Account created successfully!");
        setView("home");
      } else {
        toast.error("Signup failed. This email may already be registered.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold">ConnectZ</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sign in to your account or create a new one
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground")} />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@email.com"
                      className={cn("pl-9")}
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground")} />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      className={cn("pl-9")}
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleLogin();
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className={cn(
                      "text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                    )}
                    onClick={() => toast("Contact support for password recovery")}
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  className="w-full h-11 gap-2"
                  onClick={handleLogin}
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground")} />
                    <Input
                      id="signup-name"
                      placeholder="John Doe"
                      className={cn("pl-9")}
                      value={signupForm.name}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground")} />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@email.com"
                      className={cn("pl-9")}
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-phone">Phone</Label>
                  <div className="relative">
                    <Phone className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground")} />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="9876543210"
                      className={cn("pl-9")}
                      value={signupForm.phone}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground")} />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Min 6 characters"
                      className={cn("pl-9")}
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground")} />
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Re-enter password"
                      className={cn("pl-9")}
                      value={signupForm.confirmPassword}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSignup();
                      }}
                    />
                  </div>
                </div>

                <Button
                  className="w-full h-11 gap-2"
                  onClick={handleSignup}
                  disabled={signupLoading}
                >
                  {signupLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <button
                type="button"
                className={cn(
                  "text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 mx-auto"
                )}
                onClick={() => setView("home")}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Home
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}