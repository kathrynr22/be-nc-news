
// Each user should have:

// - `username` which is the primary key & unique
//   - `avatar_url`
//   - `name

exports.up = function (knex) {

  console.log('creating users table...')

  return knex.schema.createTable('users', (usersTable) => {

    usersTable.string('username').primary().unique().notNullable();
    usersTable.string('avatar_url');
    usersTable.string('name').notNullable();
  });
};

exports.down = function (knex) {

  console.log('removing users table...')
  return knex.schema.dropTable('users');

};
