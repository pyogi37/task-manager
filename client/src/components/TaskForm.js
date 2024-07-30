import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Center,
  FormErrorMessage,
  Flex,
  Select,
  Text,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import Axios from "axios";
import { UserState } from "../Context/UserProvider";

const TaskForm = ({ addTask }) => {
  const [taskText, setTaskText] = useState("");
  const [taskCategory, setTaskCategory] = useState("personal");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const toast = useToast();
  const { user } = UserState();

  const handleSubmit = async (e) => {
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

    // Set loading state to true while the request is being made
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

      console.log("NEW TASK", response.data);

      if (response.status === 201) {
        // Notify the parent component (Homepage) by calling the addTask callback
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
      console.error("Error adding task:", error);

      toast({
        title: "Error",
        description: "An error occurred while adding the task.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // Set loading state to false after the request is complete
      setIsLoading(false);
    }
  };

  return (
    <Center>
      <Flex
        direction={"column"}
        w={"100%"}
        m={4}
        p={2}
        bgColor={"white"}
        borderRadius={"lg"}
        alignItems={"center"}
      >
        <Box
          display={"flex"}
          m={2}
          p={2}
          bgColor={"aliceblue"}
          borderRadius={"lg"}
        >
          <FormControl id="taskText" m={1} isRequired>
            <FormLabel>Task</FormLabel>
            <Input
              type="text"
              placeholder="Add a new task"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
            />
            <FormErrorMessage>This field is required</FormErrorMessage>
          </FormControl>

          <FormControl id="taskCategory" m={1} isRequired>
            <FormLabel>Category</FormLabel>
            <Select
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </Select>
            <FormErrorMessage>This field is required</FormErrorMessage>
          </FormControl>

          <FormControl id="taskPriority" m={1} isRequired>
            <FormLabel>Priority</FormLabel>
            <Select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <FormErrorMessage>This field is required</FormErrorMessage>
          </FormControl>

          <FormControl id="dueDate" m={1} isRequired>
            <FormLabel>Due Date</FormLabel>
            <Input
              type="date"
              value={dueDate}
              color={"gray"}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <FormErrorMessage>This field is required</FormErrorMessage>
          </FormControl>
        </Box>

        <Button
          onClick={handleSubmit}
          colorScheme="purple"
          w={"30%"}
          isLoading={isLoading} // Use isLoading to control the button state
          loadingText="Adding..."
        >
          Add Task
        </Button>
      </Flex>
    </Center>
  );
};

export default TaskForm;
