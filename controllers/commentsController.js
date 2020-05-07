const { updateCommentById } = require('../models/commentsModels')

exports.patchCommentsById = (req, res, next) => {
  //console.log('inside the articles patch controller')
  //console.log(req.body)
  const { inc_votes } = req.body;
  const { comment_id } = req.params;

  updateCommentById(comment_id, inc_votes)
    .then((comment) => {
      res.send({ comment })
    })
    .catch((err) => {
      next(err)
    })

  //.catch(next)

}