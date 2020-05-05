exports.up = async function (knex) {
  return await knex.schema.createTable('products', table => {
    table.increments('id')
    table.string('name').notNullable()
    table.integer('quantity').notNullable()
    table.float('price').notNullable()
    table.float('width')
    table.float('height')
    table.float('lenght')
    table.string('description')
    table.string('color')
    table.float('weight')
    table.string('image')
  })
}

exports.down = async function (knex) {
  return await knex.schema.dropTable('products')
}
