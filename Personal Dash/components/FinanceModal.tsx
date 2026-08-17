"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useApp } from "@/lib/store";
import { LineItem } from "@/lib/types";

type Category = "assets" | "liabilities" | "stocks" | "crypto";

const TABS: { key: "cashflow" | Category; label: string }[] = [
  { key: "cashflow", label: "Cash flow" },
  { key: "assets", label: "Assets" },
  { key: "stocks", label: "Stocks" },
  { key: "crypto", label: "Crypto" },
  { key: "liabilities", label: "Liabilities" },
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function FinanceModal({ onClose }: { onClose: () => void }) {
  const { finance, updateFinanceScalar, addLineItem, updateLineItem, removeLineItem, totals } = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("cashflow");

  return (
    <Modal onClose={onClose} title="Edit your figures" width="max-w-lg" footer={<FooterSummary />}>
      <div className="flex gap-1 p-1 bg-surface rounded-md mb-4 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap px-3 py-1.5 rounded text-[12.5px] font-medium transition-colors ${
              tab === t.key ? "bg-surface3 text-text-primary" : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "cashflow" && (
        <div className="flex flex-col gap-3.5">
          <ScalarField
            label="Monthly income"
            hint="Take-home pay, side income, all sources"
            value={finance.monthlyIncome}
            onChange={(v) => updateFinanceScalar("monthlyIncome", v)}
          />
          <ScalarField
            label="Monthly expense"
            hint="Rent, bills, subscriptions, spending"
            value={finance.monthlyExpense}
            onChange={(v) => updateFinanceScalar("monthlyExpense", v)}
          />
          <ScalarField
            label="Savings balance"
            hint="Cash sitting in savings accounts"
            value={finance.savingsBalance}
            onChange={(v) => updateFinanceScalar("savingsBalance", v)}
          />
        </div>
      )}

      {tab !== "cashflow" && (
        <LineItemEditor
          category={tab}
          items={finance[tab]}
          onAdd={(item) => addLineItem(tab, item)}
          onUpdate={(id, patch) => updateLineItem(tab, id, patch)}
          onRemove={(id) => removeLineItem(tab, id)}
        />
      )}
    </Modal>
  );

  function FooterSummary() {
    return (
      <div className="flex items-center justify-between">
        <div className="text-[12.5px] text-text-secondary">
          Net worth <span className="font-mono tnum font-semibold text-text-primary ml-1">{fmt(totals.netWorth)}</span>
        </div>
        <button onClick={onClose} className="px-4 py-2 rounded-md text-[13px] font-semibold bg-gold text-bg hover:bg-gold-bright transition-colors">
          Done
        </button>
      </div>
    );
  }
}

function ScalarField({ label, hint, value, onChange }: { label: string; hint: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-[12.5px] font-medium text-text-primary">{label}</label>
      <p className="text-[11px] text-text-tertiary mb-1.5">{hint}</p>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-[13.5px] font-mono">$</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-surface border border-border rounded-md pl-7 pr-3 py-2 text-[13.5px] font-mono tnum focus:border-gold/60"
        />
      </div>
    </div>
  );
}

const CATEGORY_META: Record<Category, { placeholder: string; addLabel: string; empty: string }> = {
  assets: { placeholder: "e.g. Car, property, checking account", addLabel: "Add asset", empty: "No assets added yet." },
  liabilities: { placeholder: "e.g. Car loan, credit card balance", addLabel: "Add liability", empty: "No liabilities added yet — nicely done." },
  stocks: { placeholder: "e.g. VOO, AAPL, TSLA", addLabel: "Add holding", empty: "No stock holdings added yet." },
  crypto: { placeholder: "e.g. BTC, ETH, SOL", addLabel: "Add holding", empty: "No crypto holdings added yet." },
};

function LineItemEditor({
  category,
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  category: Category;
  items: LineItem[];
  onAdd: (item: Omit<LineItem, "id">) => void;
  onUpdate: (id: string, patch: Partial<LineItem>) => void;
  onRemove: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const meta = CATEGORY_META[category];
  const subtotal = items.reduce((a, i) => a + (Number(i.value) || 0), 0);

  function handleAdd() {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), value: Number(value) || 0 });
    setName("");
    setValue("");
  }

  return (
    <div>
      <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-0.5">
        {items.length === 0 && <p className="text-[12.5px] text-text-tertiary py-3">{meta.empty}</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 bg-surface border border-border rounded-md px-2.5 py-2">
            <input
              value={item.name}
              onChange={(e) => onUpdate(item.id, { name: e.target.value })}
              className="flex-1 bg-transparent text-[13px] text-text-primary focus:outline-none min-w-0"
            />
            <div className="relative w-28 shrink-0">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-tertiary text-[12px] font-mono">$</span>
              <input
                type="number"
                value={item.value}
                onChange={(e) => onUpdate(item.id, { value: Number(e.target.value) })}
                className="w-full bg-transparent pl-5 pr-1 text-[13px] font-mono tnum text-text-primary focus:outline-none"
              />
            </div>
            <button onClick={() => onRemove(item.id)} className="w-6 h-6 shrink-0 grid place-content-center rounded text-text-tertiary hover:text-danger hover:bg-danger/10 transition-colors" aria-label="Remove">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/70">
        <span className="text-[11.5px] text-text-tertiary uppercase tracking-wide">Subtotal</span>
        <span className="font-mono tnum text-[13.5px] font-semibold text-text-primary">{fmt(subtotal)}</span>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={meta.placeholder}
          className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-[13px] focus:border-gold/60 min-w-0"
        />
        <div className="relative w-28 shrink-0">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary text-[12.5px] font-mono">$</span>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="0"
            className="w-full bg-surface border border-border rounded-md pl-6 pr-2 py-2 text-[13px] font-mono tnum focus:border-gold/60"
          />
        </div>
        <button onClick={handleAdd} className="shrink-0 rounded-md bg-surface3 border border-border px-3 py-2 text-[12.5px] font-medium text-text-primary hover:border-gold/50 hover:text-gold transition-colors">
          {meta.addLabel}
        </button>
      </div>
    </div>
  );
}
