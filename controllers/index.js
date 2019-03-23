const dayjs = require('dayjs');

const TodoModel = require('../models/todo');
const { getDate } = require('../utils/index');

module.exports = {
  index: (req, res, next) => {
    const [year, month, day] = getDate();
    const { user } = req.session;

    TodoModel.find({
      creator: user._id,
      createAt: { $gte: new Date(year, month, day) }
    })
      .sort({
        createAt: -1
      })
      .exec((err, todos) => {
        if (err) throw err;

        res.render('index.art', {
          name: user.name,
          todos,
          formatTime: time => dayjs(time).format('HH:mm:ss'),
          now: dayjs().format('YYYY-MM-DD HH:mm:ss')
        });
      });
  },
  history: (req, res, next) => {
    const [year, month, day] = getDate();
    const { user } = req.session;

    TodoModel.find({
      creator: user._id,
      createAt: { $lt: new Date(year, month, day) }
    })
      .sort({
        createAt: -1
      })
      .exec((err, docs) => {
        if (err) throw err;

        const todos = {};

        docs.forEach(todo => {
          todo = todo.toObject();
          let { createAt } = todo;

          createAt = dayjs(createAt).format('YYYY-MM-DD');

          if (!todos[createAt]) {
            todos[createAt] = [todo];
          } else {
            todos[createAt] = [...todos[createAt], todo];
          }
        });

        const keys = Object.keys(todos);

        res.render('history.art', {
          name: user.name,
          todos: keys.length > 0 ? todos : null,
          formatTime: time => dayjs(time).format('HH:mm:ss')
        });
      });
  },
  addTodo: (req, res, next) => {
    const { body, session } = req;
    const { user } = session;
    const { text, priority } = body;

    TodoModel.create({
      text,
      priority,
      creator: user._id
    })
      .then(doc => {
        res.redirect('/');
      })
      .catch(err => console.log(err));
  },
  deleteTodo: (req, res, next) => {
    TodoModel.findByIdAndDelete({
      _id: req.params.id
    }).exec((err, doc) => {
      if (err) throw err;

      res.redirect('/');
    });
  },
  toggleTodo: (req, res, next) => {
    const id = req.params.id;

    TodoModel.findOne({ _id: id }).exec((err, doc) => {
      doc.completed = !doc.completed;

      doc.save().then(doc => {
        console.log(doc);

        res.redirect('/');
      });
    });
  },
  updateTodo: (req, res, next) => {
    const id = req.params.id;
    const text = req.query.text;

    TodoModel.findOne({
      _id: id
    }).exec((err, doc) => {
      doc.text = text;

      doc.save().then(doc => {
        res.redirect('/');
      });
    });
  }
};
