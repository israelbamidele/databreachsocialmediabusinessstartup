const Forum = require("../../model/Forum/forum.model");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

exports.createForum = catchAsync(async (req, res, next) => {
  const { photo, name } = req.body;
  const user = req.user;

  const forum = await Forum.create({
    name,
    photo,
    createdBy: user.id,
  });

  user.forums.push(forum.id);

  res.status(201).json({
    success: true,
    forum,
  });
});

exports.getAllForums = catchAsync(async (Req, res, next) => {
  const forums = await Forum.find();

  res.status(200).json({
    success: true,
    range: forums.length,
    forums,
  });
});

exports.getAForum = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  let forum;
  if (name) {
    forum = await Forum.findOne({ name }).populate("createdBy").populate({
      path: "followers",
      select: "firstname lastname middlename occupation photo",
    });
  } else {
    forum = await Forum.findById(req.params.forum_id)
      .populate("createdBy")
      .populate({
        path: "followers",
        select: "firstname lastname middlename occupation photo",
      });
  }

  if (!forum) {
    return next(new AppError("Forum with the name does not exist", 404));
  }

  res.status(200).json({
    success: true,
    forum,
  });
});

exports.followAForum = catchAsync(async (req, res, next) => {
  const { forum_name } = req.body;
  const user = req.user;

  const forum = await Forum.findOne({ name: forum_name });

  if (!forum) {
    return next(new AppError("Forum does not exist", 404));
  }

  if (
    forum.enrolled.find((user) => {
      return (user = req.user.id);
    })
  ) {
    return next(new AppError("You are already enrolled in this forum", 400));
  }

  forum.enrolled.push(user.id);
  user.forums.push(forum.id);
  await forum.save();
  await user.save();

  res.status(200).json({
    success: true,
    message: `Now following ${forum.name}`,
  });
});

exports.becomeAMemeber = catchAsync(async (req, res, next) => {});
