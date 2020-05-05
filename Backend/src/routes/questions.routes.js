const QuestionController = require('../controllers/QuestionController')
const express = require('express')

const questionsRouter = express.Router()

questionsRouter.get('/', QuestionController.index)
questionsRouter.get('/random', QuestionController.index_all)
questionsRouter.post(
  '/',
  QuestionController.checkIfSwearing,
  QuestionController.getPredictions,
  QuestionController.verify,
  QuestionController.create,
)
questionsRouter.patch('/answer', QuestionController.answer)
questionsRouter.get('/check-swearing', QuestionController.checkIfSwearing)
questionsRouter.get('/awaiting/count', QuestionController.getAwaitingCount)

module.exports = questionsRouter
