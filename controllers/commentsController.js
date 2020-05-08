const {
  updateCommentById,
  removeCommentById,
} = require("../models/commentsModels");

exports.patchCommentsById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  console.log(req.params);

  updateCommentById(comment_id, inc_votes)
    .then((comment) => {
      console.log("inside update comment by id then block");
      console.log(comment);
      res.send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  console.log("inside the comments controller");

  removeCommentById(comment_id)
    .then((delCount) => {
      console.log(delCount);
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
