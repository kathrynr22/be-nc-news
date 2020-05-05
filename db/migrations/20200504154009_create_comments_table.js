// Each comment should have:

// - `comment_id` which is the primary key
// - `author` field that references a user's primary key (username)
// - `article_id` field that references an article's primary key
// - `votes` defaults to 0
// - `created_at` defaults to the current timestamp
// - `body`


exports.up = function (knex) {

  console.log('creating comments table...')

  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable
      .increments('comment_id')
      .primary()
      .notNullable();
    commentsTable
      .string('author')
      .references('users.username')
      .notNullable();
    commentsTable.integer('article_id').references('articles.article_id');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.timestamp("created_at", { precision: 6 }).defaultTo(knex.fn.now(6));
    commentsTable.text('body').notNullable();
  });
};


exports.down = function (knex) {

  console.log('removing comments table...')

  return knex.schema.dropTable('comments');

};
