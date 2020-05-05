const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/controllers')

topicsRouter.route('/').get(getAllTopics)

module.exports = topicsRouter;