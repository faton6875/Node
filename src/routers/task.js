const express = require('express');
const router = new express.Router();
const url = require('url');
const Task = require('../models/task.js');
const auth = require('../middleware/auth');

router.post('/tasks', (req, res) => {
  const task = new Task({ ...req.body });
  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);

    if (!task) {
      return res.status(404).send();
    }
    res.send({
      id: task.id,
      description: task.description,
      owner: task.owner,
      status: task.status
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/tasks', async (req, res) => {
  // const match = {};
  // if (req.query.completed) {
  //   match.completed = req.query.completed === 'true';
  // }
  // try {
  //   await req.user
  //     .populate({
  //       path: 'tasks',
  //       match,
  //       optopns: {
  //         limit: parseInt(req.query.limit),
  //         skip: parseInt(req.query.skip)
  //       }
  //     })
  //     .execPopulate();
  //   res.send(req.user.tasks);
  // } catch (e) {
  //   res.status(500).send();
  // }

  res.set('Content-Range', 'tasks 0-24/319');
  res.set('Access-Control-Expose-Headers', 'Content-Range');
  try {
    if (req.query.filter) {
      let queryData = url.parse(req.url, true).query;
      console.log('Query:', queryData.filter.description);
      //const task = Task.find({ description: req.query.filter.q });
      //task.getFilter(); // `{ name: 'Jean-Luc Picard' }`

      const search = JSON.parse(req.query.filter);
      console.log(search);
      const task = await Task.find(search);
      const result = task.map((item) => {
        return {
          id: item._id,
          description: item.description,
          owner: item.owner,
          status: item.status
        };
      });
      res.status(200).send(result);
    }
    const task = await Task.find({});

    const result = task.map((item) => {
      return {
        id: item._id,
        description: item.description,
        owner: item.owner,
        status: item.status
      };
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/tasks', auth, async (req, res) => {
  const _id = req.param_id;

  try {
    await req.user.populate('tasks').execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.put('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUbdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) =>
    allowedUbdates.includes(update)
  );

  // if (!isValidOperation) {
  //   return res.status(400).send({ error: 'Invalid updates!' });
  // }
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((element) => (task[element] = req.body[element]));
    await task.save();
    res.send({
      id: task.id,
      description: task.description,
      owner: task.owner,
      status: task.status
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(_id);
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
