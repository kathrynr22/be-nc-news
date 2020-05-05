const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topicsController');
const { handle405s } = require('../controllers/errors.controllers');

topicsRouter.route('/').get(getAllTopics).all(handle405s);

module.exports = topicsRouter;