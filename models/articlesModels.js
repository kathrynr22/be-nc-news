const knex = require('../db/connection')

exports.selectArticle = (article_id) => {

  console.log('inside the articles models')

  return knex
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comments.article_id AS comment_count")
    .where("articles.article_id", "=", article_id)
    .groupBy("articles.article_id")
    .then((article) => {
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: 'article_id not found' })
      else {
        return article
      }
    })
  //}

}

exports.updateArticleById = (article_id, inc_votes) => {

  return knex('articles')
    .where('article_id', '=', article_id)
    .increment('votes', inc_votes || 0)
    .returning('*');
}

