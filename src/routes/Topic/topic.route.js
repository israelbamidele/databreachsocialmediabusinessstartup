const { Router } = require("express");
const Topic = require("../../controller/Topic/topic.controller");
const { protected } = require("../../controller/Authentication/auth");
const router = Router();

router.use(protected);
router.post("/create", Topic.createATopic);
router.get("/topics-on-forum", Topic.getAllTopicOnForum);
router.get("/:topic_id", Topic.getATopic);
router.patch("/pin-a-topic/:topic_id", Topic.pinATopic);
router.patch("/answer-a-topic/:topic_id", Topic.answerATopic);

module.exports = router;
