"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useApp } from "@/lib/store";
import { Priority, Segment, Task, SEGMENT_META } from "@/lib/types";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function TaskModal({ task, onClose }: { task: Task; onClose: () => void }) {
  const { updateTask, deleteTask, addComment, deleteComment } = useApp();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [commentText, setCommentText] = useState("");
  const meta = SEGMENT_META[task.segment];

  function handleDelete() {
    deleteTask(task.id);
    onClose();
  }

  function handleAddComment() {
    if (!commentText.trim()) return;
    addComment(task.id, commentText);
    setCommentText("");
  }

  return (
    <Modal
      onClose={onClose}
      title="Task details"
      width="max-w-lg"
      footer={
        <div className="flex items-center justify-between">
          {confirmDelete ? (
            <div className="flex items-center gap-2 text-[12.5px]">
              <span className="text-text-secondary">Delete this task?</span>
              <button onClick={handleDelete} className="px-2.5 py-1 rounded bg-danger text-white font-semibold">
                Delete
              </button>
              <button onClick={() => setConfirmDelete(false)} className="px-2.5 py-1 rounded text-text-secondary hover:bg-surface3">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 text-[12.5px] font-medium text-danger hover:text-danger/80 transition-colors">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2.5 3.5H10.5M5 3.5V2.2C5 1.9 5.3 1.6 5.6 1.6H7.4C7.7 1.6 8 1.9 8 2.2V3.5M4 3.5V10.4C4 10.7 4.3 11 4.6 11H8.4C8.7 11 9 10.7 9 10.4V3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Delete task
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 rounded-md text-[13px] font-semibold bg-gold text-bg hover:bg-gold-bright transition-colors">
            Done
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[12px] text-text-secondary font-medium">Title</label>
          <input
            value={task.title}
            onChange={(e) => updateTask(task.id, { title: e.target.value })}
            className="mt-1 w-full bg-surface border border-border rounded-md px-3 py-2 text-[14px] font-medium focus:border-gold/60"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[12px] text-text-secondary font-medium">Segment</label>
            <select
              value={task.segment}
              onChange={(e) => updateTask(task.id, { segment: e.target.value as Segment })}
              className="mt-1 w-full bg-surface border border-border rounded-md px-2.5 py-2 text-[13px] capitalize focus:border-gold/60"
            >
              <option value="work">Work</option>
              <option value="family">Family</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] text-text-secondary font-medium">Priority</label>
            <select
              value={task.priority}
              onChange={(e) => updateTask(task.id, { priority: e.target.value as Priority })}
              className="mt-1 w-full bg-surface border border-border rounded-md px-2.5 py-2 text-[13px] capitalize focus:border-gold/60"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] text-text-secondary font-medium">Due</label>
            <input
              type="date"
              value={task.dueDate}
              onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
              className="mt-1 w-full bg-surface border border-border rounded-md px-2 py-2 text-[12.5px] font-mono tnum focus:border-gold/60"
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input type="checkbox" checked={task.completed} onChange={() => updateTask(task.id, { completed: !task.completed, progress: !task.completed ? 100 : task.progress })} className="task-checkbox" />
          <span className="text-[13px] text-text-secondary">Mark as complete</span>
        </label>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-[12px] text-text-secondary font-medium">Progress</label>
            <span className="font-mono tnum text-[12.5px]" style={{ color: meta.color }}>
              {task.progress}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={task.progress}
            onChange={(e) => {
              const v = Number(e.target.value);
              updateTask(task.id, { progress: v, completed: v === 100 });
            }}
            className="w-full mt-2"
          />
        </div>

        <div className="pt-1 border-t border-border">
          <p className="text-[12px] text-text-secondary font-medium mt-3 mb-2">Comments</p>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {task.comments.length === 0 && <p className="text-[12.5px] text-text-tertiary">No comments yet.</p>}
            {task.comments.map((c) => (
              <div key={c.id} className="group bg-surface border border-border rounded-md px-3 py-2 flex items-start justify-between gap-2">
                <div>
                  <p className="text-[13px] text-text-primary leading-snug">{c.text}</p>
                  <p className="text-[10.5px] text-text-tertiary mt-1">{timeAgo(c.createdAt)}</p>
                </div>
                <button
                  onClick={() => deleteComment(task.id, c.id)}
                  className="opacity-0 group-hover:opacity-100 shrink-0 w-5 h-5 grid place-content-center rounded text-text-tertiary hover:text-danger transition-opacity"
                  aria-label="Delete comment"
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2.5">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="Add a comment…"
              className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-[13px] focus:border-gold/60"
            />
            <button onClick={handleAddComment} className="shrink-0 rounded-md bg-surface3 border border-border px-3 py-2 text-[12.5px] font-medium hover:border-gold/50 hover:text-gold transition-colors">
              Post
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
