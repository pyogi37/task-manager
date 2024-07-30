const express = require("express");
const router = express.Router();
const tasksApi = require("../../../controllers/api/v1/tasks_api");
// const passport = require("passport");
const { protect } = require("../../../middleware/authMiddleware");

// Create a new task for a user
router.post("/create", protect, tasksApi.createTask);

// Delete a task by ID
router.delete("/:taskId", protect, tasksApi.deleteTask);

// Update a task by ID
router.put("/update/:taskId", protect, tasksApi.updateTask);

// Mark a task as done
router.patch("/update/:taskId/done", protect, tasksApi.markTaskAsDone);

// Mark a task as undone
router.patch("/update/:taskId/undone", protect, tasksApi.markTaskAsUndone);

module.exports = router;
