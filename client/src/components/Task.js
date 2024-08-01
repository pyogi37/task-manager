import React, { useState } from "react";
import axios from "axios";
import { UserState } from "../Context/UserProvider";
import { toast } from "react-toastify";

const Task = ({ task, refetch, onClose }) => {
  const { user } = UserState() || {};
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [errors, setErrors] = useState({});
  const [currTask, setCurrTask] = useState(task);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!editedTask.title.trim()) {
      toast.error("Title is required");
    }
    // if (!editedTask.content.trim()) {
    //   toast.error("Description is required");
    // }

    if (editedTask.dueDate) {
      const dueDate = new Date(editedTask.dueDate);
      if (isNaN(dueDate.getTime())) {
        toast.error("Invalid date format");
      } else if (dueDate < new Date()) {
        toast.error("Due date must be in the future");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.put(
        `/api/v1/tasks/update/${task._id}`,
        editedTask,
        config
      );
      setCurrTask(response.data.data.task);
      refetch();
      toast.success("Task updated")

      setIsEditing(false);
    } catch (error) {
      toast.error(`Error occurred: ${error.response.data.message}`);
    }
  };

  const handleCancel = () => {
    setEditedTask({ ...task });
    setIsEditing(false);
    setErrors({});
  };

  const handleDelete = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`/api/v1/tasks/${task._id}`, config);
      toast.success("Task deleted successfully");
      refetch();
      onClose();
    } catch (error) {
      toast.error(`Error occurred: ${error.response.data.message}`);
    }
  };

  return (
    <div className="p-4 border-b border-gray-300">
      {isEditing ? (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              className="mt-1 p-2 border rounded"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              name="content"
              value={editedTask.content}
              onChange={handleChange}
              className="mt-1 p-2 border rounded"
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Task List
            </label>
            <select
              name="taskList"
              value={editedTask.taskList}
              onChange={handleChange}
              className="mt-1 p-2 border rounded"
            >
              <option value="To do">To do</option>
              <option value="Doing">Doing</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              name="priority"
              value={editedTask.priority}
              onChange={handleChange}
              className="mt-1 p-2 border rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due Date Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={editedTask.dueDate}
              onChange={handleChange}
              className="mt-1 p-2 border rounded"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold">{currTask.title}</h3>
          <p>
            <strong>Description:</strong>{" "}
            {currTask.content ? currTask.content : "Not added"}
          </p>
          <p>
            <strong>Task List:</strong> {currTask.taskList}
          </p>
          <p>
            <strong>Priority:</strong> {currTask.priority}
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {currTask.dueDate
              ? new Date(currTask.dueDate).toLocaleDateString()
              : "Not added"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(task.createdAt).toLocaleDateString()}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
