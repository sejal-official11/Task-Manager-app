// small helper: save/load the boards to localStorage
const KEY = "trello_boards_v1";

export function loadBoards() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("loadBoards failed", err);
    return null;
  }
}

export function saveBoards(boards) {
  try {
    localStorage.setItem(KEY, JSON.stringify(boards));
  } catch (err) {
    console.warn("saveBoards failed", err);
  }
}
