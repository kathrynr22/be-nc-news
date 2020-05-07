const commentsRouter = require("express").Router();
const { patchCommentsById } = require("../controllers/commentsController");
const { handle405s } = require("../controllers/errorControllers");

commentsRouter.route("/:comment_id").patch(patchCommentsById).all(handle405s);

module.exports = commentsRouter;
