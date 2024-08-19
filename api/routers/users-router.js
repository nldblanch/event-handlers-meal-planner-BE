const { getListsByUsername } = require("../../controllers/lists-controllers");
const {
  getUserByUsername,
  postNewUser,
} = require("../controllers/users-controller");

const usersRouter = require("express").Router();
usersRouter.route("/").post(postNewUser);
usersRouter.route("/:username").get(getUserByUsername);
usersRouter.route("/:username/lists").get(getListsByUsername);

module.exports = usersRouter;
