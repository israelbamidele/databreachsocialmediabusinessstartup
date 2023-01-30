const { findOneAndUpdate } = require("../../model/Discussion/discussion.model");
const Discussion = require("../../model/Discussion/discussion.model");
const Forum = require("../../model/Forum/forum.model");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

exports.createADiscussion = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { content, forum_name, image } = req.body;

  const forum = await Forum.findOne({ name: forum_name });

  if (!forum) {
    return next(new AppError("Forum not found", 404));
  }

  const discussion = new Discussion({
    content,
    forum: forum_name,
    uploader: user._id,
  });

  const savedDiscussion = await discussion.save();

  forum.discussion.push(savedDiscussion.id);
  await forum.save();

  res.status(201).json({
    success: true,
    data: {
      content,
      user,
    },
  });
});

exports.getDiscussion = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let discussion;
  if (id) {
    discussion = await Discussion.findById(id).populate("replies uploader");
  }

  if (!discussion) {
    return next(new AppError("Content not found", 404));
  }

  res.status(200).json({
    success: true,
    content: discussion,
  });
});

exports.getDiscussionOnForum = catchAsync(async (req, res, next) => {
  const { forum_name } = req.body;

  const forum = await Forum.findOne({ name: forum_name }).populate({
    path: "discussion",
    select: "content uploader uploaded_on replies retweet forum",
    populate: {
      path: "uploader",
      select: "firstName lastName occupation photo",
    },
  });

  if (!forum) {
    return next(new AppError("Contents not found", 404));
  }

  const discussions = forum.discussion;

  res.status(200).json({
    success: true,
    length: discussions.length,
    discussions,
  });
});

exports.getDiscussionByRetweets = catchAsync(async (req, res, next) => {
  const discussioms = await Discussion.find().populate("replies uploader");

  console.log(discussioms);
  discussioms.sort((a, b) => {
    return b.retweet.length - a.retweet.length;
  });

  res.status(200).json({
    success: true,
    discussioms,
  });
});

exports.commentOnDiscussion = catchAsync(async (req, res, next) => {
  const { comment } = req.body;
  const user = req.user;
  const { discussion_id } = req.params;
  // GETTING THE DISCUSSION DOCUMENT
  const discussion = await Discussion.findById(discussion_id);

  // ADDING THE COMMENT

  discussion.replies.push({
    content: comment,
    uploaded_by: user.id,
  });

  await discussion.save();
  res.status(201).json({
    success: true,
    content: comment,
  });
});

exports.retweetADiscussion = catchAsync(async (req, res, next) => {
  const { discussion_id } = req.params;

  const discussion = await Discussion.findById(discussion_id);

  const alreadyRetweet = discussion.retweet.find((user) => {
    return (user = req.user.id);
  });

  console.log(alreadyRetweet);
  if (alreadyRetweet) {
    return next(new AppError("Already retweet this discussiom", 400));
  }
  discussion.retweet.push(req.user.id);

  await discussion.save();

  res.status(200).json({
    success: true,
  });
});
