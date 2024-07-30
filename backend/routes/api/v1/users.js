const express = require("express");
const router = express.Router();
const usersApi = require("../../../controllers/api/v1/users_api");
const { protect } = require("../../../middleware/authMiddleware");

router.get("", async function (req, res) {
  console.log("Inside users");
  res.send("Hello");
});

router.post("/create-session", usersApi.createSession);
router.post("/create", usersApi.create);
router.get("/tasks", protect, usersApi.getAllTasksByUser);
router.get("/tasks/:category", protect, usersApi.getUserTasksByCategory);

module.exports = router;
