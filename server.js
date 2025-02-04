require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // 引入 CORS 中间件

const app = express();

// 配置 CORS
app.use(cors({
  origin: 'http://localhost:3001',  // 允许前端访问的地址
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],  // 允许请求头
  credentials: true
}));

app.use(express.json()); // 解析 JSON 数据

// 连接数据库
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ 数据库连接成功！'))
  .catch(err => console.error('❌ 数据库连接失败：', err));

// 挂载用户认证路由
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// 挂载任务路由
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

// 测试根路由
app.get('/', (req, res) => {
  res.send('🎉 欢迎使用任务管理系统 API！');
});

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 服务器已启动：http://localhost:${PORT}`));
