import React from "react";

/*
  Minimal dashboard / welcome view.
  Shows quick create button + list of boards if any.
*/

export default function Dashboard({ boards, createBoard, deleteBoard, openBoard }) {
  return (
    <div className="dashboard-empty">
      <div className="welcome-box">
        <h1>Welcome to Taskly</h1>
        <p className="muted">A small Trello-like app — local only.</p>

        <div style={{ marginTop: 14 }}>
          <button onClick={() => {
            const name = prompt("Board name?");
            if (name && name.trim()) createBoard(name.trim());
          }}>
            Create first board
          </button>
        </div>
      </div>

      {boards.length > 0 && (
        <section style={{ marginTop: 22 }}>
          <h3>Your boards</h3>
          <div className="boards-grid">
            {boards.map(b => (
              <div className="board-card" key={b.id}>
                <h4 style={{ margin: 0 }}>{b.name}</h4>
                <div className="card-actions" style={{ marginTop: 8 }}>
                  <button onClick={() => openBoard(b.id)}>Open</button>
                  <button className="danger" onClick={() => { if (window.confirm("Delete board?")) deleteBoard(b.id); }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
