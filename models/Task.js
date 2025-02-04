const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },          // 任务标题
  description: { type: String },                    // 任务描述
  completed: { type: Boolean, default: false },     // 任务状态（默认未完成）
  user: {                                           // 关联用户
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });                           // 自动生成创建/更新时间

module.exports = mongoose.model('Task', taskSchema);
