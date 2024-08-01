import React, { useState } from "react";
import { UserState } from "../Context/UserProvider";
import axios from "axios";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Modal from "./Modal";
import Task from "./Task";
import edit from "../assets/pen-to-square-regular.svg";
import { toast } from "react-toastify";

const SortableItem = ({ id, task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(task.title === "dummy0007" && {
      backgroundColor: "white",
      color: "white",
      cursor:"default"
    }),
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`py-2 ${task.title === "dummy007" ? "" : "border-b"} cursor-pointer`}
      {...attributes}
      {...listeners}
      // className="py-2 border-b cursor-pointer"
    >
      {task.title}
    </li>
  );
};

const TaskList = ({ name, board, tasks, refetch }) => {
  const { user } = UserState() || {};
  const [newTask, setNewTask] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const response = await axios.post(
          "/api/v1/tasks/create",
          { title: newTask, taskList: name, board },
          config
        );

        if (response.data) {
          refetch();
          toast.success("Task added");
        }
      } catch (error) {
        toast.error(`Error occurred: ${error.response.data.message}`);
      }
      setNewTask("");
    } else {
      toast.error("Type to add task");
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">{name}</h2>

      <ul className="list-disc list-inside">
        {tasks.length !== undefined &&
          tasks.map((task) => (
            <div className="flex justify-between" key={task._id}>
              <SortableItem
                id={task._id}
                task={task}
                onClick={handleTaskClick}
              />
              {task.title !== "dummy0007" && (
                <button onClick={(e) => handleTaskClick(task)}>
                  <img
                    src={edit}
                    alt="edit"
                    style={{ width: "24px", height: "24px" }}
                  />
                </button>
              )}
            </div>
          ))}
      </ul>

      <div className="mt-6 flex">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
          className="flex-1 p-2 border rounded-l-md focus:outline-none"
        />
        <button
          onClick={handleAddTask}
          className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600"
        >
          Add Task
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedTask && (
          <Task task={selectedTask} refetch={refetch} onClose={closeModal} />
        )}
      </Modal>
    </div>
  );
};

export default TaskList;
