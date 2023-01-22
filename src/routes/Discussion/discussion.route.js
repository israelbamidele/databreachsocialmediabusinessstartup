const { Router, application } = require("express");

const Discussion = require("../../controller/Discussion/discussion.controller");
const Auth = require("../../controller/Authentication/auth");
const router = Router();

router.use(Auth.protected);

router.post("/create", Discussion.createADiscussion);
router.get("/on-forum", Discussion.getDiscussionOnForum);
router.get("/:id?", Discussion.getDiscussion);
router.patch("/add-comment/:discussion_id", Discussion.commentOnDiscussion);
router.patch("/retweet/:discussion_id", Discussion.retweetADiscussion);

module.exports = router;
