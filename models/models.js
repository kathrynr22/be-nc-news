const knex = require('../db/connection')

exports.selectTopics = () => {
  console.log('inside select topics models')
  return knex.select('*').from('topics')
}