
// Each topic should have:

// - `slug` field which is a unique string that acts as the table's primary key
//   - `description` field which is a string giving a brief description of a given topic

//tried removing .unique() but error message still referred to duplicate key violates unique constraint topics_key, having a primary key should already force a unique constraint so i dont think i need to add that anyway. removed it

exports.up = function (knex) {

  console.log('creating topics table...')

  return knex.schema.createTable('topics', (topicsTable) => {
    topicsTable.string('slug').primary().notNullable();
    topicsTable.string('description').notNullable();
  });
};

exports.down = function (knex) {

  console.log('removing topics table...')

  return knex.schema.dropTable('topics');
};



