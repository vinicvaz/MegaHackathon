exports.up = async function (knex) {
  return await knex.schema.createTable('questions', table => {
    table.increments('id')
    table.string('user').notNullable()
    table.string('question').notNullable()
    table.string('status').notNullable()
    table.string('answer')
    table.boolean('is_good')

    table.integer('product_id').notNullable()
    table.foreign('product_id').references('id').inTable('products')
  })
}

exports.down = async function (knex) {
  return await knex.schema.dropTable('questions')
}
