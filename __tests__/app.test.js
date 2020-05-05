process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection')

beforeEach(() => connection.seed.run())
afterAll(() => connection.destroy())

describe('/api', () => {
  describe('/topics', () => {
    describe('GET', () => {
      test('status: 200 responds with an array of topic objects', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            console.log(body)
            expect(Array.isArray(body.topics)).toBe(true)
            expect(body.topics.length).toBe(3)
          })
      })
      test('topic objects contains a slug and description property', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            body.topics.forEach((topic) => {
              expect(topic).toHaveProperty('slug')
              expect(topic).toHaveProperty('description')
            })
          })
      })
      test('invalid methods', () => {
        const invalidMethods = ['patch', 'post', 'delete'];
        const requests = invalidMethods.map((method) => {
          return request(app)
          [method]('/api/topics')
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toBe('method not allowed')
            })
        })
        return Promise.all(requests)

      })
    })
  })
})
