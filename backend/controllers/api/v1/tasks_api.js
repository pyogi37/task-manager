const { default: mongoose } = require("mongoose");
const Task = require("../../../models/task");

// Create a new task
module.exports.createTask = async (req, res) => {
  try {
    const { title, content, dueDate, priority, taskList, board } = req.body;
    let user = req.user;

    const newTask = await Task.create({
      title,
      content,
      dueDate,
      taskList,
      priority,
      user,
      done: false,
      board,
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
    const { content, taskList, dueDate, priority, title } = req.body;

    let task = await Task.findById(taskId);

    if (task.user.equals(req.user.id)) {
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { content, taskList, dueDate, priority, title },
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

// Move a task
module.exports.moveTask = async (req, res) => {
  try {
    const { from, to } = req.body;

    const toTask = await Task.findById(to);

    if (toTask.user.equals(req.user.id)) {
      const updatedTask = await Task.findByIdAndUpdate(
        from,
        {
          $set: { taskList: toTask.taskList },
        },
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json({
        message: "Task moved",
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
