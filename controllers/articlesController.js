const { selectArticle } = require('../models/articlesModels')


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