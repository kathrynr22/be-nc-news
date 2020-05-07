const { selectArticleById, updateArticleById, sendPostedComment, selectCommentsByArticleId, selectArticles } = require('../models/articlesModels')


exports.getArticleById = (req, res, next) => {
  //console.log('inside the getArticle controller')
  //console.log(req.params)
  const { article_id } = req.params;

  selectArticleById(article_id)
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
  //console.log('inside the articles patch controller')
  //console.log(req.body)
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
  // console.log(req.body.body)
  // console.log(req.body.username)
  const username = req.body.username;
  //const { body } = req.body.body;
  const { body } = req.body
  const { article_id } = req.params;

  sendPostedComment(article_id, body, username)
    .then((comment) => {
      //console.log('inside controllers then block')
      //console.log(comment[0])
      const commentObj = comment[0]
      res.status(201).send({ commentObj })
    })
    .catch((err) => {
      next(err)
    })



  //.catch(next)

}

exports.getCommentsByArticleId = (req, res, next) => {
  console.log('inside the get comments controller')

  const { article_id } = req.params;
  const { sort_by } = req.query;
  const { order } = req.query;

  selectCommentsByArticleId(article_id, sort_by, order)
    .then((comment) => {
      // console.log('inside the get comments controllers then block')
      //console.log(comment)
      res.status(200).send({ comment })
    })
    .catch((err) => {
      next(err)
    })
}

// .then((res) => console.log(res));



//.catch(next)

exports.getArticles = (req, res, next) => {
  console.log('inside the getArticle controller yi')

  //const { sort_by } = req.query;
  //const { order } = req.query;
  //const { author } = req.query;
  const { sort_by, order, author } = req.query
  //put these into one object see friday pic 15.26


  selectArticles(sort_by, order, author)
    .then((articles) => {
      console.log('inside getarticles controller then block hi')
      console.log(articles)

      //console.log(article[0])
      //const articleObj = article[0]
      res.status(200)
        .send({ articles })
    })
    .catch((err) => {
      next(err)
    })

  //.catch(next)

};