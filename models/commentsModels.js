const knex = require("../db/connection");

exports.updateCommentById = (comment_id, inc_votes) => {
  if (inc_votes === undefined) {
    return knex("comments")
      .where("comment_id", comment_id)
      .returning("*")
      .then((comment) => {
        return comment[0];
      });
  }

  return knex("comments")
    .where("comment_id", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((comment) => {
      if (comment.length === 0)
        return Promise.reject({ status: 404, msg: "comment_id not found" });
      else {
        return comment[0];
      }
    });
};

exports.removeCommentById = (comment_id) => {
  return knex("comments")
    .where("comment_id", comment_id)
    .del()
    .then((delCount) => {
      if (delCount === 0)
        return Promise.reject({ status: 404, msg: "comment_id not found" });
    });
};
