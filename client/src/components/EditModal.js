import React, { useState } from "react";

const EditModal = ({ isOpen, onClose, task, onSave }) => {
  const [editedTask, setEditedTask] = useState({ ...task });

  if (!isOpen) return null; // Don't render the modal if it's not open

  const handleSaveClick = () => {
    onSave(editedTask);
    onClose();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white w-full max-w-lg mx-4 md:mx-0 p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Content</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={editedTask.content}
            onChange={(e) =>
              setEditedTask({ ...editedTask, content: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={editedTask.category}
            onChange={(e) =>
              setEditedTask({ ...editedTask, category: e.target.value })
            }
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Due Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 p-2 rounded"
            value={editedTask.dueDate}
            onChange={(e) =>
              setEditedTask({ ...editedTask, dueDate: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Priority</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={editedTask.priority}
            onChange={(e) =>
              setEditedTask({ ...editedTask, priority: e.target.value })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleSaveClick}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
