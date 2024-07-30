import React, { useEffect, useState } from "react";
import SingleTask from "./SingleTask";
import Axios from "axios";
import { useToast } from "@chakra-ui/react";
import { UserState } from "../Context/UserProvider";

const Tasks = () => {
  const { user, tasks, setTasks } = UserState();
  const [filter, setFilter] = useState("all"); // "all", "completed", "active"
  const [sort, setSort] = useState("none"); // "none", "dueDate", "priority"
  const toast = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const response = await Axios.get("api/v1/users/tasks", {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          setTasks(response.data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch tasks.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchTasks(); // Fetch tasks when the component mounts
  }, [user, setTasks, toast]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.done;
    if (filter === "active") return !task.done;
    return true;
  });

  const sortedTasks = [...filteredTasks];
  if (sort === "dueDate") {
    sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sort === "priority") {
    const priorityOrder = ["high", "medium", "low"];
    sortedTasks.sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority));
  }

  const handleTaskAction = async (taskId, action, newData) => {
    try {
      const response = await Axios({
        method: action.method,
        url: `api/v1/tasks/${action.endpoint}/${taskId}`,
        data: newData || {},
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === action.successStatus) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, ...newData } : task
          )
        );
      }
    } catch (error) {
      toast({
        title: `Error ${action.action}`,
        description: `Failed to ${action.action} task.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-md shadow-md h-full overflow-hidden">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Tasks</h2>
      <div className="flex justify-between mb-4 w-full">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filter === "all"}
              onChange={(e) => setFilter(e.target.value)}
              className="form-radio"
            />
            <span>All</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="filter"
              value="completed"
              checked={filter === "completed"}
              onChange={(e) => setFilter(e.target.value)}
              className="form-radio"
            />
            <span>Completed</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="filter"
              value="active"
              checked={filter === "active"}
              onChange={(e) => setFilter(e.target.value)}
              className="form-radio"
            />
            <span>Active</span>
          </label>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded-md p-2"
        >
          <option value="none">None</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      <div className="w-full h-full overflow-y-auto">
        {sortedTasks.length > 0 ? (
          <ul className="list-none p-0 m-0">
            {sortedTasks.map((task) => (
              <SingleTask
                key={task._id}
                task={task}
                onDelete={() => handleTaskAction(task._id, { method: "DELETE", endpoint: "", successStatus: 200, action: "deleting" })}
                onEdit={(newData) => handleTaskAction(task._id, { method: "PUT", endpoint: "update", successStatus: 200, action: "editing" }, newData)}
                onMarkDone={() => handleTaskAction(task._id, { method: "PATCH", endpoint: "done", successStatus: 200, action: "marking done" })}
                onMarkUndone={() => handleTaskAction(task._id, { method: "PATCH", endpoint: "undone", successStatus: 200, action: "marking undone" })}
              />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
