const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticlesById,
  postCommentById,
  getCommentsByArticleId,
  getArticles,
} = require("../controllers/articlesController");
const {
  handle405s,
  handleCustomErrors,
} = require("../controllers/errorControllers");

articlesRouter.route("/").get(getArticles).all(handle405s);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticlesById)
  .get(handleCustomErrors)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentById)
  .get(getCommentsByArticleId);

module.exports = articlesRouter;
