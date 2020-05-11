# NC News Back-End Project

Northcoders News (NC-News) is a news aggregation, web content rating, and discussion website similar to Reddit.

It hosts articles which are divided into topics such as coding, football and cooking.

Each article has a rating which can be up or down voted by a registered user.

Users can also add comments about an article. Comments can also be up or down voted. A user can also delete their comments should they wish.

The project has been built using the following:

- Express: a web application framework for Node.js.
- PostgreSQL: an open source relational database
- Knex: an SQL query builder for relational databases
- Jest: a testing framework
- Jest Sorted: which makes it easier to test if an array has been correctly sorted.
- Supertest: for testing HTTP assertions

The project is supplied with a test and a development database.

The API has been hosted on Heroku and can be found here: https://kathryn-nc-news.herokuapp.com/

## Getting Started

### **Installation**

1. Fork and clone this repository

`git clone https://github.com/kathrynr22/be-nc-news`

2. cd into the repository

`cd be-nc-news`

3. install the dependencies

`npm install`

4. Set up and seed the databases

`npm run seed-dev`

`npm run seed-test`

### Running the tests

I have followed TDD (Test Driven Development) best practice when building this application and it is built on the basis of RESTful endpoints.

To test the utility functions:

`npm run test utils`

To test the API:

`npm run test app`

To test the entire application:

`npm test`

## What endpoints are being tested?

- `GET /api/topics` - Responds with an array of topic objects.
- `GET /api/users/:username` - Responds with a user object.
- `GET /api/articles/:article_id/` - Responds with an article object.
- `PATCH /api/articles/:article_id/` - Responds with an article object with the votes property incremented/decremented.
- `POST /api/articles/:article_id/comments` - Responds with a posted comment.
- `GET /api/articles/:article_id/comments` - Responds with an array of comments for a given article_id and accepts sort_by and order queries.
- `GET /api/articles` - Responds with an array of article objects and allows for sort_by, order, author and topic queries.
- `PATCH /api/comments/:comment_id/` - Responds with an updated comment object, with the votes property incremented/decremented.
- `DELETE /api/comments/:comment_id` - Deletes a comment by its comment_id.

The tests cover both "happy path" scenarios as well as various "unhappy path" scenarios.

**Author**

Kathryn Roberts
