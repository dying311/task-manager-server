const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 定义用户数据模型
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // 用户名唯一
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // 自动添加创建时间和更新时间

// 保存用户数据前自动加密密码
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10); // 生成盐
    this.password = await bcrypt.hash(this.password, salt); // 加密密码
    next();
  } catch (error) {
    next(error);
  }
});

// 验证密码方法
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 导出用户模型
module.exports = mongoose.model('User', userSchema);
