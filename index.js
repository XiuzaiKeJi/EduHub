const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: '欢迎使用 EduHub API' });
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 