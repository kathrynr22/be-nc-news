const {
  selectArticleById,
  updateArticleById,
  insertComment,
  selectCommentsByArticleId,
  selectArticles,
} = require("../models/articlesModels");

const { selectUsername } = require("../models/usersModels");

const { selectTopics } = require("../models/topicsModels");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((articleById) => {
      res.status(200).send({ articleById });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticlesById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  updateArticleById(article_id, inc_votes)
    .then((patchedArticle) => {
      res.status(200).send({ patchedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentById = (req, res, next) => {
  const username = req.body.username;
  const { body } = req.body;
  const { article_id } = req.params;

  insertComment(article_id, body, username)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  selectCommentsByArticleId(article_id, sort_by, order)
    .then((commentsByArticleId) => {
      res.status(200).send({ commentsByArticleId });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  const queries = [selectArticles(sort_by, order, author, topic)];
  if (author) queries.push(selectUsername(author));
  if (topic) queries.push(selectTopics(topic));

  Promise.all(queries)
    .then(([allArticles, result2]) => {
      res.status(200).send({ allArticles });
    })
    .catch((err) => {
      next(err);
    });
};
