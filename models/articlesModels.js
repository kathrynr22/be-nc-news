const knex = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return knex
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comments.article_id AS comment_count")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id")
    .then((article) => {
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: "article_id not found" });
      else {
        return article;
      }
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return knex("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((article) => {
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: "article_id not found" });
      else {
        return article;
      }
    });
};

exports.sendPostedComment = (article_id, body, username) => {
  let date = new Date();

  return knex("comments")
    .where("article_id", article_id)
    .insert([
      {
        author: username,
        body: body,
        article_id: article_id,
        created_at: date,
      },
    ])
    .returning("*");
};

//wouldnt let me do promise.reject and send 404 kept returning 500 and psql

exports.selectCommentsByArticleId = (article_id, sort_by, order) => {
  return knex
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order || "asc")
    .then((comment) => {
      console.log(comment);
      if (comment.length === 0)
        return Promise.reject({ status: 404, msg: "article_id not found" });
      else {
        return comment;
      }
    });
};

exports.selectArticles = (sort_by, order, author, topic) => {
  console.log("inside the selectArticle model");

  return knex
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comments.article_id AS comment_count")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify((query) => {
      if (author) query.where("articles.author", author);
      if (topic) query.where("articles.topic", topic);
    })
    .then((articles) => {
      if (articles.length === 0)
        return Promise.reject({ status: 404, msg: "resource not found" });
      else {
        return articles;
      }
    });
};
