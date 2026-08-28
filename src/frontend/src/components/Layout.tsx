import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { Sidebar } from "@/components/Sidebar";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-background" data-ocid="main">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <div className="mb-4 flex justify-end">
              <OfflineIndicator />
            </div>
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
