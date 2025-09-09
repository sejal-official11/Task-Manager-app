import React, { useMemo, useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

/*
  List column: header (rename/delete), droppable area with tasks,
  and add-task input at bottom.
*/

export default function ListColumn({
  list,
  onAddTask,
  onRenameList,
  onDeleteList,
  onEditTask,
  onDeleteTask,
  onToggleChecklist,
  filterQuery = ""
}) {
  const [newTitle, setNewTitle] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(list.title);

  const q = (filterQuery || "").trim().toLowerCase();

  const visible = useMemo(() => {
    let tasks = list.tasks || [];
    if (q) {
      tasks = tasks.filter(t => {
        const hay = `${t.title} ${t.description || ""} ${t.label || ""}`.toLowerCase();
        return hay.includes(q);
      });
    }
    // sort by due date (nulls last)
    tasks = [...tasks].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    return tasks;
  }, [list.tasks, q]);

  function addTaskNow() {
    if (!newTitle.trim()) return;
    onAddTask(list.id, { title: newTitle.trim(), description: "", label: "none", dueDate: "", checklist: [] });
    setNewTitle("");
  }

  function saveRename() {
    if (!nameInput.trim()) return setRenaming(false);
    onRenameList(list.id, nameInput.trim());
    setRenaming(false);
  }

  const dragDisabled = Boolean(q); // disable drag while filtering to avoid reordering issues

  return (
    <div className="list-column">
      <div className="list-header">
        {renaming ? (
          <>
            <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
            <div>
              <button className="small" onClick={saveRename}>Save</button>
              <button className="small" onClick={() => { setRenaming(false); setNameInput(list.title); }}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h4>{list.title}</h4>
            <div>
              <button className="small" onClick={() => setRenaming(true)}>Rename</button>
              <button className="small danger" onClick={() => onDeleteList(list.id)}>Delete</button>
            </div>
          </>
        )}
      </div>

      <Droppable droppableId={list.id} type="TASK" isDropDisabled={dragDisabled}>
        {(provided) => (
          <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
            {visible.map((task, idx) => (
              <Draggable key={task.id} draggableId={task.id} index={idx} isDragDisabled={dragDisabled}>
                {(prov) => (
                  <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                    <TaskCard
                      task={task}
                      onEdit={(t) => onEditTask(list.id, t)}
                      onDelete={(taskId) => onDeleteTask(list.id, taskId)}
                      onToggleChecklist={(itemIndex) => onToggleChecklist(list.id, task.id, itemIndex)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="add-task">
        <input placeholder="New task title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <button onClick={addTaskNow}>Add</button>
      </div>
    </div>
  );
}
