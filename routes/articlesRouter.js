const articlesRouter = require('express').Router();
const { getArticle, patchArticlesById } = require('../controllers/articlesController');
const { handle405s, handleCustomErrors } = require('../controllers/errorControllers');

articlesRouter.route('/:article_id').get(getArticle).patch(patchArticlesById).get(handleCustomErrors).all(handle405s);

module.exports = articlesRouter;