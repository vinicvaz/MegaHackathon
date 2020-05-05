const ProductsController = require('../controllers/ProductsController')
const express = require('express')
const multer = require('multer')
const uploadConfig = require('../config/config')

const upload = multer(uploadConfig)

const productsRouter = express.Router()

productsRouter.get('/', ProductsController.index)
productsRouter.post('/', ProductsController.create)
productsRouter.post(
  '/json',
  upload.single('json'),
  ProductsController.json_import,
)

module.exports = productsRouter
