const User = require("../../../models/user");
const Task = require("../../../models/task");
const jwt = require("jsonwebtoken");
const Board = require("../../../models/Board");

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(422).json({
        message: "Invalid username or password",
      });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(422).json({
        message: "Invalid username or password",
      });
    }

    return res.status(200).json({
      message: "Sign in successful, here is your token",
      data: {
        name: user.name,
        email: user.email,
        avatar: user?.avatar,
        token: jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: "30d",
        }),
      },
    });
  } catch (error) {
    console.log("Error in finding user", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.create = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.json(422, {
        message: "User already exists",
      });
    }
    if (!user) {
      try {
        user = await User.create(req.body);
        await Board.create({ user, boardName: "Board 1" });
        const taskDetails = [
          {
            user: userId,
            taskList: "Doing",
            board: newBoard._id,
            title: "dummy0007",
          },
          {
            user: userId,
            taskList: "Done",
            board: newBoard._id,
            title: "dummy0007",
          },
          {
            user: userId,
            taskList: "To do",
            board: newBoard._id,
            title: "dummy0007",
          },
        ];

        for (const task of taskDetails) {
          await Task.create(task);
        }

        return res.json(200, {
          message: "Sign up successfull",
          data: {
            user: user,
          },
        });
      } catch (error) {
        console.log("error in creating new user", error);
        return res.json(500, {
          message: "Internal Server Error",
        });
      }
    }
  } catch (error) {
    console.log("error in creating new user*********", error);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

// Get all tasks of a user by board
module.exports.getAllTasksByUser = async (req, res) => {
  let user = req.user;

  const board_id = req.params.board;
  const list = req.query.list;

  try {
    const userId = user._id;

    const board = await Board.findById(board_id);

    // Find all tasks associated with the user ID
    let tasks = [];
    if (list) {
      tasks = await Task.find({
        user: userId,
        board: board_id,
        taskList: list,
      }).sort({
        due_date: 1,
      });
    } else {
      tasks = await Task.find({
        user: userId,
        board: board_id,
      }).sort({
        due_date: 1,
      });
    }

    res.status(200).json({ board: board.name, tasks });
  } catch (error) {
    console.log("*********", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports.getUserBoards = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find tasks for the given category and user ID
    const boards = await Board.find({ user: userId });

    res.status(200).json({
      data: {
        boards,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//create new board
module.exports.createBoard = async (req, res) => {
  try {
    const userId = req.user.id;
    const newBoard = await Board.create({
      user: userId,
      boardName: req.body.boardName,
    });
    await Task.create({
      user: userId,
      taskList: "Doing",
      board: newBoard._id,
      title: "dummy0007",
    });
    await Task.create({
      user: userId,
      taskList: "Done",
      board: newBoard._id,
      title: "dummy0007",
    });
    await Task.create({
      user: userId,
      taskList: "To do",
      board: newBoard._id,
      title: "dummy0007",
    });
    return res.json(200, {
      message: "Board created successfully",
      data: {
        board: newBoard,
      },
    });
  } catch (error) {
    console.log("error in creating new board", error);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

// Delete board
module.exports.deleteBoard = async (req, res) => {
  try {
    const userId = req.user.id;
    const boardId = req.params.boardId; // Assuming boardId is passed in req.params

    const board = await Board.findOne({ _id: boardId, user: userId });
    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    // Delete the board
    await Board.findByIdAndDelete(boardId);

    return res.status(200).json({
      message: "Board deleted successfully",
      data: {
        board: boardId,
      },
    });
  } catch (error) {
    console.log("Error in deleting board:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// update profile
module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        avatar,
      },
      { new: true }
    ).select("-password");

    return res.json(200, {
      message: "User updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.log("error in updating user", error);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
