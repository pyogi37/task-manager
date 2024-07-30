const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["personal", "work", "other"], // Define allowed categories
    },
    dueDate: {
      type: Date,
    },
    done: {
      type: Boolean,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium", // Set a default priority
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
