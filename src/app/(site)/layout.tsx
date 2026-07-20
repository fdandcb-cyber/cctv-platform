import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { AppInitializer } from "@/components/app-initializer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppInitializer />
      <SiteHeader />
      <main className="flex-1" role="main">
        {children}
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
    </div>
  );
}