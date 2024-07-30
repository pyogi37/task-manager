const express = require("express");
const session = require("express-session");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const port = process.env.PORT;
const colors = require("colors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const passport = require("passport");
const passportSetup = require("./passport.config");

connectDB();

app.use(
  express.urlencoded({
    extended: true,
  })
);

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

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", require("./routes"));

//---------------------------DEPLOYMENT CODE----------------------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname1, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfull");
  });
}

//_____________________________________________________________________________

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server running on port ${port}`.yellow.bold);
});
