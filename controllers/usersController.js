const { selectUsername } = require("../models/usersModels");

exports.getUsername = (req, res, next) => {
  const { username } = req.params;
  selectUsername(username)
    .then((userObject) => {
      res.status(200).send({ userObject });
    })
    .catch((err) => {
      next(err);
    });
};
