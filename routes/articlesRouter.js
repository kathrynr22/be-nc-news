const articlesRouter = require('express').Router();
const { getArticle, patchArticlesById, postCommentById } = require('../controllers/articlesController');
const { handle405s, handleCustomErrors } = require('../controllers/errorControllers');

articlesRouter.route('/:article_id').get(getArticle).patch(patchArticlesById).get(handleCustomErrors).all(handle405s);

articlesRouter.route("/:article_id/comments").post(postCommentById)


module.exports = articlesRouter;