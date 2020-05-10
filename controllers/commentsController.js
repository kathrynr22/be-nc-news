const {
  updateCommentById,
  removeCommentById,
} = require("../models/commentsModels");

exports.patchCommentById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;

  updateCommentById(comment_id, inc_votes)
    .then((patchedComment) => {
      res.send({ patchedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then((delCount) => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
