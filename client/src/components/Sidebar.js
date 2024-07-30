import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-15 left-0 h-full w-64 bg-gray-800 text-white shadow-md transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300`}
    >
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={onClose}
      >
        &times;
      </button>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Menu</h2>
        <ul>
          <li>
            <Link
              to="/home"
              className="block py-2 px-4 text-gray-300 hover:bg-gray-700 rounded"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              className="block py-2 px-4 text-gray-300 hover:bg-gray-700 rounded"
            >
              Tasks
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="block py-2 px-4 text-gray-300 hover:bg-gray-700 rounded"
            >
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
