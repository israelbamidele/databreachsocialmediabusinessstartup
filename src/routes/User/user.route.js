const { Router } = require("express");
const UserController = require("../../controller/User/user");
const { protected } = require("../../controller/Authentication/auth");

const router = Router();
router.use(protected);
router.post("/:user_id", UserController.getAUser);
router.post("/me", UserController.getCurrentUser);

module.exports = router;
