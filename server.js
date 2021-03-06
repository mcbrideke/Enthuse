const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const tree = require("./routes/api/hobbyTree");
const post = require("./routes/api/post");
const set = require("./routes/api/set");
const moment = require("moment");
const Post = require("./models/Post");
const { setIntervalAsync } = require("set-interval-async/dynamic");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

the_interval = 5 * 60 * 1000;
setIntervalAsync(hRankUpdatePosts, the_interval);
setIntervalAsync(hRankUpdateComments, the_interval);

async function hRankUpdateComments() {
  console.log("commup");

  Comment.find().then(comments => {
    return new Promise((resolve, reject) => {
      comments.map((comment, i) => {
        if (comment.hRank > 0.001) {
          var timeDiff = (moment() - comment.date) / 3600000;
          var x = 0.8 + 0.2 * (1 / (1 + Math.log((timeDiff ^ 2) + 2)));
          comment.hRank = Number(comment.hRank * x);
          comment.save();
        }
        if (i == comments.length) {
          resolve();
        }
      });
    });
  });
}
async function hRankUpdatePosts() {
  console.log("postup");
  Post.find().then(posts => {
    return new Promise((resolve, reject) => {
      posts.map((post, i) => {
        if (post.hRank > 0.001) {
          var timeDiff = (moment() - post.date) / 3600000;
          var x = 0.8 + 0.2 * (1 / (1 + Math.log((timeDiff ^ 2) + 2)));
          post.hRank = Number(post.hRank * x);
          post.save();
        }
        if (i == posts.length) {
          resolve();
        }
      });
    });
  });
}
// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/tree", tree);
app.use("/api/post", post);
app.use("/api/set", set);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
