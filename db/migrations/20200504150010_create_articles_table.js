// Each article should have:

// - `article_id` which is the primary key
//   - `title`
//   - `body`
//   - `votes` defaults to 0
//   - `topic` field which references the slug in the topics table
//   - `author` field that references a user's primary key (username)
//   - `created_at` defaults to the current timestamp


exports.up = function (knex) {

  console.log('creating articles table...')

  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable
      .increments('article_id')
      .primary()
      .notNullable();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.string('topic').references('topics.slug');
    articlesTable.string('author').references('users.username');
    articlesTable.timestamp("created_at", { precision: 6 }).defaultTo(knex.fn.now(6));
  });
};


exports.down = function (knex) {

  console.log('removing articles table...')

  return knex.schema.dropTable('articles');

};
