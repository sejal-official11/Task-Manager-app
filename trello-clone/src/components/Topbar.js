import React from "react";

/*
  Topbar: logo, subtitle, center search, theme toggle and avatar.
  Kept simple — does not manage search logic, just forwards query up.
*/

export default function Topbar({ currentBoardName, onGlobalSearch, theme, toggleTheme }) {
  return (
    <header className="topbar pro-topbar">
      <div className="topbar-left">
        <div className="logo-wrap">
          <div className="logo-mark" aria-hidden>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="8" height="12" rx="2" fill="#3b82f6"/>
              <rect x="14" y="7" width="8" height="10" rx="2" fill="#60a5fa"/>
            </svg>
          </div>
          <div className="logo-text">Taskly</div>
        </div>

        <div className="top-subtitle">
          {currentBoardName ? `Board: ${currentBoardName}` : "Organize your work — simple & local"}
        </div>
      </div>

      <div className="topbar-center">
        <div className="search-box">
          <input
            placeholder="Search tasks, titles, labels..."
            onChange={(e) => onGlobalSearch && onGlobalSearch(e.target.value)}
            aria-label="Search tasks"
          />
          <button className="search-btn" aria-hidden>🔎</button>
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn small" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <div className="avatar" title="You">
          <span>SG</span>
        </div>
      </div>
    </header>
  );
}
