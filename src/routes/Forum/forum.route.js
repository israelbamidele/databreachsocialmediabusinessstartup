const { Router } = require("express");
const Forum = require("../../controller/Forum/forumController");
const Auth = require("../../controller/Authentication/auth");

const router = Router();

router.use(Auth.protected);

router.get("/get-forum/:forum_id?", Forum.getAForum);
router.get("/get-all-forums", Forum.getAllForums);
router.post("/create", Forum.createForum);
router.patch("/enroll-a-forum", Forum.followAForum);
router.get("/get-forum-by-engagement", Forum.getForumsByHighEngagements);
module.exports = router;
