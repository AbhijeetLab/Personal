"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import Sparkline from "./Sparkline";
import FinanceModal from "./FinanceModal";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function ValueSnapshotWidget() {
  const { finance, totals } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const rising = totals.deltaPct === null || totals.deltaPct >= 0;

  return (
    <section className="rounded-lg border border-border bg-surface shadow-card p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium text-text-secondary uppercase tracking-wide">Total net worth</p>
          <div className="flex items-baseline gap-3 mt-1.5 flex-wrap">
            <h2 className="font-display font-semibold text-[32px] md:text-[38px] leading-none tnum">{fmt(totals.netWorth)}</h2>
            {totals.deltaPct !== null && (
              <span
                className={`inline-flex items-center gap-1 text-[12.5px] font-semibold font-mono tnum ${
                  rising ? "text-personal" : "text-danger"
                }`}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={rising ? "" : "rotate-180"}>
                  <path d="M5 8.5V1.5M1.5 5L5 1.5L8.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {Math.abs(totals.deltaPct).toFixed(1)}%
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-text-tertiary mt-1">as of {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Sparkline data={finance.history} width={200} height={64} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <StatCard
          label="Total assets"
          value={fmt(totals.totalAssets)}
          tone="personal"
          sub={`Savings, stocks, crypto & property`}
        />
        <StatCard label="Total liabilities" value={fmt(totals.totalLiabilities)} tone="danger" sub={`Loans & balances owed`} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-md bg-surface2 border border-border px-4 py-3">
        <div className="flex items-center gap-5">
          <div>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wide">Monthly income</p>
            <p className="font-mono tnum text-[14px] font-medium text-text-primary mt-0.5">{fmt(finance.monthlyIncome)}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wide">Monthly expense</p>
            <p className="font-mono tnum text-[14px] font-medium text-text-primary mt-0.5">{fmt(finance.monthlyExpense)}</p>
          </div>
          <div className="w-px h-8 bg-border hidden sm:block" />
          <div className="hidden sm:block">
            <p className="text-[11px] text-text-tertiary uppercase tracking-wide">Surplus</p>
            <p className={`font-mono tnum text-[14px] font-semibold mt-0.5 ${totals.monthlySurplus >= 0 ? "text-personal" : "text-danger"}`}>
              {fmt(totals.monthlySurplus)}
            </p>
          </div>
        </div>
        <button
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[12.5px] font-medium text-text-secondary hover:text-gold hover:border-gold/50 transition-colors shrink-0"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M8.5 2L11 4.5L4.5 11H2V8.5L8.5 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
          Edit figures
        </button>
      </div>

      {editOpen && <FinanceModal onClose={() => setEditOpen(false)} />}
    </section>
  );
}

function StatCard({ label, value, tone, sub }: { label: string; value: string; tone: "personal" | "danger"; sub: string }) {
  return (
    <div className="rounded-md border border-border bg-surface2 p-3.5">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${tone === "personal" ? "bg-personal" : "bg-danger"}`} />
        <p className="text-[11.5px] font-medium text-text-secondary">{label}</p>
      </div>
      <p className="font-mono tnum text-[19px] font-semibold text-text-primary mt-1.5">{value}</p>
      <p className="text-[11px] text-text-tertiary mt-1">{sub}</p>
    </div>
  );
}
