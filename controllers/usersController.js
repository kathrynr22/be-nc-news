const { selectUsername } = require("../models/usersModels");

exports.getUsername = (req, res, next) => {
  const { username } = req.params;
  selectUsername(username)
    .then((userObject) => {
      console.log("inside get username controller");
      //rename to be called user
      console.log(userObject);
      res.status(200).send({ userObject });
    })
    .catch((err) => {
      next(err);
    });
};
