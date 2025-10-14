/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('providers', (table) => {
    table.increments('id').primary();
    table.string('business_name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('service_category').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) { return knex.schema.dropTable('providers'); };