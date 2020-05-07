const { selectUsername } = require('../models/usersModels')

exports.getUsername = (req, res, next) => {

  const { username } = req.params;
  selectUsername(username)
    .then((user) => {
      res.status(200)
        .send({ user })
    })
    .catch((err) => {
      next(err)
    })



};