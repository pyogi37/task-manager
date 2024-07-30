import React, { useState } from "react";
import Axios from "axios";
import { useToast } from "@chakra-ui/react"; // For consistency, using Chakra's useToast
import { UserState } from "../Context/UserProvider";

const TaskForm = ({ addTask }) => {
  const [taskText, setTaskText] = useState("");
  const [taskCategory, setTaskCategory] = useState("personal");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { user } = UserState(); // Ensure this hook is correctly imported

  const handleSubmit = async () => {
    if (!dueDate || !taskText) {
      toast({
        title: "Enter all fields!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (new Date(dueDate) < new Date()) {
      toast({
        title: "Invalid Due Date",
        description: "Due date should be today or in future!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await Axios.post(
        "api/v1/tasks/create",
        {
          content: taskText,
          category: taskCategory,
          priority: taskPriority,
          dueDate: dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        addTask({
          content: taskText,
          category: taskCategory,
          priority: taskPriority,
          dueDate: dueDate,
          _id: response.data.data.task._id,
        });

        toast({
          title: "Task Added",
          description: "The task has been added successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setTaskText("");
        setDueDate("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the task.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-lg bg-white p-4 rounded-lg shadow-md">
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taskText">
              Task
            </label>
            <input
              id="taskText"
              type="text"
              placeholder="Add a new task"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taskCategory">
              Category
            </label>
            <select
              id="taskCategory"
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taskPriority">
              Priority
            </label>
            <select
              id="taskPriority"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Adding..." : "Add Task"}
        </button>
      </div>
    </div>
  );
};

export default TaskForm;
