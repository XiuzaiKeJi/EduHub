const request = require('supertest');
const app = require('../index');

describe('API 测试', () => {
  test('GET / 应该返回欢迎消息', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', '欢迎使用 EduHub API');
  });
}); 