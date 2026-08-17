"use client";

import { useState } from "react";

export const NAV_ITEMS = [
  { label: "Overview", icon: LayoutIcon, active: true },
  { label: "To-Do", icon: CheckIcon, active: false },
  { label: "Value Tracker", icon: ChartIcon, active: false },
  { label: "Journal", icon: BookIcon, active: false },
  { label: "File Vault", icon: VaultIcon, active: false },
  { label: "Settings", icon: GearIcon, active: false },
];

function BrandMark({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border shrink-0">
      <div className="w-7 h-7 rounded-md bg-gold flex items-center justify-center shrink-0">
        <span className="font-display font-bold text-[13px] text-bg">L</span>
      </div>
      {!collapsed && <span className="font-display font-semibold text-[15px] tracking-tight">Ledger</span>}
    </div>
  );
}

function NavList({ collapsed }: { collapsed?: boolean }) {
  return (
    <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.label}
          title={collapsed ? item.label : undefined}
          className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-150 ${
            item.active ? "bg-gold/10 text-gold" : "text-text-secondary hover:bg-surface2 hover:text-text-primary"
          }`}
        >
          {item.active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-gold" />}
          <item.icon />
          {!collapsed && <span>{item.label}</span>}
        </button>
      ))}
    </nav>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }: { mobileOpen: boolean; onMobileClose: () => void }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop rail */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-border bg-surface transition-all duration-200 ease-out ${
          collapsed ? "w-[76px]" : "w-[232px]"
        }`}
      >
        <BrandMark collapsed={collapsed} />
        <NavList collapsed={collapsed} />
        <div className="p-3 border-t border-border">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-full flex items-center justify-center gap-2 rounded-md py-2 text-text-tertiary hover:text-text-primary hover:bg-surface2 transition-colors duration-150"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}>
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 animate-fadeIn">
          <button aria-label="Close menu" className="absolute inset-0 bg-black/60" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-[240px] bg-surface border-r border-border flex flex-col animate-slideUp">
            <BrandMark />
            <NavList />
          </aside>
        </div>
      )}
    </>
  );
}

function iconProps() {
  return { width: 17, height: 17, viewBox: "0 0 17 17", fill: "none" as const };
}

function LayoutIcon({ active }: { active?: boolean }) {
  return (
    <svg {...iconProps()}>
      <rect x="2" y="2" width="13" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2" y="10.5" width="6" height="4.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10" y="10.5" width="5" height="4.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="2" y="2" width="13" height="13" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 8.5L7.3 10.3L11.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 14V9M8.5 14V3M14 14V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 3.5C3 2.7 3.7 2 4.5 2H13v11H4.5c-.8 0-1.5.7-1.5 1.5V3.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M13 13H4.5C3.7 13 3 13.7 3 14.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function VaultIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="2" y="2.5" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8.5" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8.5 6.5V7.5M8.5 9.5V10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="8.5" cy="8.5" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8.5 2.5v1.4M8.5 13.1v1.4M14.5 8.5h-1.4M3.4 8.5H2M12.6 4.4l-1 1M6.9 11.6l-1 1M12.6 12.6l-1-1M6.9 5.4l-1-1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
