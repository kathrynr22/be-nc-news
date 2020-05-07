const commentsRouter = require("express").Router();
const {
  patchCommentsById,
  deleteCommentById,
} = require("../controllers/commentsController");
const { handle405s } = require("../controllers/errorControllers");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentsById)
  .delete(deleteCommentById)
  .all(handle405s);

module.exports = commentsRouter;
