const { selectArticle, updateArticleById, sendPostedComment } = require('../models/articlesModels')


exports.getArticle = (req, res, next) => {
  console.log('inside the getArticle controller')
  console.log(req.params)
  const { article_id } = req.params;

  selectArticle(article_id)
    .then((article) => {
      //console.log(article[0])
      const articleObj = article[0]
      res.status(200)
        .send({ articleObj })
    })
    .catch((err) => {
      next(err)
    })

  //.catch(next)

};

exports.patchArticlesById = (req, res, next) => {
  console.log('inside the articles patch controller')
  console.log(req.body)
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.send({ article })
    })
    .catch((err) => {
      next(err)
    })

  //.catch(next)

}

exports.postCommentById = (req, res, next) => {
  console.log('inside the post comment controller')
  console.log(req.body.body)
  console.log(req.body.username)
  const username = req.body.username;
  //const { body } = req.body.body;
  const { body } = req.body
  const { article_id } = req.params;

  sendPostedComment(article_id, body, username)
    .then((comment) => {
      console.log('inside controllers then block')
      console.log(comment[0])
      const commentObj = comment[0]
      res.status(201).send({ commentObj })
    })
    .catch((err) => {
      next(err)
    })



  //.catch(next)

}