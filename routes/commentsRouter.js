const commentsRouter = require('express').Router();
const { patchCommentsById } = require('../controllers/commentsController');
const { handle405s, handleCustomErrors } = require('../controllers/errorControllers');




commentsRouter.route('/:comment_id').patch(patchCommentsById).get(handleCustomErrors).all(handle405s);



module.exports = commentsRouter;