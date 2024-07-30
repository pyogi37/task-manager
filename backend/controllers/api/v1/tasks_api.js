const Task = require("../../../models/task");

// Create a new task
module.exports.createTask = async (req, res) => {
  try {
    const { content, category, dueDate, priority } = req.body;
    console.log("due date", dueDate);
    let user = req.user;

    const newTask = await Task.create({
      content,
      category,
      dueDate,
      priority, // Add the priority field
      user,
      done: false,
    });

    return res.status(201).json({
      message: "Task created successfully",
      data: {
        task: newTask,
      },
    });
  } catch (error) {
    console.log("*********", error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete a task by ID
module.exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    let task = await Task.findById(taskId);

    if (task.user.equals(req.user.id)) {
      // Use .equals to compare ObjectId
      // Find and delete the task by ID
      const deletedTask = await Task.findByIdAndDelete(taskId);

      if (!deletedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json({ message: "Task deleted successfully" });
    } else {
      return res.status(401).json({
        message: "You cannot delete this task",
      });
    }
  } catch (error) {
    console.log("*********", error);
    return res.status(500).json({ error: error.message });
  }
};

// Update a task by ID
module.exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content, category, dueDate, priority } = req.body;

    let task = await Task.findById(taskId);

    if (task.user.equals(req.user.id)) {
      // Use .equals to compare ObjectId
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { content, category, dueDate, priority }, // Update category and priority
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json({
        message: "Task updated",
        data: {
          task: updatedTask,
        },
      });
    } else {
      return res.status(401).json({
        message: "You cannot update this task",
      });
    }
  } catch (error) {
    console.log("*********", error);
    return res.status(500).json({ error: error.message });
  }
};

// Mark a task as done
module.exports.markTaskAsDone = async (req, res) => {
  console.log("Inside mark as done ");
  try {
    const { taskId } = req.params;
    let task = await Task.findById(taskId);

    if (task.user.equals(req.user._id)) {
      // Use .equals to compare ObjectId
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { done: true },
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json(updatedTask); // Simplify the response
    } else {
      return res.status(401).json({
        message: "You cannot update this task",
      });
    }
  } catch (error) {
    console.log("*********", error);
    return res.status(500).json({ error: error.message });
  }
};

// Mark a task as undone
module.exports.markTaskAsUndone = async (req, res) => {
  try {
    const { taskId } = req.params;
    let task = await Task.findById(taskId);

    if (task.user.equals(req.user.id)) {
      // Use .equals to compare ObjectId
      // Find and update the task by ID
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { done: false },
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json({
        message: "Task marked as undone",
        data: {
          task: updatedTask,
        },
      });
    } else {
      return res.status(401).json({
        message: "You cannot delete this task",
      });
    }
  } catch (error) {
    console.log("*********", error);
    return res.status(500).json({ error: error.message });
  }
};
