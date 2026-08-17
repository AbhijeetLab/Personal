"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import QuickAddModal from "./QuickAddModal";

export default function Header({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { tasks } = useApp();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const dateStr = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    []
  );

  const dueToday = useMemo(
    () => tasks.filter((t) => !t.completed && t.dueDate === new Date().toISOString().slice(0, 10)),
    [tasks]
  );
  const overdueHighPriority = useMemo(
    () => tasks.filter((t) => !t.completed && t.priority === "high" && t.dueDate <= new Date().toISOString().slice(0, 10)),
    [tasks]
  );

  return (
    <header className="h-16 shrink-0 border-b border-border bg-surface/80 backdrop-blur flex items-center gap-3 px-4 md:px-6 sticky top-0 z-30">
      <button
        onClick={onOpenMobileNav}
        className="md:hidden w-9 h-9 grid place-content-center rounded-md text-text-secondary hover:bg-surface2 hover:text-text-primary"
        aria-label="Open menu"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2.5 5H15.5M2.5 9H15.5M2.5 13H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M13 13L10 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks, entries, files…"
            className="w-full bg-surface2 border border-border rounded-md pl-9 pr-3 py-2 text-[13.5px] text-text-primary placeholder:text-text-tertiary focus:border-gold/60 focus:bg-surface3 transition-colors duration-150"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Date */}
      <div className="hidden lg:flex items-center gap-2 text-[13px] text-text-secondary font-mono tnum px-1">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1.5 5.5H12.5M4 1.5V3.3M10 1.5V3.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        {dateStr}
      </div>

      {/* Quick add */}
      <button
        onClick={() => setQuickAddOpen(true)}
        className="flex items-center gap-1.5 rounded-md bg-gold text-bg font-semibold text-[13px] px-3 py-2 hover:bg-gold-bright active:scale-[0.98] transition-all duration-150"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2.5V11.5M2.5 7H11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="hidden sm:inline">Quick add</span>
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen((o) => !o)}
          className="relative w-9 h-9 grid place-content-center rounded-md text-text-secondary hover:bg-surface2 hover:text-text-primary transition-colors duration-150"
          aria-label="Notifications"
        >
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path
              d="M8.5 2.5C6.3 2.5 4.5 4.3 4.5 6.5V9.2L3.2 11.3C3 11.6 3.2 12 3.6 12H13.4C13.8 12 14 11.6 13.8 11.3L12.5 9.2V6.5C12.5 4.3 10.7 2.5 8.5 2.5Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M7 13.8C7.3 14.4 7.9 14.8 8.5 14.8C9.1 14.8 9.7 14.4 10 13.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          {dueToday.length > 0 && (
            <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-[3px] rounded-full bg-danger text-[9px] font-bold text-white grid place-content-center leading-none">
              {dueToday.length}
            </span>
          )}
        </button>

        {notifOpen && (
          <>
            <button className="fixed inset-0 z-40" aria-label="Close notifications" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 mt-2 w-72 bg-surface2 border border-border rounded-md shadow-card z-50 animate-popIn overflow-hidden">
              <div className="px-4 py-3 border-b border-border text-[13px] font-semibold">Due today</div>
              <div className="max-h-64 overflow-y-auto">
                {dueToday.length === 0 && <div className="px-4 py-6 text-center text-[13px] text-text-tertiary">Nothing due today. Clear runway.</div>}
                {dueToday.map((t) => (
                  <div key={t.id} className="px-4 py-2.5 border-b border-border/60 last:border-0">
                    <p className="text-[13px] text-text-primary leading-snug">{t.title}</p>
                    <p className="text-[11px] text-text-tertiary capitalize mt-0.5">
                      {t.segment} · {t.priority} priority
                    </p>
                  </div>
                ))}
              </div>
              {overdueHighPriority.length > 0 && (
                <div className="px-4 py-2 bg-danger/10 text-danger text-[11.5px] font-medium">
                  {overdueHighPriority.length} high-priority item{overdueHighPriority.length > 1 ? "s" : ""} need attention.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {quickAddOpen && <QuickAddModal onClose={() => setQuickAddOpen(false)} />}
    </header>
  );
}
