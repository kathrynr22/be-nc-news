const { selectArticle } = require('../models/articlesModels')

exports.getArticle = (req, res, next) => {
  console.log('inside the articles controllers')
  console.log(req.params)
  const { article_id } = req.params;
  selectArticle(article_id)
  //   .then((user) => {
  //     res.status(200)
  //       .send({ user })
  //   })
  //   .catch((err) => {
  //     next(err)
  //   })

  //.catch(next)

};