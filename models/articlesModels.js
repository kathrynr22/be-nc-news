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

}

