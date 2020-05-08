const knex = require("../db/connection");

exports.updateCommentById = (comment_id, inc_votes) => {
  return knex("comments")
    .where("comment_id", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((comment) => {
      console.log("inside update comment by id");
      commentObj = comment[0];
      console.log(commentObj);
      if (comment.length === 0)
        return Promise.reject({ status: 404, msg: "comment_id not found" });
      else {
        return commentObj;
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
