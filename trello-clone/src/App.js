import React, { useEffect, useState } from "react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import BoardView from "./components/BoardView";
import { loadBoards, saveBoards } from "./utils/Storage";

/*
  App is the top-level coordinator.
  It stores boards and currentBoardId.
  I tried to keep things readable — variable names are intentionally simple.
*/

// make a board with default lists
function makeBoard(name) {
  return {
    id: "board-" + Date.now(),
    name,
    // could later add color/theme per-board
    lists: [
      { id: "list-todo", title: "To Do", tasks: [] },
      { id: "list-progress", title: "In Progress", tasks: [] },
      { id: "list-done", title: "Done", tasks: [] },
    ],
  };
}

export default function App() {
  const [boards, setBoards] = useState([]);
  const [currentBoardId, setCurrentBoardId] = useState(null);

  // small global search query passed to BoardView
  const [globalQuery, setGlobalQuery] = useState("");

  // theme handling (persisted)
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // load once
  useEffect(() => {
    const saved = loadBoards();
    if (Array.isArray(saved)) setBoards(saved);
  }, []);

  // persist boards when changed
  useEffect(() => {
    saveBoards(boards);
  }, [boards]);

  // create board
  function createBoard(name) {
    if (!name) return;
    setBoards(prev => [...prev, makeBoard(name)]);
  }

  // delete
  function deleteBoard(id) {
    setBoards(prev => prev.filter(b => b.id !== id));
    if (currentBoardId === id) setCurrentBoardId(null);
  }

  // update an existing board fully (replace)
  function updateBoard(updated) {
    setBoards(prev => prev.map(b => (b.id === updated.id ? updated : b)));
  }

  // export to JSON (download)
  function exportBoards() {
    const data = JSON.stringify(boards, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "taskly-boards.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // import (replace all)
  function importBoards(newBoards) {
    if (!Array.isArray(newBoards)) {
      alert("Invalid file format — expected array of boards.");
      return;
    }
    setBoards(newBoards);
    setCurrentBoardId(null);
  }

  // simple reorder with left/right swaps (used by sidebar)
  function moveBoard(boardId, dir = "left") {
    setBoards(prev => {
      const idx = prev.findIndex(b => b.id === boardId);
      if (idx === -1) return prev;
      const swap = dir === "left" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[swap]] = [copy[swap], copy[idx]];
      return copy;
    });
  }

  const currentBoard = boards.find(b => b.id === currentBoardId) || null;

  return (
    <div className="app fullpage">
      <Topbar
        currentBoardName={currentBoard ? currentBoard.name : null}
        onGlobalSearch={(q) => setGlobalQuery(q)}
        theme={theme}
        toggleTheme={() => setTheme(t => (t === "light" ? "dark" : "light"))}
      />

      <div className="main-area">
        <Sidebar
          boards={boards}
          openBoard={(id) => setCurrentBoardId(id)}
          createBoard={createBoard}
          deleteBoard={deleteBoard}
          moveBoardLeft={(id) => moveBoard(id, "left")}
          moveBoardRight={(id) => moveBoard(id, "right")}
          onExport={exportBoards}
          onImport={importBoards}
          theme={theme}
          toggleTheme={() => setTheme(t => (t === "light" ? "dark" : "light"))}
        />

        <main className="content">
          {currentBoard ? (
            <BoardView
              board={currentBoard}
              updateBoard={updateBoard}
              onBack={() => setCurrentBoardId(null)}
              globalQuery={globalQuery}
            />
          ) : (
            <Dashboard
              boards={boards}
              createBoard={createBoard}
              deleteBoard={deleteBoard}
              openBoard={(id) => setCurrentBoardId(id)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
