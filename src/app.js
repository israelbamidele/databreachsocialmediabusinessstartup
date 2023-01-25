const express = require("express");
require("dotenv").config();
const cors = require("cors");
const globalError = require("./controller/Error/errorController");
const authRouter = require("./routes/authentication/authRoute");
const forumRouter = require("./routes/Forum/forumRoute");
const discussionroute = require("./routes/Discussion/discussion.route");
const TopicRoute = require("./routes/Topic/topic.route");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/discussion", discussionroute);
app.use("/api/v1/forum", forumRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/topic", TopicRoute);
app.use(globalError);

module.exports = app;
