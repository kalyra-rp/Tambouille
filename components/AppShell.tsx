"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileTopbar } from "./MobileTopbar";
import { MOCK_CAULDRON } from "@/lib/mock";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Bloquer le scroll du body quand le drawer mobile est ouvert
  useEffect(() => {
    if (mobileOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [mobileOpen]);

  return (
    <div className="app-shell mx-auto my-[18px] grid w-[min(1440px,calc(100%-28px))] gap-[22px] grid-cols-1 min-[1180px]:grid-cols-[260px_1fr]">
      {/* Sidebar desktop : sticky */}
      <div className="hidden min-[1180px]:block sticky top-[18px] h-[calc(100vh-36px)]">
        <Sidebar cauldronCount={MOCK_CAULDRON.length} />
      </div>

      {/* Drawer mobile + overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 min-[1180px]:hidden"
          style={{ background: "rgba(58, 12, 42, 0.45)", backdropFilter: "blur(4px)" }}
        />
      )}
      <div
        className={`fixed left-[14px] top-[14px] bottom-[14px] z-50 w-[280px] transition-transform duration-300 min-[1180px]:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-[110%]"
        }`}
      >
        <Sidebar
          cauldronCount={MOCK_CAULDRON.length}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      <main className="grid gap-[22px]">
        <div className="block min-[1180px]:hidden">
          <MobileTopbar onMenuClick={() => setMobileOpen(true)} />
        </div>
        {children}
      </main>
    </div>
  );
}
