"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wrench,
  Eye,
  MonitorSmartphone,
  ShieldCheck,
  HardHat,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  Camera,
  Cable,
  HardDrive,
  Network,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.5 },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true } as const,
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const SERVICES = [
  {
    icon: <Wrench className="h-7 w-7" />,
    title: "CCTV Installation",
    description:
      "Professional installation of dome, bullet, PTZ, WiFi, and 4G cameras for residential, commercial, and industrial properties. Our certified technicians ensure optimal camera placement for maximum coverage and minimal blind spots.",
    features: [
      "Site survey and camera placement planning",
      "Indoor & outdoor camera installation",
      "Cable routing and concealment",
      "DVR/NVR setup and configuration",
      "Mobile app setup for remote viewing",
      "Quality testing and handover demo",
    ],
    color: "bg-emerald-50 text-emerald-600",
    darkColor: "dark:bg-emerald-950/50 dark:text-emerald-400",
  },
  {
    icon: <MonitorSmartphone className="h-7 w-7" />,
    title: "Remote Monitoring",
    description:
      "Monitor your property from anywhere in the world using your smartphone, tablet, or computer. We set up secure remote viewing so you always have eyes on what matters most, with real-time alerts for motion detection.",
    features: [
      "Mobile app configuration (iOS & Android)",
      "PC/Mac client setup",
      "Cloud storage integration",
      "Motion detection alerts via push notification",
      "Multi-site monitoring from single app",
      "Secure encrypted connections",
    ],
    color: "bg-sky-50 text-sky-600",
    darkColor: "dark:bg-sky-950/50 dark:text-sky-400",
  },
  {
    icon: <ShieldCheck className="h-7 w-7" />,
    title: "AMC & Support",
    description:
      "Annual Maintenance Contracts to keep your security system running flawlessly year-round. Our support team provides timely troubleshooting, firmware updates, and component replacements to ensure uninterrupted surveillance.",
    features: [
      "Quarterly preventive maintenance visits",
      "Firmware and software updates",
      "Camera cleaning and alignment checks",
      "Hard drive health monitoring",
      "Priority response for breakdowns",
      "Discounted spare parts and upgrades",
    ],
    color: "bg-amber-50 text-amber-600",
    darkColor: "dark:bg-amber-950/50 dark:text-amber-400",
  },
  {
    icon: <Eye className="h-7 w-7" />,
    title: "Site Survey & Consultation",
    description:
      "Free on-site assessment by our security experts. We analyze your property layout, identify vulnerable areas, and recommend the most cost-effective CCTV solution tailored to your specific security requirements and budget.",
    features: [
      "Free on-site property assessment",
      "Security vulnerability analysis",
      "Custom system design and quotation",
      "Budget optimization recommendations",
      "Technology guidance (analog vs IP vs WiFi)",
      "Compliance and regulation advice",
    ],
    color: "bg-violet-50 text-violet-600",
    darkColor: "dark:bg-violet-950/50 dark:text-violet-400",
  },
  {
    icon: <HardHat className="h-7 w-7" />,
    title: "Access Control Systems",
    description:
      "Beyond cameras, we install and maintain access control solutions including biometric systems, card-based entry, boom barriers, and video door phones to create a comprehensive security ecosystem for your premises.",
    features: [
      "Biometric fingerprint & face recognition",
      "RFID card-based access systems",
      "Video door phones with intercom",
      "Boom barrier installation",
      "Attendance management integration",
      "Multi-door and multi-zone control",
    ],
    color: "bg-rose-50 text-rose-600",
    darkColor: "dark:bg-rose-950/50 dark:text-rose-400",
  },
  {
    icon: <Network className="h-7 w-7" />,
    title: "Network & Infrastructure",
    description:
      "Complete networking infrastructure for your CCTV system including structured cabling, PoE switches, network configuration, and internet connectivity setup. We ensure your surveillance network is fast, reliable, and secure.",
    features: [
      "Structured cabling (CAT6/CAT5e)",
      "PoE switch installation and setup",
      "Router and modem configuration",
      "Network segmentation for security",
      "Wi-Fi extension for wireless cameras",
      "UPS backup for uninterrupted recording",
    ],
    color: "bg-teal-50 text-teal-600",
    darkColor: "dark:bg-teal-950/50 dark:text-teal-400",
  },
];

const PROCESS_STEPS = [
  {
    icon: <PhoneCall className="h-6 w-6" />,
    step: "01",
    title: "Contact Us",
    description:
      "Reach out via phone, WhatsApp, email, or our contact form. Share your requirements, property type, and any specific security concerns you have.",
  },
  {
    icon: <Eye className="h-6 w-6" />,
    step: "02",
    title: "Free Site Survey",
    description:
      "Our expert visits your property to assess the layout, identify vulnerable entry points, and determine optimal camera positions for maximum coverage.",
  },
  {
    icon: <Camera className="h-6 w-6" />,
    step: "03",
    title: "Custom Proposal",
    description:
      "We provide a detailed quotation with camera specifications, system design diagram, pricing breakdown, and timeline. No hidden charges, fully transparent.",
  },
  {
    icon: <HardDrive className="h-6 w-6" />,
    step: "04",
    title: "Installation",
    description:
      "Our certified technicians install the complete system including cameras, cables, DVR/NVR, and network setup. Clean, professional workmanship guaranteed.",
  },
  {
    icon: <Cable className="h-6 w-6" />,
    step: "05",
    title: "Configuration & Testing",
    description:
      "Full system configuration including recording settings, motion detection, remote access, and mobile app. Every camera is tested and demonstrated to you.",
  },
  {
    icon: <CheckCircle2 className="h-6 w-6" />,
    step: "06",
    title: "Handover & Support",
    description:
      "Complete handover with user training, documentation, and warranty details. Ongoing support and maintenance available through our AMC plans.",
  },
];

export function ServicesPage() {
  const { setView } = useAppStore();

  return (
    <div className={cn("min-h-screen bg-background")}>
      {/* Hero */}
      <section className={cn("relative overflow-hidden px-4 py-20 sm:py-28")}>
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            "bg-gradient-to-b from-background via-background/95 to-background/80",
            "before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,oklch(0.6_0.15_160/0.1),transparent_70%)]"
          )}
        />
        <div className={cn("relative z-10 mx-auto max-w-3xl text-center")}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("text-4xl font-extrabold tracking-tight sm:text-5xl")}
          >
            Our{" "}
            <span className={cn("text-emerald-600 dark:text-emerald-400")}>
              Services
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className={cn("mt-6 text-lg leading-relaxed text-muted-foreground")}
          >
            End-to-end security solutions from consultation to installation and
            beyond. We handle everything so you can focus on what matters most.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className={cn("px-4 py-16 sm:py-20")}>
        <div className={cn("mx-auto max-w-6xl")}>
          <motion.div
            {...staggerContainer}
            className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3")}
          >
            {SERVICES.map((service) => (
              <motion.div key={service.title} {...staggerItem}>
                <Card
                  className={cn(
                    "h-full gap-0 py-0 transition-all duration-300",
                    "hover:shadow-lg hover:-translate-y-1"
                  )}
                >
                  <CardContent className={cn("p-6 space-y-4")}>
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-xl",
                        service.color,
                        service.darkColor
                      )}
                    >
                      {service.icon}
                    </div>
                    <h3 className={cn("text-xl font-semibold")}>
                      {service.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm leading-relaxed text-muted-foreground"
                      )}
                    >
                      {service.description}
                    </p>
                    <ul className={cn("space-y-2 pt-1")}>
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className={cn(
                            "flex items-start gap-2 text-sm text-muted-foreground"
                          )}
                        >
                          <CheckCircle2
                            className={cn(
                              "h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                            )}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Process */}
      <section className={cn("px-4 py-16 sm:py-20 bg-muted/30")}>
        <div className={cn("mx-auto max-w-6xl")}>
          <motion.div {...fadeUp} className={cn("text-center mb-12")}>
            <h2 className={cn("text-3xl font-bold sm:text-4xl")}>
              How It Works
            </h2>
            <p className={cn("mt-2 text-muted-foreground")}>
              Our simple 6-step process from first contact to completed
              installation
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className={cn(
              "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {PROCESS_STEPS.map((step) => (
              <motion.div key={step.step} {...staggerItem}>
                <Card className={cn("h-full gap-4 py-0")}>
                  <CardContent className={cn("p-6 space-y-3 relative")}>
                    <div
                      className={cn(
                        "absolute top-4 right-4 text-5xl font-extrabold text-muted-foreground/10"
                      )}
                    >
                      {step.step}
                    </div>
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
                      )}
                    >
                      {step.icon}
                    </div>
                    <h3 className={cn("font-semibold text-lg pr-8")}>
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm leading-relaxed text-muted-foreground"
                      )}
                    >
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className={cn("px-4 py-16 sm:py-20")}>
        <div className={cn("mx-auto max-w-4xl")}>
          <motion.div {...fadeUp}>
            <Card
              className={cn(
                "bg-primary text-primary-foreground overflow-hidden py-0 gap-0 border-0"
              )}
            >
              <CardContent
                className={cn("p-8 sm:p-12 text-center space-y-6")}
              >
                <div className={cn("flex justify-center")}>
                  <div
                    className={cn("p-3 rounded-xl bg-primary-foreground/10")}
                  >
                    <Clock className={cn("h-10 w-10")} />
                  </div>
                </div>
                <div className={cn("space-y-2")}>
                  <h2 className={cn("text-2xl sm:text-3xl font-bold")}>
                    Ready to Get Started?
                  </h2>
                  <p
                    className={cn(
                      "text-primary-foreground/80 text-lg max-w-xl mx-auto"
                    )}
                  >
                    Get a free site survey and customized security quote.
                    Our experts will design the perfect solution for your
                    property.
                  </p>
                </div>
                <div
                  className={cn(
                    "flex flex-col sm:flex-row gap-4 justify-center"
                  )}
                >
                  <Button
                    size="lg"
                    variant="secondary"
                    className={cn("gap-2 text-base px-8")}
                    onClick={() => setView("contact")}
                  >
                    Get a Free Quote
                    <ArrowRight className={cn("h-4 w-4")} />
                  </Button>
                  <a
                    href="https://wa.me/917809465102?text=Hi%2C%20I%20need%20a%20CCTV%20installation%20quote"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className={cn(
                        "gap-2 text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                      )}
                    >
                      <MessageCircle className={cn("h-4 w-4")} />
                      WhatsApp Us
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}