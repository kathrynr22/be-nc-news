const { selectArticle, updateArticleById } = require('../models/articlesModels')


exports.getArticle = (req, res, next) => {
  console.log('inside the articles controllers')
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