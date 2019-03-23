var express = require('express');
var router = express.Router();

const indexController = require('../controllers/index');
const { authenticate } = require('../middlewares/index');

/* GET home page. */
router
  .get('/', authenticate, indexController.index)
  .get('/history', authenticate, indexController.history)
  .post('/todos', authenticate, indexController.addTodo)
  .get('/delete-todo/:id', authenticate, indexController.deleteTodo)
  .get('/toggle-todo/:id', authenticate, indexController.toggleTodo)
  .get('/update-todo/:id', authenticate, indexController.updateTodo);

module.exports = router;
