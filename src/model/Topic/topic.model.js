const { Schema, model, default: mongoose } = require("mongoose");

const answerSchema = Schema({
  content: {
    type: String,
    required: [true, "Field cannot be empty"],
  },
  replied_by: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const topicSchema = Schema({
  topic: {
    type: String,
    required: [true, "Topic cannot be empty"],
  },
  answer: [answerSchema],
  pins: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  uploader: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  forum: {
    type: String,
    required: [true, "A topic must be in forum"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Topic = model("Topic", topicSchema);
module.exports = Topic;
