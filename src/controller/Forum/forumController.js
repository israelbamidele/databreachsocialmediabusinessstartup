const Forum = require("../../model/Forum/forum.model");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

exports.createForum = catchAsync(async (req, res, next) => {
  const { photo, name, description } = req.body;
  const user = req.user;

  const forum = await Forum.create({
    name,
    photo,
    createdBy: user.id,
    description,
  });

  user.forums.push(forum.id);

  res.status(201).json({
    success: true,
    forum,
  });
});

exports.getAllForums = catchAsync(async (req, res, next) => {
  let forums = await Forum.find();
  const user = req.user;

  const newForumObj = forums.map((forum) => {
    const newForum = { ...forum._doc };

    newForum.isFollowing = false;

    if (user.forums.includes(newForum._id)) {
      newForum.isFollowing = true;
    }

    return newForum;
  });

  res.status(200).json({
    success: true,
    range: forums.length,
    forums: newForumObj,
  });
});

exports.getAForum = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const user = req.user;

  let forum;

  if (name) {
    forum = await Forum.findOne({ name })
      .populate("createdBy")
      .populate({
        path: "followers",
        select: "firstname lastname middlename occupation photo",
      })
      .populate({
        path: "discussion",
      })
      .populate({
        path: "topics",
      });
  } else {
    forum = await Forum.findById(req.params.forum_id)
      .populate("createdBy")
      .populate({
        path: "followers",
        select: "firstname lastname middlename occupation photo",
      })
      .populate({
        path: "followers",
        select: "firstname lastname middlename occupation photo",
      })
      .populate({
        path: "discussion",
      })
      .populate({
        path: "topics",
      });
  }

  const objForum = { ...forum._doc };
  objForum.isFollowing = false;

  if (user.forums.includes(forum.id)) {
    objForum.isFollowing = true;
  }

  if (!forum) {
    return next(new AppError("Forum with the name does not exist", 404));
  }

  res.status(200).json({
    success: true,
    forum: objForum,
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

exports.getForumsByHighEngagements = catchAsync(async (req, res, next) => {
  const user = req.user;
  const forums = await Forum.find()
    .populate({
      path: "discussion",
      populate: {
        path: "replies",
        select: "-_id",
      },
    })
    .populate({
      path: "topics",
      populate: {
        path: "answer replies",
      },
    })
    .populate("createdBy")
    .populate({
      path: "followers",
      select: "firstname lastname middlename occupation photo",
    });

  forums.sort((a, b) => {
    return b.discussion.length - a.discussion.length;
  });

  const newForumObj = forums.map((forum) => {
    const newForum = { ...forum._doc };

    newForum.isFollowing = false;

    if (user.forums.includes(newForum._id)) {
      newForum.isFollowing = true;
    }

    return newForum;
  });

  res.status(200).json({
    success: true,
    forums: newForumObj,
  });
});

exports.becomeAMemeber = catchAsync(async (req, res, next) => {});
