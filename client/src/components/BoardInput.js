// BoardInputModal.js
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const BoardInputModal = ({ isOpen, onClose, onSubmit }) => {
  const [boardName, setBoardName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (boardName.trim()) {
      onSubmit(boardName);
      setBoardName(""); // Clear input field after submission
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white border border-gray-400 rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Enter new board name:</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="border border-gray-300 rounded py-2 px-4 w-full"
            placeholder="Board Name"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default BoardInputModal;
