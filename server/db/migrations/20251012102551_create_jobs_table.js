/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('jobs', (table) => {
    table.increments('id').primary();
    table.string('user_description').notNullable();
    table.string('image_url').notNullable();
    table.string('ai_identified_problem');
    table.string('ai_identified_category');
    table.enum('status', ['open', 'claimed', 'in_progress', 'completed']).defaultTo('open');
    table.integer('provider_id').unsigned().references('id').inTable('providers');
    table.timestamps(true, true);
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) { 
    return knex.schema.dropTable('jobs'); 
};
