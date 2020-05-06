const knex = require('../db/connection')

exports.selectArticle = (article_id) => {
  console.log('inside select articles models')
  // return knex.select('*').from('users').where('username', username)
  //   .then((user) => {
  //     if (user.length === 0)
  //       return Promise.reject({ status: 404, msg: 'username not found' })
  //     else {
  //       return knex.select('*').from('users').where('username', username)
  //     }
  //   })
}


