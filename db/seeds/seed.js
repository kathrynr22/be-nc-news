const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function (knex) {

  const topicsInsertions = knex.insert(topicData).into('topics');
  const usersInsertions = knex.insert(userData).into('users');

  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return Promise.all([topicsInsertions, usersInsertions])
    })
    .then(() => {
      return knex('articles').insert(formatDates(articleData)).returning('*');
    })
    .then(articleRows => {
      //console.log(articleRows)
      const articleRef = makeRefObj(articleRows, 'title', 'article_id');
      //console.log(articleRef)
      //console.log(commentData)
      const formattedComments = formatComments(commentData, articleRef);
      console.log('inside the seed')
      console.log(formattedComments)
      return knex('comments').insert(formattedComments).returning('*');

    });
};