const {
  selectArticleById,
  updateArticleById,
  sendPostedComment,
  selectCommentsByArticleId,
  selectArticles,
} = require("../models/articlesModels");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      const articleObj = article[0];
      res.status(200).send({ articleObj });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticlesById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentById = (req, res, next) => {
  const username = req.body.username;
  const { body } = req.body;
  const { article_id } = req.params;

  sendPostedComment(article_id, body, username)
    .then((comment) => {
      const commentObj = comment[0];
      res.status(201).send({ commentObj });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  console.log("inside the get comments controller");

  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  selectCommentsByArticleId(article_id, sort_by, order)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  selectArticles(sort_by, order, author, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
