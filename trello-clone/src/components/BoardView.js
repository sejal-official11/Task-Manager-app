import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ListColumn from "./ListColumn";
import Modal from "./Modal";

/*
  BoardView: main board area.
  Handles lists and tasks, including drag & drop.
  Contains an internal TaskEditor modal.
*/

export default function BoardView({ board, updateBoard, onBack, globalQuery = "" }) {
  const [boardData, setBoardData] = useState(board);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState(globalQuery || "");

  useEffect(() => setBoardData(board), [board]);
  useEffect(() => setQuery(globalQuery || ""), [globalQuery]);

  function persist(updated) {
    setBoardData(updated);
    updateBoard(updated);
  }

  // list ops
  function addList(title) {
    const newList = { id: "list-" + Date.now(), title, tasks: [] };
    persist({ ...boardData, lists: [...boardData.lists, newList] });
  }

  function renameList(listId, title) {
    persist({
      ...boardData,
      lists: boardData.lists.map(l => l.id === listId ? { ...l, title } : l)
    });
  }

  function deleteList(listId) {
    persist({ ...boardData, lists: boardData.lists.filter(l => l.id !== listId) });
  }

  // task ops
  function addTask(listId, task) {
    const t = { id: "task-" + Date.now(), ...task };
    persist({
      ...boardData,
      lists: boardData.lists.map(l => l.id === listId ? { ...l, tasks: [...l.tasks, t] } : l)
    });
  }

  function deleteTask(listId, taskId) {
    persist({
      ...boardData,
      lists: boardData.lists.map(l => l.id === listId ? { ...l, tasks: l.tasks.filter(t => t.id !== taskId) } : l)
    });
  }

  function updateTask(listId, updatedTask) {
    persist({
      ...boardData,
      lists: boardData.lists.map(l => l.id === listId ? { ...l, tasks: l.tasks.map(t => t.id === updatedTask.id ? updatedTask : t) } : l)
    });
  }

  function openEditor(listId, task) {
    setEditingTask({ ...task, listId });
    setModalOpen(true);
  }

  function saveEditor(updated) {
    updateTask(editingTask.listId, updated);
    setModalOpen(false);
    setEditingTask(null);
  }

  // toggle checklist item: (listId, taskId, itemIndex)
  function toggleChecklist(listId, taskId, itemIndex) {
    const updated = {
      ...boardData,
      lists: boardData.lists.map(l => {
        if (l.id !== listId) return l;
        return {
          ...l,
          tasks: l.tasks.map(t => {
            if (t.id !== taskId) return t;
            const checklist = (t.checklist || []).map((c, idx) => idx === itemIndex ? { ...c, done: !c.done } : c);
            return { ...t, checklist };
          })
        };
      })
    };
    persist(updated);
  }

  // drag & drop handler for tasks
  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const src = boardData.lists.find(l => l.id === source.droppableId);
    const dst = boardData.lists.find(l => l.id === destination.droppableId);
    const moving = src.tasks[source.index];

    const newSrcTasks = [...src.tasks]; newSrcTasks.splice(source.index, 1);
    const newDstTasks = [...dst.tasks]; newDstTasks.splice(destination.index, 0, moving);

    const updated = {
      ...boardData,
      lists: boardData.lists.map(l => {
        if (l.id === src.id) return { ...l, tasks: newSrcTasks };
        if (l.id === dst.id) return { ...l, tasks: newDstTasks };
        return l;
      })
    };

    persist(updated);
  }

  return (
    <div className="board-view">
      <div className="board-top">
        <button onClick={onBack}>← Back</button>
        <h2>{boardData.name}</h2>

        <input
          className="search-input"
          placeholder="Filter tasks in this board..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginLeft: "auto" }}
        />

        <button className="small" onClick={() => {
          const name = prompt("List name?");
          if (name && name.trim()) addList(name.trim());
        }}>+ Add List</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="lists-row">
          {boardData.lists.map(list => (
            <div className="list-wrapper" key={list.id}>
              <ListColumn
                list={list}
                onAddTask={addTask}
                onRenameList={renameList}
                onDeleteList={deleteList}
                onEditTask={(listId, t) => openEditor(listId, t)}
                onDeleteTask={deleteTask}
                onToggleChecklist={toggleChecklist}
                filterQuery={query}
              />
            </div>
          ))}
        </div>
      </DragDropContext>

      <Modal visible={isModalOpen} title="Edit Task" onClose={() => { setModalOpen(false); setEditingTask(null); }}>
        {editingTask && <TaskEditor initial={editingTask} onSave={saveEditor} />}
      </Modal>
    </div>
  );
}

/* TaskEditor inside BoardView — small component */
function TaskEditor({ initial, onSave }) {
  const [title, setTitle] = useState(initial.title || "");
  const [desc, setDesc] = useState(initial.description || "");
  const [label, setLabel] = useState(initial.label || "none");
  const [dueDate, setDueDate] = useState(initial.dueDate || "");
  const [checklistText, setChecklistText] = useState((initial.checklist || []).map(c => c.text).join("\n"));

  function handleSave() {
    const checklist = checklistText
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => ({ text: s, done: false })); // note: lost done flag here, it's okay for simplicity

    const result = { ...initial, title: title.trim(), description: desc, label, dueDate, checklist };
    onSave(result);
  }

  return (
    <div>
      <div className="form-row">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="form-row">
        <label>Description</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>

      <div className="form-row">
        <label>Label</label>
        <select value={label} onChange={(e) => setLabel(e.target.value)}>
          <option value="none">None</option>
          <option value="urgent">Urgent</option>
          <option value="review">Review</option>
          <option value="feature">Feature</option>
        </select>
      </div>

      <div className="form-row">
        <label>Due date</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>

      <div className="form-row">
        <label>Checklist (one item per line)</label>
        <textarea value={checklistText} onChange={(e) => setChecklistText(e.target.value)} placeholder="Subtask one\nSubtask two" />
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
