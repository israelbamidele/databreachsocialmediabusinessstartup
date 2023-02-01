const Forum = require("../../model/Forum/forum.model");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

exports.createForum = catchAsync(async (req, res, next) => {
  const { photo, name, description } = req.body;
  const user = req.user;

  if (await Forum.findOne({ name })) {
    return next(new AppError("Forum already exists", 400));
  }

  const forum = new Forum({
    name,
    photo,
    createdBy: user.id,
    description,
  });

  await forum.save();
  user.forums.push(forum.id);

  res.status(201).json({
    success: true,
    forum,
  });
});

exports.getAllForums = catchAsync(async (req, res, next) => {
  let forums = await Forum.find().populate({
    path: "createdBy",
    select: "firstName lastName middleName photo occupation",
  });
  const user = req.user;

  const newForumObj = forums.map((forum) => {
    const newForum = { ...forum._doc };

    return newForum;
  });

  newForumObj.forEach((forum) => {
    const current = forum.enrolled.filter((cUser) => {
      return cUser == user.id;
    });
    if (current.length < 1) {
      forum.isFollowing = false;
    } else {
      forum.isFollowing = true;
    }
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

  if (!forum) {
    return next(new AppError("Forum with the name does not exist", 404));
  }

  const objForum = { ...forum._doc };

  newForumObj.forEach((forum) => {
    const current = forum.enrolled.filter((cUser) => {
      return cUser == user.id;
    });
    if (current.length < 1) {
      forum.isFollowing = false;
    } else {
      forum.isFollowing = true;
    }
  });

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

  const userInForum = forum.enrolled.find((currentUser) => {
    return currentUser == req.user.id;
  });

  if (userInForum) {
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

    return newForum;
  });

  newForumObj.forEach((forum) => {
    const current = forum.enrolled.filter((cUser) => {
      return cUser == user.id;
    });
    if (current.length < 1) {
      forum.isFollowing = false;
    } else {
      forum.isFollowing = true;
    }
  });

  res.status(200).json({
    success: true,
    forums: newForumObj,
  });
});

exports.becomeAMemeber = catchAsync(async (req, res, next) => {});
