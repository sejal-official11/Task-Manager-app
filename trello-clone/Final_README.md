# Trello-like Task Manager

This is a small **Trello-style task manager** I built using React.  
It’s not a production app but more of a learning project where I tried to cover most Trello features (boards, lists, cards) and also added some bonus stuff like dark mode, search, export/import etc.

---

## Features

- Multiple **boards**
  - Create new boards
  - Delete / reorder boards (move left/right in sidebar)
  - Export boards to JSON and import back
- Inside each board you can have **lists**
  - Add new lists
  - Rename or delete them
- Inside each list you can have **tasks (cards)**
  - Add / edit / delete tasks
  - Add description, label, due date
  - Checklist with progress bar
  - Drag & drop tasks between lists
- **Search**
  - Quick global search (from the topbar)
  - Filter tasks inside a board
- **Dark mode** toggle (persists in localStorage)
- **Data persistence** with browser localStorage (no backend needed)

---

## Bonus Features I managed 

-  Dark Mode toggle (with persistence)  
-  Search bar in topbar and per-board filter  
-  Checklist support in tasks  
-  Due date field  
-  Colored labels (Urgent, Review, Feature)  
-  Export /  Import boards as JSON  
-  Reorder boards in sidebar  
- A more polished UI with glassmorphism + responsive design  

---

## Limitations

- Everything is stored in **localStorage only** → if you clear browser storage, you lose data.  
- No user accounts, no real backend. So you can’t share boards with others.  
- If you edit a task that had checklist progress, the “done” state resets (I kept it simple).  
- Drag-and-drop is disabled when filtering tasks (to avoid weird reorder bugs).  
- Importing boards **replaces everything** instead of merging.  
- Some small UI things (like toasts, confirmations) are missing — TODO for future.  

---

## Tech Stack

- React (CRA)  
- react-beautiful-dnd → for drag and drop  
- LocalStorage → for saving data  
- Plain CSS → with some glassmorphism and shadows  

---

## Getting Started

1. Clone the repo and install:
   ```bash
   git clone https://github.com/your-username/taskly.git
   cd taskly
   npm install
