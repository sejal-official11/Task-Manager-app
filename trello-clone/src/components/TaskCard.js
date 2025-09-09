import React from "react";

/*
  Task card shows title, optional desc, label badge,
  due date, checklist progress, and edit/delete buttons.

  Note: onToggleChecklist expects (index) or be bound depending on caller.
*/

const LABEL_COLORS = {
  urgent: "#ef4444",
  review: "#f59e0b",
  feature: "#10b981",
  none: "#9ca3af"
};

export default function TaskCard({ task, onEdit, onDelete, onToggleChecklist }) {
  const checklist = task.checklist || [];
  const doneCount = checklist.filter(c => c.done).length;

  return (
    <div className="task-card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1 }}>
          {task.label && task.label !== "none" && (
            <div className="label-pill" style={{ background: LABEL_COLORS[task.label] }}>
              {task.label}
            </div>
          )}

          <div className="task-title">{task.title}</div>
          {task.description && <div className="task-desc">{task.description}</div>}

          {task.dueDate && (
            <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>🗓️ Due: {task.dueDate}</div>
          )}

          {checklist.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>✅ {doneCount}/{checklist.length} subtasks</div>
              <div className="progress-bar" style={{ marginTop: 6 }}>
                <div className="progress-fill" style={{ width: `${Math.round((doneCount / checklist.length) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="small" onClick={() => onEdit(task)}>✏️</button>
          <button className="small danger" onClick={() => onDelete(task.id)}>🗑️</button>
        </div>
      </div>

      {checklist.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {checklist.slice(0, 4).map((c, idx) => (
            <label key={idx} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
              <input type="checkbox" checked={!!c.done} onChange={() => onToggleChecklist && onToggleChecklist(idx)} />
              <span style={{ textDecoration: c.done ? "line-through" : "none", color: c.done ? "#6b7280" : "inherit" }}>{c.text}</span>
            </label>
          ))}
          {checklist.length > 4 && <div style={{ fontSize: 12, color: "var(--muted)" }}>+{checklist.length - 4} more</div>}
        </div>
      )}
    </div>
  );
}
