const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topicsController');
const { handle405s, handleCustomErrors, handleInternalErrors } = require('../controllers/errorControllers');

topicsRouter.route('/').get(getAllTopics).get(handleCustomErrors).all(handle405s);

module.exports = topicsRouter;