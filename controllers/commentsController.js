const { updateCommentById } = require("../models/commentsModels");

exports.patchCommentsById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  console.log(req.params);
  console.log("inside the comments controller");

  updateCommentById(comment_id, inc_votes)
    .then((comment) => {
      console.log(comment);
      res.send({ comment });
    })
    .catch((err) => {
      next(err);
    });
  // not finished yet
};
