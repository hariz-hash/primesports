// Setting up the database connection
const knex = require('knex')({
    client: 'mysql',
    connection: {
      user: 'admin',
      password:'123',
      database:'shoes'
    }
  })
  const bookshelf = require('bookshelf')(knex)
  
  module.exports = bookshelf;