const User = require("../../../models/user");
const Task = require("../../../models/task");
const jwt = require("jsonwebtoken");

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
        token: jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: "2000000",
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

// Get all tasks of a user
module.exports.getAllTasksByUser = async (req, res) => {
  let user = req.user;

  try {
    const userId = user._id;

    // Find all tasks associated with the user ID
    const tasks = await Task.find({ user: userId }).sort({ due_date: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.log("*********", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getUserTasksByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user.id;

    // Find tasks for the given category and user ID
    const tasks = await Task.find({ category, user: userId });

    res.status(200).json({
      message: `All ${category} tasks for ${userId}`,
      data: {
        tasks,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
