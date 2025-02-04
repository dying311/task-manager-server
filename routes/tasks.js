const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authenticateToken = require('../middleware/auth'); // JWT 认证中间件

// 📥 获取当前用户的所有任务
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// ➕ 创建新任务
router.post('/', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new Task({
      title,
      description,
      user: req.user.id
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: '创建任务失败' });
  }
});

// 🔄 更新任务状态（完成/未完成）
router.put('/:id', async (req, res) => {
  try {
    const { title, completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, completed },  // 确保同时更新 title 和 completed
      { new: true }          // 返回更新后的文档
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: '更新任务失败' });
  }
});


// ❌ 删除任务
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: '未找到任务' });

    res.json({ message: '任务已删除' });
  } catch (err) {
    res.status(500).json({ message: '删除任务失败' });
  }
});

module.exports = router;
