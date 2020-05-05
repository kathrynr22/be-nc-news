const usersRouter = require('express').Router();
const { getUsername } = require('../controllers/usersController');
const { handle405s } = require('../controllers/errorControllers');

usersRouter.route('/:username').get(getUsername)
//.all(handle405s);

module.exports = usersRouter;