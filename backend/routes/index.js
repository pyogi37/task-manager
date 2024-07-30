const express = require("express");

const router = express.Router();

console.log("Router loaded");
router.use("/api", require("./api"));

// router.get("/", async (req, res) => {
//   await res.json({ message: "API is running, go to /home" });
// });

module.exports = router;
