const usersRouter = require('express').Router();
const { getUsername } = require('../controllers/usersController');
const { handle405s, handleCustomErrors } = require('../controllers/errorControllers');

usersRouter.route('/:username').get(getUsername).get(handleCustomErrors).all(handle405s);

module.exports = usersRouter;