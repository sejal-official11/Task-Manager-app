import React, { useRef, useState } from "react";

/*
  Sidebar: lists boards, create, import/export, reorder/delete.
  I kept some inline behavior for readability — a real app might extract helpers.
*/

export default function Sidebar({
  boards = [],
  openBoard,
  createBoard,
  deleteBoard,
  moveBoardLeft,
  moveBoardRight,
  onExport,
  onImport,
  theme,
  toggleTheme,
}) {
  const [name, setName] = useState("");
  const fileInput = useRef(null);

  function submitCreate(e) {
    e?.preventDefault();
    if (!name.trim()) return;
    createBoard(name.trim());
    setName("");
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (Array.isArray(parsed)) {
          if (window.confirm("Replace all boards with imported data?")) {
            onImport(parsed);
          }
        } else {
          alert("Invalid JSON format (expected array).");
        }
      } catch (err) {
        alert("Could not parse JSON file.");
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  return (
    <aside className="sidebar pro-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Your Boards</h2>
        <button className="icon-btn small" onClick={toggleTheme}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      <form className="create-board" onSubmit={submitCreate}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New board name" />
        <button type="submit">➕</button>
      </form>

      <div className="sidebar-tools">
        <button className="small" onClick={onExport}>📤 Export</button>
        <button className="small" onClick={() => fileInput.current?.click()}>📥 Import</button>
        <input ref={fileInput} type="file" accept="application/json" style={{ display: "none" }} onChange={handleFile} />
      </div>

      <div className="boards-list">
        {boards.length === 0 && <div className="empty small">No boards yet</div>}
        {boards.map((b, i) => (
          <div key={b.id} className="board-item">
            <div className="board-name" onClick={() => openBoard(b.id)}>📋 {b.name}</div>
            <div className="board-actions">
              <button className="small" disabled={i === 0} onClick={() => moveBoardLeft(b.id)}>←</button>
              <button className="small" disabled={i === boards.length - 1} onClick={() => moveBoardRight(b.id)}>→</button>
              <button className="small danger" onClick={() => { if (window.confirm("Delete board?")) deleteBoard(b.id); }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <small>📌 Local-only • No backend</small>
      </div>
    </aside>
  );
}
