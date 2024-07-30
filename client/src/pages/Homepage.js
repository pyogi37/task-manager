import { useNavigate } from "react-router-dom";
import { UserState } from "../Context/UserProvider";
import TaskForm from "../components/TaskForm";
import Tasks from "../components/Tasks";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

const Homepage = () => {
  const { user, tasks, setTasks } = UserState();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const addTaskToList = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Navbar */}
      {user && (
        <div className="w-full p-4 bg-black text-white shadow-md h-16 flex items-center">
          <span className="text-lg font-semibold text-purple-400">
            Welcome, {user.name} !!
          </span>
          <div className="flex-grow"></div>
          <button
            className="border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white py-2 px-4 rounded"
            onClick={logoutHandler}
          >
            Logout
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className={`flex ${isSidebarOpen ? "block" : "hidden"} h-full`}>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Main content */}

      <div className="flex-1 w-full flex bg-">
        {/* Sidebar Toggle Button */}
        <div className="h-full bg-black">
          <button
            className="text-white text-2xl ml-auto"
            onClick={toggleSidebar}
          >
            &gt;
          </button>
        </div>

        <div className="w-full h-full">
          <div className="flex-1 flex flex-col">
            {/* Taskbar */}
            <div className="pl-2 w-full bg-black">BoardName</div>

            {/* Content Area */}
            <Tasks tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
