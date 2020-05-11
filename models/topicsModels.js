const knex = require("../db/connection");

exports.selectTopics = (topic) => {
  return knex
    .select("*")
    .from("topics")
    .modify((query) => {
      if (topic) query.where("slug", topic);
    })
    .then((topic) => {
      if (topic.length === 0)
        return Promise.reject({ status: 404, msg: "topic not found" });
      else {
        return topic;
      }
    });
};
