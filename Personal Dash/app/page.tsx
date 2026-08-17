"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ValueSnapshotWidget from "@/components/ValueSnapshotWidget";
import TodoOverviewWidget from "@/components/TodoOverviewWidget";

export default function OverviewPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-5 md:py-6">
          <div className="mb-5">
            <h1 className="font-display font-semibold text-[22px] md:text-[24px]">Overview</h1>
            <p className="text-[13px] text-text-secondary mt-0.5">Here's where your money and your day stand right now.</p>
          </div>

          <div className="flex flex-col gap-5 max-w-[1400px]">
            <ValueSnapshotWidget />
            <TodoOverviewWidget />
          </div>
        </main>
      </div>
    </div>
  );
}
