import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
        <button
          onClick={onClose}
          className=" top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          X
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
