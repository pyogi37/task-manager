const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const Board = require("./models/Board");
const Task = require("./models/task");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in our db
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          // If user exists, generate a token and pass it to the done callback
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
          console.log(token);
          return done(null, { ...user.toJSON(), token });
        }
        // If user does not exist, create a new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: "123456",
        });

        const returnUser = await User.findById(user._id).select("-password");
        const defaultUserBoard = await Board.create({
          user,
          boardName: "Board 1",
        });
        const taskDetails = [
          { user, taskList: "Doing", board: defaultUserBoard._id, title: "dummy0007" },
          { user, taskList: "Done", board: defaultUserBoard._id, title: "dummy0007" },
          { user, taskList: "To do", board: defaultUserBoard._id, title: "dummy0007" }
        ];
        
        for (const task of taskDetails) {
          await Task.create(task);
        }
        
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        done(null, { ...returnUser.toJSON(), token });
      } catch (error) {
        console.error(error);
        done(error, null);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
