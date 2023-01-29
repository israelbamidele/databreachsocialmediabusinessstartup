const { model, Schema, mongo, default: mongoose } = require("mongoose");

const commentSchema = Schema({
  content: {
    type: String,
    required: [true, "A comment must have a content"],
  },
  uploaded_by: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const discussionSchema = Schema({
  content: {
    type: String,
    required: [true, "A discussion must have content"],
  },
  forum: {
    type: String,
    required: true,
  },
  uploader: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  uploaded_on: {
    type: Date,
    default: Date.now(),
  },
  replies: [commentSchema],

  retweet: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  image: {
    type: String,
  },
});

const Discussion = model("Discussion", discussionSchema);
module.exports = Discussion;
