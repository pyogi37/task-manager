import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserState } from "../Context/UserProvider";
import axios from "axios";
import TaskList from "../components/TaskList";
import { closestCorners, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { toast } from "react-toastify";
import Task from "../components/Task";
import Modal from "../components/Modal";

const Homepage = () => {
  const { user, boards, setBoards } = UserState() || {};
  const navigate = useNavigate();
  const [selectedBoard, setSelectedBoard] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [avatar, setAvatar] = useState();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const [selectedTask, setSelectedTask] = useState(null); // State for selected task in modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const avatar_address = JSON.parse(localStorage.getItem("avatar"));
    if (avatar_address) {
      setAvatar(avatar_address);
    }
  }, [navigate]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const addBoard = async (boardName) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post(
        "/api/v1/users/boards",
        { boardName },
        config
      );

      if (response.data) {
        setBoards([...boards, response.data.data.board]);
        toast.success("Board added");
      }
      setSelectedBoard(boards.length);
    } catch (error) {
      toast.error(`Error occurred: ${error.response.data.message}`);
    }
  };

  const handleBoardChange = (e) => {
    setSelectedBoard(parseInt(e.target.value));
  };

  const fetchTasks = async () => {
    if (!boards || boards.length === 0) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.get(
        `/api/v1/users/tasks/${boards[selectedBoard]._id}`,
        config
      );

      if (response.data) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      toast.error(`Error occurred: ${error.response.data.message}`);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedBoard, navigate, boards]);

  const refetchTasks = async () => {
    fetchTasks();
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      console.log(active, over);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        await axios.patch(
          `/api/v1/tasks/move`,
          { from: active.id, to: over.id },
          config
        );

        fetchTasks();
      } catch (error) {
        toast.error(`Error occurred: ${error.response.data.message}`);
      }
    }
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  const handleProfileEdit = () => {
    navigate("/profile");
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };
  const handleTaskClick = (task) => {
    console.log("task clicked");
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const deleteBoard = async (boardId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`/api/v1/users/boards/${boardId}`, config);

      setBoards(boards.filter((board) => board._id !== boardId));
      toast.success("Board deleted");

      if (selectedBoard >= boards.length - 1) {
        setSelectedBoard(boards.length - 2);
      }
    } catch (error) {
      toast.error(`Error occurred: ${error.response.data.message}`);
    }
  };

  return (
    boards.length !== 0 && (
      <div className="flex flex-col w-full">
        {user && (
          <div className="w-full p-4 bg-gray-800 text-white shadow-md h-16 flex items-center">
            {avatar && (
              <img
                src={avatar}
                alt="User Avatar"
                className="w-9 h-9 rounded-full mr-4 cursor-pointer"
                onClick={handleProfileEdit}
              />
            )}
            <div
              className="w-8 h-8 flex items-center justify-center bg-purple-400 text-white rounded-full mr-4 text-lg font-semibold cursor-pointer"
              onClick={handleProfileEdit}
            >
              {getInitial(user.name)}
            </div>
            <div className="flex-grow"></div>
            <button
              className="border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white py-2 px-4 rounded"
              onClick={logoutHandler}
            >
              Logout
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <div className="w-full bg-gray-600 p-4 flex items-center justify-between relative">
            <select
              value={selectedBoard}
              onChange={handleBoardChange}
              className="bg-gray-800 text-white border border-purple-400 rounded py-2 px-4"
            >
              {boards &&
                boards.map((board, index) => (
                  <option key={board._id} value={index}>
                    {board.boardName}
                  </option>
                ))}
            </select>
            <button
              className="bg-purple-400 text-white py-2 px-4 rounded ml-4"
              onClick={() => {
                const boardName = prompt("Enter new board name:");
                if (boardName) addBoard(boardName);
              }}
            >
              Add Board
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded ml-4"
              onClick={() => {
                const boardToDelete = boards[selectedBoard];
                if (boardToDelete) {
                  if (
                    window.confirm(
                      `Are you sure you want to delete the board "${boardToDelete.boardName}"?`
                    )
                  ) {
                    deleteBoard(boardToDelete._id);
                  }
                }
              }}
            >
              Delete Board
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-800 text-white border border-purple-400 rounded py-2 px-4 ml-4"
              />
              {showDropdown && (
                <div className="absolute bg-white border border-gray-400 rounded mt-1 w- z-10">
                  {filteredTasks.map((task) => (
                    <div
                      key={task._id}
                      className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleTaskClick(task)}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex p-4 my-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredTasks.map((task) => task._id)}
                strategy={verticalListSortingStrategy}
              >
                <TaskList
                  name="To do"
                  tasks={filteredTasks.filter(
                    (task) => task.taskList === "To do"
                  )}
                  board={boards[selectedBoard]._id}
                  refetch={refetchTasks}
                />
                <TaskList
                  name="Doing"
                  tasks={filteredTasks.filter(
                    (task) => task.taskList === "Doing"
                  )}
                  board={boards[selectedBoard]._id}
                  refetch={refetchTasks}
                />
                <TaskList
                  name="Done"
                  tasks={filteredTasks.filter(
                    (task) => task.taskList === "Done"
                  )}
                  board={boards[selectedBoard]._id}
                  refetch={refetchTasks}
                />
              </SortableContext>
            </DndContext>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {selectedTask && (
            <Task
              task={selectedTask}
              refetch={refetchTasks}
              onClose={closeModal}
            />
          )}
        </Modal>
      </div>
    )
  );
};

export default Homepage;
