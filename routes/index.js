var express = require('express');
var router = express.Router();

const indexController = require('../controllers/index');
const { authenticate } = require('../middlewares/index');

/* GET home page. */
router
  .get('/', authenticate, indexController.index)
  .post('/todos', authenticate, indexController.addTodo)
  .get('/delete-todo/:id', authenticate, indexController.deleteTodo);

module.exports = router;
