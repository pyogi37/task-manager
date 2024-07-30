import React, { useState } from "react";
import {
  ListItem,
  Text,
  Flex,
  Button,
  Box,
  Select,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import EditModal from "./EditModal";

const SingleTask = ({ task, onDelete, onEdit, onMarkDone, onMarkUndone }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (editedTask) => {
    console.log("edited task", editedTask);
    onEdit(editedTask);
    setIsEditModalOpen(false);
  };

  var options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const bgColor = task.done ? "#f3e6ff" : "aliceblue";

  return (
    <ListItem m={2} w={"100%"} bgColor={bgColor} borderRadius={"lg"}>
      <Flex direction={"column"} p={2}>
        <Flex justify={"space-between"}>
          <Text m={2} fontWeight={"semibold"} w={"50vw"} color={"black"}>
            {task.content}
          </Text>
          <Text m={2} color={"darkgoldenrod"} fontWeight={"semibold"}>
            {new Date(task.dueDate).toLocaleDateString("en-US", options)}
          </Text>
          <Text m={2} color={"darkgoldenrod"} fontWeight={"semibold"}>
            {task.priority}
          </Text>
        </Flex>
        <Box w={"100%"} display={"flex"} justifyContent={"flex-end"}>
          <Button
            size={"sm"}
            variant={"outline"}
            ml={2}
            onClick={handleEditClick}
          >
            Edit
          </Button>
          {task.done ? (
            <Button
              ml={2}
              onClick={onMarkUndone}
              size={"sm"}
              variant={"outline"}
            >
              Mark Undone
            </Button>
          ) : (
            <Button ml={2} onClick={onMarkDone} size={"sm"} variant={"outline"}>
              Mark Done
            </Button>
          )}
          <Button ml={2} onClick={onDelete} size={"sm"} variant={"outline"}>
            Delete
          </Button>
        </Box>
      </Flex>
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(editedTask) => handleSaveEdit(editedTask)}
      />
    </ListItem>
  );
};

export default SingleTask;
