
exports.up = function(knex, Promise) {
return knex.schema.createTable('products', (table) => {
    table.increments();
    table.string('name').notNullable().unique();
    table.string('desc').notNullable();
    table.integer('age').notNullable();
    table.boolean('available').notNullable();
  });
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('products');
};
