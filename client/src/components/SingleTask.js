import React, { useState } from "react";
import EditModal from "./EditModal";

const SingleTask = ({ task, onDelete, onEdit, onMarkDone, onMarkUndone }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (editedTask) => {
    console.log("edited task", editedTask);
    onEdit(editedTask);
    setIsEditModalOpen(false);
  };

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const bgColor = task.done ? "#f3e6ff" : "aliceblue";

  return (
    <li className={`m-2 w-full ${bgColor} rounded-lg`}>
      <div className="flex flex-col p-2">
        <div className="flex justify-between">
          <p className="m-2 font-semibold w-1/2 text-black">{task.content}</p>
          <p className="m-2 text-yellow-800 font-semibold">
            {new Date(task.dueDate).toLocaleDateString("en-US", options)}
          </p>
          <p className="m-2 text-yellow-800 font-semibold">{task.priority}</p>
        </div>
        <div className="w-full flex justify-end">
          <button
            className="ml-2 px-4 py-2 border border-gray-300 rounded-md bg-transparent hover:bg-gray-100"
            onClick={handleEditClick}
          >
            Edit
          </button>
          {task.done ? (
            <button
              className="ml-2 px-4 py-2 border border-gray-300 rounded-md bg-transparent hover:bg-gray-100"
              onClick={onMarkUndone}
            >
              Mark Undone
            </button>
          ) : (
            <button
              className="ml-2 px-4 py-2 border border-gray-300 rounded-md bg-transparent hover:bg-gray-100"
              onClick={onMarkDone}
            >
              Mark Done
            </button>
          )}
          <button
            className="ml-2 px-4 py-2 border border-gray-300 rounded-md bg-transparent hover:bg-gray-100"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(editedTask) => handleSaveEdit(editedTask)}
      />
    </li>
  );
};

export default SingleTask;
