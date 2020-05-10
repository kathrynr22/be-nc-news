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
      console.log("inside select article by id");
      console.log(article);
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: "article_id not found" });
      else {
        return article[0];
      }
    });
};

exports.updateArticleById = (article_id, inc_votes, body) => {
  // if (body === undefined) {
  //   selectArticleById(article_jd);
  // }
  return knex("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((article) => {
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: "article_id not found" });
      else {
        return article[0];
      }
    });
};

exports.insertComment = (article_id, body, username) => {
  let date = new Date();

  return knex("comments")
    .where("article_id", article_id)
    .insert({
      author: username,
      body: body,
      article_id: article_id,
      created_at: date,
    })
    .returning("*")
    .then((comment) => {
      return comment[0];
    });
};

//wouldnt let me do promise.reject and send 404 kept returning 500 and psql

exports.selectCommentsByArticleId = (article_id, sort_by, order) => {
  if (order !== undefined && order !== "asc" && order !== "desc") {
    return Promise.reject({
      status: 400,
      msg: "bad request",
    });
  }
  return knex
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then((comments) => {
      if (comments.length === 0) {
        return knex
          .select("*")
          .from("articles")
          .where("article_id", article_id)
          .then(([article]) => {
            if (article === undefined) {
              return Promise.reject({
                status: 404,
                msg: "article_id not found",
              });
            }
            return [];
          });
      }
      return comments;
    });
};

//come back and refactor to pass test for sorting by an invalid method
exports.selectArticles = (sort_by, order, author, topic) => {
  if (order !== undefined && order !== "asc" && order !== "desc") {
    return Promise.reject({
      status: 400,
      msg: "bad request",
    });
  }
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
      if (articles.length === 0) {
        if (author) {
          return knex
            .select("*")
            .from("users")
            .where("username", author)
            .then(([user]) => {
              if (user === undefined) {
                return Promise.reject({
                  status: 404,
                  msg: "author not found",
                });
              }
              return [];
            });
        } else if (topic) {
          return knex
            .select("*")
            .from("topics")
            .where("slug", topic)
            .then(([topic]) => {
              if (topic === undefined) {
                return Promise.reject({
                  status: 404,
                  msg: "topic not found",
                });
              }
              return [];
            });
        }
      }
      return articles;
    });
};
