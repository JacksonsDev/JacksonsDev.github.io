const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

// Get all tasks for user
router.get('/', authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

// Add task
router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const task = await Task.create({ title, description, userId: req.userId });
  res.status(201).json(task);
});

// Toggle complete
router.patch('/:id/toggle', authMiddleware, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// Delete
router.delete('/:id', authMiddleware, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

module.exports = router;
