const knex = require("../db/connection");

exports.selectUsername = (username) => {
  //console.log("inside select username models");
  return knex
    .select("*")
    .from("users")
    .where("username", username)
    .then((user) => {
      if (user.length === 0)
        return Promise.reject({ status: 404, msg: "username not found" });
      else {
        return user[0];
      }
    });
};
