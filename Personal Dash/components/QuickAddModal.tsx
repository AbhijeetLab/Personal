"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useApp } from "@/lib/store";
import { Priority, Segment } from "@/lib/types";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function QuickAddModal({ onClose }: { onClose: () => void }) {
  const { addTask } = useApp();
  const [mode, setMode] = useState<"task" | "journal">("task");

  const [title, setTitle] = useState("");
  const [segment, setSegment] = useState<Segment>("work");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState(todayKey());
  const [journalText, setJournalText] = useState("");

  const canSubmit = mode === "task" ? title.trim().length > 0 : journalText.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    if (mode === "task") {
      addTask({ title: title.trim(), segment, priority, dueDate, completed: false, progress: 0 });
    }
    onClose();
  }

  return (
    <Modal
      onClose={onClose}
      title="Quick add"
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3.5 py-2 rounded-md text-[13px] font-medium text-text-secondary hover:bg-surface3 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-3.5 py-2 rounded-md text-[13px] font-semibold bg-gold text-bg hover:bg-gold-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {mode === "task" ? "Add task" : "Save entry"}
          </button>
        </div>
      }
    >
      <div className="flex gap-1 p-1 bg-surface rounded-md mb-4">
        <button
          onClick={() => setMode("task")}
          className={`flex-1 py-1.5 rounded text-[13px] font-medium transition-colors ${
            mode === "task" ? "bg-surface3 text-text-primary" : "text-text-tertiary hover:text-text-secondary"
          }`}
        >
          Task
        </button>
        <button
          onClick={() => setMode("journal")}
          className={`flex-1 py-1.5 rounded text-[13px] font-medium transition-colors ${
            mode === "journal" ? "bg-surface3 text-text-primary" : "text-text-tertiary hover:text-text-secondary"
          }`}
        >
          Journal
        </button>
      </div>

      {mode === "task" ? (
        <div className="flex flex-col gap-3.5">
          <div>
            <label className="text-[12px] text-text-secondary font-medium">Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Send follow-up email"
              className="mt-1 w-full bg-surface border border-border rounded-md px-3 py-2 text-[13.5px] focus:border-gold/60"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] text-text-secondary font-medium">Segment</label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value as Segment)}
                className="mt-1 w-full bg-surface border border-border rounded-md px-3 py-2 text-[13.5px] capitalize focus:border-gold/60"
              >
                <option value="work">Work</option>
                <option value="family">Family</option>
                <option value="personal">Personal</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] text-text-secondary font-medium">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="mt-1 w-full bg-surface border border-border rounded-md px-3 py-2 text-[13.5px] capitalize focus:border-gold/60"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[12px] text-text-secondary font-medium">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 w-full bg-surface border border-border rounded-md px-3 py-2 text-[13.5px] font-mono tnum focus:border-gold/60"
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="text-[12px] text-text-secondary font-medium">What happened today?</label>
          <textarea
            autoFocus
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            rows={5}
            placeholder="Write a quick entry…"
            className="mt-1 w-full bg-surface border border-border rounded-md px-3 py-2 text-[13.5px] focus:border-gold/60 resize-none"
          />
          <p className="mt-2 text-[11.5px] text-text-tertiary">
            Full journal history and tagging live on the Journal page — this saves a quick draft entry for today.
          </p>
        </div>
      )}
    </Modal>
  );
}
