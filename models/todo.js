const mongoose = require('mongoose');
const dayjs = require('dayjs');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createAt: {
    type: Date,
    default: () => new Date()
  },
  creator: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  }
});

const Todo = (module.exports = mongoose.model('Todo', todoSchema));
