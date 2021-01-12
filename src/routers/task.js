const express = require('express');
const router = new express.Router();
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

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/tasks', auth, async (req, res) => {
  const match = {};
  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }
  try {
    await req.user
      .populate({
        path: 'tasks',
        match,
        optopns: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip)
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
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

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUbdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) =>
    allowedUbdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((element) => (task[element] = req.body[element]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
