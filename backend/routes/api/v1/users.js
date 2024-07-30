const express = require("express");
const router = express.Router();
const passport = require("passport");
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

// Route to start Google authentication
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Route to handle Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Send the token to the client or redirect to the frontend
    console.log(req.user.token);
    res.json({ token: req.user.token });
  }
);

module.exports = router;
