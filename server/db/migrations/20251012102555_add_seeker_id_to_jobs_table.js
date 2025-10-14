/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('jobs', (table) => {
    table.integer('seeker_id').unsigned().notNullable().references('id').inTable('seekers');
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('jobs', (table) => { table.dropColumn('seeker_id'); });
};
