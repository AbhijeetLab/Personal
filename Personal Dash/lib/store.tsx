"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Comment, FinanceSnapshot, FinanceState, LineItem, Priority, Segment, Task } from "./types";

const TODOS_KEY = "dashboard.todos.v1";
const FINANCE_KEY = "dashboard.finance.v1";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ---------- Seed data (first-run demo state) ----------

function seedTasks(): Task[] {
  const now = new Date().toISOString();
  return [
    { id: uid(), segment: "work", title: "Ship Q3 investor deck", priority: "high", dueDate: todayKey(), completed: false, progress: 70, comments: [{ id: uid(), text: "Waiting on final revenue chart from Priya.", createdAt: now }], createdAt: now },
    { id: uid(), segment: "work", title: "Review pull request #482", priority: "medium", dueDate: todayKey(), completed: false, progress: 30, comments: [], createdAt: now },
    { id: uid(), segment: "work", title: "1:1 with design lead", priority: "low", dueDate: addDays(1), completed: false, progress: 0, comments: [], createdAt: now },
    { id: uid(), segment: "family", title: "Book pediatrician appointment", priority: "high", dueDate: todayKey(), completed: false, progress: 20, comments: [], createdAt: now },
    { id: uid(), segment: "family", title: "Pay school activity fee", priority: "medium", dueDate: todayKey(), completed: true, progress: 100, comments: [], createdAt: now },
    { id: uid(), segment: "family", title: "Plan weekend grocery run", priority: "low", dueDate: addDays(2), completed: false, progress: 10, comments: [], createdAt: now },
    { id: uid(), segment: "personal", title: "Morning 5k run", priority: "medium", dueDate: todayKey(), completed: false, progress: 0, comments: [], createdAt: now },
    { id: uid(), segment: "personal", title: "Finish chapter 6 of book", priority: "low", dueDate: todayKey(), completed: false, progress: 45, comments: [{ id: uid(), text: "Getting good near the climax.", createdAt: now }], createdAt: now },
    { id: uid(), segment: "personal", title: "Renew passport", priority: "high", dueDate: addDays(5), completed: false, progress: 5, comments: [], createdAt: now },
  ];
}

function seedFinance(): FinanceState {
  const history: FinanceSnapshot[] = [
    { label: "Mar", dateKey: "seed-1", netWorth: 68400 },
    { label: "Apr", dateKey: "seed-2", netWorth: 71200 },
    { label: "May", dateKey: "seed-3", netWorth: 74900 },
    { label: "Jun", dateKey: "seed-4", netWorth: 79650 },
    { label: "Jul", dateKey: "seed-5", netWorth: 83100 },
  ];
  return {
    monthlyIncome: 8200,
    monthlyExpense: 5100,
    savingsBalance: 18500,
    assets: [
      { id: uid(), name: "Checking account", value: 4200 },
      { id: uid(), name: "Car (resale value)", value: 12000 },
    ],
    liabilities: [
      { id: uid(), name: "Car loan", value: 6800 },
      { id: uid(), name: "Credit card balance", value: 1200 },
    ],
    stocks: [
      { id: uid(), name: "VOO", value: 22400 },
      { id: uid(), name: "AAPL", value: 6100 },
    ],
    crypto: [
      { id: uid(), name: "BTC", value: 9800 },
      { id: uid(), name: "ETH", value: 3200 },
    ],
    history,
  };
}

// ---------- Types for context value ----------

type LineItemCategory = "assets" | "liabilities" | "stocks" | "crypto";

interface AppContextValue {
  tasks: Task[];
  addTask: (t: Omit<Task, "id" | "createdAt" | "comments">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addComment: (taskId: string, text: string) => void;
  deleteComment: (taskId: string, commentId: string) => void;

  finance: FinanceState;
  updateFinanceScalar: (field: "monthlyIncome" | "monthlyExpense" | "savingsBalance", value: number) => void;
  addLineItem: (category: LineItemCategory, item: Omit<LineItem, "id">) => void;
  updateLineItem: (category: LineItemCategory, id: string, patch: Partial<LineItem>) => void;
  removeLineItem: (category: LineItemCategory, id: string) => void;

  totals: {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    monthlySurplus: number;
    prevNetWorth: number | null;
    deltaPct: number | null;
  };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [finance, setFinance] = useState<FinanceState>(seedFinance());
  const hydrated = useRef(false);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    try {
      const t = window.localStorage.getItem(TODOS_KEY);
      const f = window.localStorage.getItem(FINANCE_KEY);
      setTasks(t ? JSON.parse(t) : seedTasks());
      setFinance(f ? JSON.parse(f) : seedFinance());
    } catch {
      setTasks(seedTasks());
      setFinance(seedFinance());
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(TODOS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(FINANCE_KEY, JSON.stringify(finance));
  }, [finance]);

  // ---------- Task actions ----------

  const addTask: AppContextValue["addTask"] = (t) => {
    setTasks((prev) => [
      { ...t, id: uid(), createdAt: new Date().toISOString(), comments: [] },
      ...prev,
    ]);
  };

  const updateTask: AppContextValue["updateTask"] = (id, patch) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  };

  const deleteTask: AppContextValue["deleteTask"] = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTask: AppContextValue["toggleTask"] = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, progress: !task.completed ? 100 : task.progress }
          : task
      )
    );
  };

  const addComment: AppContextValue["addComment"] = (taskId, text) => {
    if (!text.trim()) return;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, { id: uid(), text: text.trim(), createdAt: new Date().toISOString() }] }
          : task
      )
    );
  };

  const deleteComment: AppContextValue["deleteComment"] = (taskId, commentId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, comments: task.comments.filter((c) => c.id !== commentId) } : task
      )
    );
  };

  // ---------- Finance actions ----------

  const updateFinanceScalar: AppContextValue["updateFinanceScalar"] = (field, value) => {
    setFinance((prev) => ({ ...prev, [field]: value }));
  };

  const addLineItem: AppContextValue["addLineItem"] = (category, item) => {
    setFinance((prev) => ({ ...prev, [category]: [...prev[category], { ...item, id: uid() }] }));
  };

  const updateLineItem: AppContextValue["updateLineItem"] = (category, id, patch) => {
    setFinance((prev) => ({
      ...prev,
      [category]: prev[category].map((li) => (li.id === id ? { ...li, ...patch } : li)),
    }));
  };

  const removeLineItem: AppContextValue["removeLineItem"] = (category, id) => {
    setFinance((prev) => ({ ...prev, [category]: prev[category].filter((li) => li.id !== id) }));
  };

  // ---------- Derived totals ----------

  const totals = useMemo(() => {
    const sum = (items: LineItem[]) => items.reduce((acc, i) => acc + (Number(i.value) || 0), 0);
    const totalAssets = finance.savingsBalance + sum(finance.assets) + sum(finance.stocks) + sum(finance.crypto);
    const totalLiabilities = sum(finance.liabilities);
    const netWorth = totalAssets - totalLiabilities;
    const monthlySurplus = finance.monthlyIncome - finance.monthlyExpense;
    const priorEntries = finance.history.filter((h) => h.dateKey !== todayKey());
    const prevNetWorth = priorEntries.length ? priorEntries[priorEntries.length - 1].netWorth : null;
    const deltaPct = prevNetWorth ? ((netWorth - prevNetWorth) / Math.abs(prevNetWorth)) * 100 : null;
    return { totalAssets, totalLiabilities, netWorth, monthlySurplus, prevNetWorth, deltaPct };
  }, [finance]);

  // Upsert today's snapshot into history whenever net worth changes
  useEffect(() => {
    if (!hydrated.current) return;
    setFinance((prev) => {
      const key = todayKey();
      const existingIdx = prev.history.findIndex((h) => h.dateKey === key);
      const sum = (items: LineItem[]) => items.reduce((acc, i) => acc + (Number(i.value) || 0), 0);
      const netWorth =
        prev.savingsBalance + sum(prev.assets) + sum(prev.stocks) + sum(prev.crypto) - sum(prev.liabilities);

      if (existingIdx >= 0) {
        if (prev.history[existingIdx].netWorth === netWorth) return prev;
        const next = [...prev.history];
        next[existingIdx] = { ...next[existingIdx], netWorth };
        return { ...prev, history: next };
      }
      const next = [...prev.history, { label: todayLabel(), dateKey: key, netWorth }].slice(-14);
      return { ...prev, history: next };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finance.monthlyIncome, finance.monthlyExpense, finance.savingsBalance, finance.assets, finance.liabilities, finance.stocks, finance.crypto]);

  const value: AppContextValue = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addComment,
    deleteComment,
    finance,
    updateFinanceScalar,
    addLineItem,
    updateLineItem,
    removeLineItem,
    totals,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export type { Segment, Priority, Task, Comment, LineItem, LineItemCategory };
