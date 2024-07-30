import React, { useEffect, useState } from "react";
import SingleTask from "./SingleTask";
import {
  Box,
  Center,
  Container,
  Heading,
  List,
  Radio,
  RadioGroup,
  Select,
} from "@chakra-ui/react";
import Axios from "axios";
import { UserState } from "../Context/UserProvider";

const Tasks = () => {
  const { user, tasks, setTasks } = UserState();
  const [filter, setFilter] = useState("all"); // "all", "completed", "active"
  const [sort, setSort] = useState("none"); // "none", "dueDate", "priority"

  useEffect(() => {
    // Function to fetch all tasks
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
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks(); // Fetch tasks when the component mounts
  }, [user]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.done;
    } else if (filter === "active") {
      return !task.done;
    }
    return true;
  });

  const sortedTasks = [...filteredTasks];
  if (sort === "dueDate") {
    sortedTasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  } else if (sort === "priority") {
    sortedTasks.sort((a, b) => {
      const priorityOrder = ["high", "medium", "low"];
      return (
        priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
      );
    });
  }

  const deleteTask = async (taskId) => {
    console.log("task id", taskId);
    try {
      const response = await Axios.delete(`api/v1/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = async (taskId, newData) => {
    try {
      const response = await Axios.put(
        `api/v1/tasks/update/${taskId}`,
        newData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, ...newData } : task
          )
        );
      }
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const markTaskAsDone = async (taskId) => {
    try {
      const response = await Axios.patch(
        `api/v1/tasks/update/${taskId}/done`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, done: true } : task
          )
        );
      }
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
  };

  const markTaskAsUndone = async (taskId) => {
    try {
      const response = await Axios.patch(
        `api/v1/tasks/update/${taskId}/undone`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, done: false } : task
          )
        );
      }
    } catch (error) {
      console.error("Error marking task as undone:", error);
    }
  };

  return (
    <Center m={4} mt={0} bgColor={"white"} borderRadius={"md"} p={4} h={"60%"}>
      <Container h={"100%"} overflow={"scroll"}>
        <Heading as="h2" size="md" mb={4} color={"blueviolet"}>
          Tasks
        </Heading>
        <Box
          className="functions"
          display={"flex"}
          justifyContent={"space-between"}
        >
          <RadioGroup value={filter} onChange={setFilter}>
            <Radio value="all" mr={2}>
              All
            </Radio>
            <Radio mr={2} value="completed">
              Completed
            </Radio>
            <Radio value="active">Active</Radio>
          </RadioGroup>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            w={"30%"}
            variant={"filled"}
          >
            <option value="none">None</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </Select>
        </Box>
        <List h={"100%"}>
          {sortedTasks.map((task) => (
            <SingleTask
              key={task._id}
              task={task}
              onDelete={() => deleteTask(task._id)}
              onEdit={(newData) => editTask(task._id, newData)}
              onMarkDone={() => markTaskAsDone(task._id)}
              onMarkUndone={() => markTaskAsUndone(task._id)}
            />
          ))}
        </List>
      </Container>
    </Center>
  );
};

export default Tasks;
