process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection')

describe('/api', () => {
  describe('/topics', () => {
    describe('GET', () => {
      test('status: 200 responds with an array of topic objects', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.topics)).toBe(true)
          })
      })
    })
  })
})
