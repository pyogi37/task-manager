const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskList: {
      type: String,
      enum:["To do", "Doing", "Done"],
      required:true
    },
    board:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Board",
      required:true
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
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
      required:true
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
