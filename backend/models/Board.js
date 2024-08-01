const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema(
  {
    boardName:{
      type: String,
      required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
      },
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model("Board", BoardSchema);

module.exports = Board;
