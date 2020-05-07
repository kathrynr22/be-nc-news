const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex.insert(topicData).into("topics");
      const usersInsertions = knex.insert(userData).into("users");

      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      return knex("articles").insert(formatDates(articleData)).returning("*");
    })
    .then((articleRows) => {
      const articleRef = makeRefObj(articleRows, "title", "article_id");
      const formattedComments = formatComments(commentData, articleRef);
      return knex("comments").insert(formattedComments).returning("*");
    });
};
