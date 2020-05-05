const connection = require('../database/connection')
const path = require('path')
const fs = require('fs')
const promisify = require('util').promisify
const stat = promisify(fs.readFile)

module.exports = {
  async index(request, response) {
    try {
      const products = await connection('products').select('*')

      return response.json(products)
    } catch (err) {
      return response.json(err).status(500)
    }
  },

  async create(request, response) {
    try {
      const {
        name,
        quantity,
        size,
        color,
        price,
        weight,
        description,
      } = request.body
      let width = null
      let height = null
      let lenght = null

      if (size.width && size.height && size.lenght) {
        width = size.width
        height = size.height
        lenght = size.lenght
      }

      const [id] = await connection('products').insert(
        {
          name,
          quantity,
          width,
          height,
          lenght,
          color,
          price,
          weight,
          description,
        },
        'id',
      )

      return response.json({ id, name })
    } catch (err) {
      return response.json(err)
    }
  },
  async json_import(request, response) {
    try {
      const tempDir = path.join(
        __dirname,
        '..',
        '..',
        'tmp',
        request.file.filename,
      )

      stat(tempDir)
        .then(status => {
          return response.json(JSON.parse(status))
        })
        .catch(err => {
          console.log(err)
          return response.send(err)
        })
    } catch (err) {
      return response.status(400).json(err)
    }
  },
}
