const { selectUsername } = require("../models/usersModels");

exports.getUsername = (req, res, next) => {
  const { username } = req.params;
  selectUsername(username)
    .then((username) => {
      res.status(200).send({ username });
    })
    .catch((err) => {
      next(err);
    });
};
