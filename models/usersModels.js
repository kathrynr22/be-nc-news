const knex = require('../db/connection')

// knex('users').where('id', 1)
// Outputs:
// select * from`users` where`id` = 1

exports.selectUsername = (username) => {
  console.log('inside select topics models')
  return knex.select('*').from('users').where('username', username)
}