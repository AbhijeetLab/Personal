"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { Segment, SEGMENT_META, Task } from "@/lib/types";
import TaskModal from "./TaskModal";

const SEGMENTS: Segment[] = ["work", "family", "personal"];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

const PRIORITY_RANK: Record<Task["priority"], number> = { high: 0, medium: 1, low: 2 };

export default function TodoOverviewWidget() {
  const { tasks } = useApp();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [mobileTab, setMobileTab] = useState<Segment>("work");

  return (
    <section className="rounded-lg border border-border bg-surface shadow-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-display font-semibold text-[16px]">To-do overview</h3>
          <p className="text-[12px] text-text-secondary mt-0.5">Top priorities across every part of your day</p>
        </div>
      </div>

      {/* Mobile segment switcher */}
      <div className="flex gap-1 p-1 bg-surface2 rounded-md my-4 sm:hidden">
        {SEGMENTS.map((s) => {
          const meta = SEGMENT_META[s];
          return (
            <button
              key={s}
              onClick={() => setMobileTab(s)}
              className={`flex-1 py-1.5 rounded text-[12.5px] font-medium transition-colors ${
                mobileTab === s ? "bg-surface3 text-text-primary" : "text-text-tertiary"
              }`}
              style={mobileTab === s ? { boxShadow: `inset 0 -2px 0 ${meta.color}` } : undefined}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 sm:mt-5">
        {SEGMENTS.map((segment) => (
          <SegmentColumn
            key={segment}
            segment={segment}
            tasks={tasks.filter((t) => t.segment === segment)}
            onSelect={setActiveTask}
            className={segment === mobileTab ? "flex" : "hidden sm:flex"}
          />
        ))}
      </div>

      {activeTask && <TaskModal task={activeTask} onClose={() => setActiveTask(null)} />}
    </section>
  );
}

function SegmentColumn({
  segment,
  tasks,
  onSelect,
  className,
}: {
  segment: Segment;
  tasks: Task[];
  onSelect: (t: Task) => void;
  className?: string;
}) {
  const { addTask } = useApp();
  const meta = SEGMENT_META[segment];
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  const sorted = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          if (a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate);
          return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
        })
        .slice(0, 5),
    [tasks]
  );

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const avgProgress = total ? Math.round(tasks.reduce((a, t) => a + t.progress, 0) / total) : 0;

  function submitDraft() {
    if (!draft.trim()) {
      setAdding(false);
      return;
    }
    addTask({ title: draft.trim(), segment, priority: "medium", dueDate: todayKey(), completed: false, progress: 0 });
    setDraft("");
  }

  return (
    <div className={`flex-col rounded-md border border-border bg-surface2 overflow-hidden ${className ?? "flex"}`}>
      <div className="px-3.5 pt-3.5 pb-3 border-b border-border/70" style={{ borderTopColor: meta.color, borderTopWidth: 2 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
            <span className="text-[13px] font-semibold text-text-primary">{meta.label}</span>
          </div>
          <span className="text-[11px] font-mono tnum text-text-tertiary">
            {done}/{total}
          </span>
        </div>
        <div className="mt-2.5 h-1.5 rounded-full bg-surface3 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${avgProgress}%`, backgroundColor: meta.color }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1.5 p-2.5 min-h-[120px]">
        {sorted.length === 0 && !adding && <p className="text-[12px] text-text-tertiary px-1.5 py-3">Nothing queued. Add a task below.</p>}
        {sorted.map((task) => (
          <TaskRow key={task.id} task={task} onSelect={() => onSelect(task)} />
        ))}
      </div>

      <div className="p-2.5 pt-0">
        {adding ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={submitDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitDraft();
              if (e.key === "Escape") {
                setDraft("");
                setAdding(false);
              }
            }}
            placeholder="Task title…"
            className="w-full bg-surface border border-border rounded-md px-2.5 py-2 text-[12.5px] focus:border-gold/60"
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full flex items-center justify-center gap-1.5 rounded-md border border-dashed border-border py-2 text-[12px] font-medium text-text-tertiary hover:text-text-primary hover:border-borderLight transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Add task
          </button>
        )}
      </div>
    </div>
  );
}

function TaskRow({ task, onSelect }: { task: Task; onSelect: () => void }) {
  const { toggleTask } = useApp();
  const meta = SEGMENT_META[task.segment];
  const isOverdue = !task.completed && task.dueDate < todayKey();
  const isToday = task.dueDate === todayKey();

  return (
    <div
      className={`group flex items-start gap-2.5 rounded-md px-2 py-2 hover:bg-surface3 cursor-pointer transition-colors ${
        task.completed ? "opacity-50" : ""
      }`}
      onClick={onSelect}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onClick={(e) => e.stopPropagation()}
        onChange={() => toggleTask(task.id)}
        className="task-checkbox mt-0.5"
        aria-label={`Mark "${task.title}" complete`}
      />
      <div className="min-w-0 flex-1">
        <p className={`text-[13px] text-text-primary leading-snug truncate ${task.completed ? "line-through" : ""}`}>{task.title}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <PriorityTag priority={task.priority} />
          <span className={`text-[10.5px] font-mono tnum ${isOverdue ? "text-danger" : "text-text-tertiary"}`}>
            {isOverdue ? "Overdue" : isToday ? "Today" : task.dueDate.slice(5)}
          </span>
        </div>
        {!task.completed && (
          <div className="h-1 rounded-full bg-surface3 overflow-hidden mt-1.5">
            <div className="h-full rounded-full" style={{ width: `${task.progress}%`, backgroundColor: meta.color }} />
          </div>
        )}
      </div>
      {task.comments.length > 0 && (
        <span className="flex items-center gap-0.5 text-text-tertiary text-[10.5px] shrink-0 mt-0.5">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 2.5H10C10.3 2.5 10.5 2.7 10.5 3V7.5C10.5 7.8 10.3 8 10 8H4.5L2.5 9.7C2.3 9.9 2 9.7 2 9.4V8H2C1.7 8 1.5 7.8 1.5 7.5V3C1.5 2.7 1.7 2.5 2 2.5Z" stroke="currentColor" strokeWidth="1.1" />
          </svg>
          {task.comments.length}
        </span>
      )}
    </div>
  );
}

function PriorityTag({ priority }: { priority: Task["priority"] }) {
  const styles: Record<Task["priority"], string> = {
    high: "text-danger bg-danger/10",
    medium: "text-family bg-family/10",
    low: "text-text-tertiary bg-surface3",
  };
  return <span className={`text-[9.5px] font-semibold uppercase tracking-wide px-1.5 py-[1px] rounded ${styles[priority]}`}>{priority}</span>;
}
