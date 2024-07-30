import {
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  useBreakpointValue, // Import the breakpoint utility
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { UserState } from "../Context/UserProvider";
import TaskForm from "../components/TaskForm";
import Tasks from "../components/Tasks";
import { useState } from "react";

const Homepage = () => {
  const { user, tasks, setTasks } = UserState();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // Use useBreakpointValue to customize layout based on screen size
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  // Function to add a new task to the list
  const addTaskToList = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <Box h={"100vh"} w={"100vw"}>
      {/* Navbar */}
      {user && (
        <Flex
          p={4}
          alignItems="center"
          boxShadow="base"
          bg="black"
          w={"100vw"}
          h={"8vh"}
          direction={"row"} // Adjust direction for small screens
        >
          <Text
            fontSize="lg"
            fontWeight={"semibold"}
            color={"purple.400"}
            textAlign={"left"}
          >
            Welcome, {user.name} !!
          </Text>
          <Spacer />
          {isSmallScreen && <Box p={2} /> /* Add space for small screens */}
          <Button
            variant={"outline"}
            colorScheme="purple"
            onClick={logoutHandler}
            _hover={{
              bg: "purple.400", // Change to your desired hover background color
            }}
          >
            Logout
          </Button>
        </Flex>
      )}
      <TaskForm addTask={addTaskToList} />
      <Tasks tasks={tasks} />
    </Box>
  );
};

export default Homepage;
