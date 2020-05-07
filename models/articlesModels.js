const knex = require('../db/connection')

exports.selectArticleById = (article_id) => {

  //console.log('inside the selectArticle model')

  return knex
    .select('articles.*')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .where('articles.article_id', article_id)
    .groupBy('articles.article_id')
    .then((article) => {
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: 'article_id not found' })
      else {
        return article
      }
    })


}

exports.updateArticleById = (article_id, inc_votes) => {

  //console.log('inside the updateArticleById model')

  return knex('articles')
    .where('article_id', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then((article) => {
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: 'article_id not found' })
      else {
        return article
      }
    })
}

exports.sendPostedComment = (article_id, body, username) => {


  //console.log('inside the sendPostedComment model')

  let date = new Date()

  return knex('comments')
    .where('article_id', article_id)
    .insert([{
      author: username,
      body: body,
      article_id: article_id,
      created_at: date,
    },
    ])
    .returning('*')
  // .then((comment) => {
  //   console.log(comment)
  //   if (comment.length === 0)
  //     return Promise.reject({ status: 404, msg: 'article_id not found' })
  //   else {
  //     return comment
  //   }
  // })
}

//wouldnt let me do promise.reject and send 404 kept returning 500 and psql

exports.selectCommentsByArticleId = (article_id, sort_by, order) => {


  //console.log('inside the selectcommentsbyarticleid model')

  return knex
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where('article_id', article_id)
    .orderBy(sort_by || 'created_at', order || 'asc')
    .then((comment) => {
      console.log(comment)
      if (comment.length === 0)
        return Promise.reject({ status: 404, msg: 'article_id not found' })
      else {
        return comment
      }
    })
}




//JS treats undefined eg what sort_by could be as falsy which means that it has to choose between two values so if one of the values is falsy it choose the truthy value. So if sort_by is undefined it will default to cost_at_auction

// //.where('article_id', '=', article_id)
// // add || 0 after inc_votes?
//.orderBy(sort_by || "created_at", order || "asc");

exports.selectArticles = (sort_by, order, author, topic) => {

  console.log('inside the selectArticle model')
  //console.log(req.query)


  return knex
    .select('articles.author', 'title', 'articles.article_id', 'topic', 'articles.created_at', 'articles.votes')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .groupBy('articles.article_id')
    .orderBy(sort_by || 'created_at', order || 'desc')
    .modify((query) => {
      if (author) query.where('articles.author', author)
      if (topic) query.where('articles.topic', topic)
      //if (author) query.where({ 'articles.author': author })
      //})

    })
    .then((articles) => {

      if (articles.length === 0)
        return Promise.reject({ status: 404, msg: 'resource not found' })

      else {
        return articles
      }
    })

}

    // .then((articles) => {
    //     if (articles.sort_by != undefined && sort_by != "desc" || sort_by != undefined && sort_by != "asc")
    //       return Promise.reject({ status: 400, msg: 'bad request' })
    //     else {
    //       return articles
    //     }
    //   })

    // }




  // .then((articles) => {
  //   if (articles.sort_by != undefined && sort_by != "desc" || sort_by != undefined && sort_by != "asc")
  //     return Promise.reject({ status: 400, msg: 'bad request' })
  //   else {
  //     return articles
  //   }
  // })

//}
