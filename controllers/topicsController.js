const { selectTopics } = require("../models/topicsModels");

exports.getAllTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      console.log("inside topics controller");
      console.log(topics);
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
