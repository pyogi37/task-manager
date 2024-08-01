const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const colors = require("colors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const passport = require("passport");
const cors = require("cors");
const cron = require("node-cron");
const Task = require("./models/task");
const User = require("./models/user");
const sendEmail = require("./sendMail");
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config({ path: __dirname + "/.env" });

// Connect to database
connectDB();

const app = express();
const port = process.env.PORT;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: { secure: false },
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// CORS setup
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Passport config
require("./passport.config");

// Routes
app.use("/", require("./routes"));

// Deployment configuration
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Schedule a cron job to run every day at 7 PM
cron.schedule("0 19 * * *", async () => {
  console.log("Running a task every day at 7 PM");
  try {
    // Get all users
    const users = await User.find({});

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    for (const user of users) {
      const tasks = await Task.find({
        user: user,
        dueDate: { $gte: tomorrow, $lt: endOfTomorrow },
      });

      console.log(`User: ${user.name}, Tasks due tomorrow:`, tasks);

      // If there are tasks due tomorrow, send an email
      if (tasks.length > 0) {
        const taskList = tasks.map((task) => task.title).join(", ");
        const emailText = `You have the following tasks due tomorrow: ${taskList}`;

        await sendEmail(user.email, "Tasks Due Tomorrow", emailText);
        console.log(`Email sent to ${user.email}`);
      }
    }
  } catch (error) {
    console.error("Error fetching users or tasks:", error);
  }
});

// Start the server
const server = app.listen(port, (err) => {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server running on port ${port}`.yellow.bold);
});
