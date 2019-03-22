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
    const { params } = req;

    const { id } = params;
    TodoModel.findByIdAndDelete({
      _id: id
    }).exec((err, doc) => {
      if (err) throw err;

      res.redirect('/');
    });
  }
};
