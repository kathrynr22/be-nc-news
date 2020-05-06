process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection')

beforeEach(() => connection.seed.run())
afterAll(() => connection.destroy())

describe('/api', () => {
  describe('status 404', () => {
    test('status 404: missing route', () => {
      return request(app)
        .get('/api/nowhere')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('resource not found');
        })
    })
  })
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
  describe('/users', () => {
    describe('/:username', () => {
      describe('GET', () => {
        test('status: 200 responds with the requested username object', () => {
          return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user[0]).toEqual({
                username: 'lurker',
                name: 'do_nothing',
                avatar_url:
                  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              })
            })
        })
        test('status 404: non-existent username', () => {
          return request(app)
            .get('/api/users/kathryn')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('username not found');
            })
        })

      })
    })

  })
  describe.only('/articles', () => {
    describe('/:article_id', () => {
      describe('GET', () => {
        test('status: 200 responds with an article object', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body: { articleObj } }) => {
              console.log('inside the test')
              //console.log(body.articleObj)
              //articleObj.forEach((article) => {
              expect(articleObj).toHaveProperty('article_id')
              expect(articleObj).toHaveProperty('author')
              expect(articleObj).toHaveProperty('body')
              expect(articleObj).toHaveProperty('created_at')
              expect(articleObj).toHaveProperty('title')
              expect(articleObj).toHaveProperty('votes')
            })
        })
        test('status: 200 responds with the specific requested article', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body: { articleObj } }) => {
              console.log('inside the second test')
              expect(articleObj.article_id).toEqual(1);

            })
        })
        test('status 404: non-existent article_id', () => {
          return request(app)
            .get('/api/articles/76666666')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('article_id not found');
            })
        })
        test('status 400: invalid article_id', () => {
          return request(app)
            .get('/api/articles/notAnInt')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('bad request');
            })
        })
      })
    })



  })
})



