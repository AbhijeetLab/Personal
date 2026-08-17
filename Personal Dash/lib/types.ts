export type Segment = "work" | "family" | "personal";
export type Priority = "high" | "medium" | "low";

export interface Comment {
  id: string;
  text: string;
  createdAt: string; // ISO
}

export interface Task {
  id: string;
  segment: Segment;
  title: string;
  priority: Priority;
  dueDate: string; // yyyy-mm-dd
  completed: boolean;
  progress: number; // 0-100
  comments: Comment[];
  createdAt: string;
}

export interface LineItem {
  id: string;
  name: string;
  value: number;
}

export interface FinanceSnapshot {
  label: string; // e.g. "Aug 17"
  dateKey: string; // yyyy-mm-dd, used to dedupe same-day snapshots
  netWorth: number;
}

export interface FinanceState {
  monthlyIncome: number;
  monthlyExpense: number;
  savingsBalance: number;
  assets: LineItem[];
  liabilities: LineItem[];
  stocks: LineItem[];
  crypto: LineItem[];
  history: FinanceSnapshot[];
}

export const SEGMENT_META: Record<
  Segment,
  { label: string; color: string; dim: string; textClass: string; bgClass: string; borderClass: string; dimBgClass: string }
> = {
  work: {
    label: "Work",
    color: "#5B8DEF",
    dim: "#1B2439",
    textClass: "text-work",
    bgClass: "bg-work",
    borderClass: "border-work",
    dimBgClass: "bg-work-dim",
  },
  family: {
    label: "Family",
    color: "#F0A93A",
    dim: "#332510",
    textClass: "text-family",
    bgClass: "bg-family",
    borderClass: "border-family",
    dimBgClass: "bg-family-dim",
  },
  personal: {
    label: "Personal",
    color: "#4ADE80",
    dim: "#132A1D",
    textClass: "text-personal",
    bgClass: "bg-personal",
    borderClass: "border-personal",
    dimBgClass: "bg-personal-dim",
  },
};
