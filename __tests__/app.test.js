process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

beforeEach(() => connection.seed.run());
afterAll(() => connection.destroy());

describe("/api", () => {
  describe("missing route", () => {
    test("status 404: missing route", () => {
      return request(app)
        .get("/api/nowhere")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("resource not found");
        });
    });
  });
  describe("/topics", () => {
    describe("GET", () => {
      test("status: 200 responds with an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.topics)).toBe(true);
            expect(body.topics.length).toBe(3);
          });
      });
      test("topic objects contains a slug and description property", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            body.topics.forEach((topic) => {
              expect(topic).toHaveProperty("slug");
              expect(topic).toHaveProperty("description");
            });
          });
      });
      test("invalid methods", () => {
        const invalidMethods = ["patch", "post", "delete"];
        const requests = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toBe("method not allowed");
            });
        });
        return Promise.all(requests);
      });
    });
  });
  describe("/users", () => {
    describe("/:username", () => {
      describe("GET", () => {
        test("status: 200 responds with the requested username object", () => {
          return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user[0]).toEqual({
                username: "lurker",
                name: "do_nothing",
                avatar_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              });
            });
        });
        test("status 404: non-existent username", () => {
          return request(app)
            .get("/api/users/kathryn")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("username not found");
            });
        });
        test("invalid methods", () => {
          const invalidMethods = ["patch", "post", "delete"];
          const requests = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/users/lurker")
              .expect(405)
              .then((res) => {
                expect(res.body.msg).toBe("method not allowed");
              });
          });
          return Promise.all(requests);
        });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      test("status: 200 responds with an articles array of article objects", () => {
        return request(app)
          .get("/api/articles/")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.articles)).toBe(true);
          });
      });
      test("each article object contains certain properties", () => {
        return request(app)
          .get("/api/articles/")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("comment_count");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("votes");
            });
          });
      });
      test("invalid methods", () => {
        const invalidMethods = ["patch", "post", "delete"];
        const requests = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/articles")
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toBe("method not allowed");
            });
        });
        return Promise.all(requests);
      });
      test("status 200: by default, sorts the articles by the created_at column and in descending order", () => {
        return request(app)
          .get("/api/articles/")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      test("status 200: sorts the articles by any valid column passed in as a query - test for author query", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("author", { descending: true });
          });
      });
      test("status 200: sorts the articles by any valid column passed in as a query - test for article_id query", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("article_id", {
              descending: true,
              coerce: true,
            });
          });
      });
      test("status 200: sorts the articles by any valid column passed in as a query - test for votes query", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes", { descending: true });
          });
      });
      test("status 200: sorts the articles by any valid column passed in as a query - test for topic query", () => {
        return request(app)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("topic", { descending: true });
          });
      });
      test("status 200: sorts the articles by any valid column passed in as a query - test for comment_count query", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("comment_count", {
              descending: true,
              coerce: true,
            });
          });
      });
      test("status 400: trying to sort articles based on a non-existent column", () => {
        return request(app)
          .get("/api/articles?sort_by=not_a_column")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      test("status 400: trying to sort comments for an invalid column", () => {
        return request(app)
          .get("/api/articles?sort_by=3232545")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      test("status 200: accepts an order by query that sorts the articles by descending order", () => {
        return request(app)
          .get("/api/articles/?order=desc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("status 200: accepts an order by query that sorts the articles by ascending order", () => {
        return request(app)
          .get("/api/articles/?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { ascending: true });
          });
      });
      // test("status 400: trying to order via an invalid method", () => {
      //   return request(app)
      //     .get("/api/articles/?order=disc")
      //     .expect(400)
      //     .then(({ body: { msg } }) => {
      //       expect(msg).toBe("bad request");
      //     });
      // });
      test("status 200: accepts a query that filters the articles by author", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].author).toEqual("butter_bridge");
          });
      });

      test("status 200: accepts a query that filters the articles by topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].topic).toEqual("cats");
          });
      });
      test("status 404: trying to filter articles based on a non-existent author", () => {
        return request(app)
          .get("/api/articles?author=kathryn")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("resource not found");
          });
      });
      test("status 404: trying to filter articles based on a non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=kathryn")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("resource not found");
          });
      });
      // test.only('status 400: trying to filter articles for an invalid author', () => {
      //   return request(app)
      //     .get('/api/articles?author=29395')
      //     .expect(400)
      //     .then(({ body: { msg } }) => {
      //       expect(msg).toBe('bad request');
      //     });
      // });
      // test.only('status 400: trying to order articles by an invalid method', () => {
      //   return request(app)
      //     .get('/api/articles/?order=disc')
      //     .expect(400)
      //     .then(({ body: { msg } }) => {
      //       expect(msg).toBe('bad request');
      //     });
      // });
      test("invalid method", () => {
        return request(app)
          .delete("/api/articles")
          .expect(405)
          .then((res) => {
            expect(res.body.msg).toBe("method not allowed");
          });
      });
    });
    describe("/:article_id", () => {
      describe("GET", () => {
        test("status: 200 responds with an article object", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { articleObj } }) => {
              expect(articleObj).toHaveProperty("article_id");
              expect(articleObj).toHaveProperty("author");
              expect(articleObj).toHaveProperty("body");
              expect(articleObj).toHaveProperty("created_at");
              expect(articleObj).toHaveProperty("title");
              expect(articleObj).toHaveProperty("votes");
            });
        });
        test("status: 200 responds with the specific requested article", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { articleObj } }) => {
              expect(articleObj.article_id).toEqual(1);
            });
        });
        test("status 404: non-existent article_id", () => {
          return request(app)
            .get("/api/articles/76666666")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("article_id not found");
            });
        });
        test("status 400: invalid article_id", () => {
          return request(app)
            .get("/api/articles/notAnInt")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
      });

      describe("PATCH", () => {
        test("responds with the updated article incremented", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article[0].votes).toEqual(101);
            });
        });
        test("responds with the updated article decremented", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article[0].votes).toEqual(99);
            });
        });
        test("status 404: trying to patch a non-existent article_id", () => {
          return request(app)
            .patch("/api/articles/76666666")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("article_id not found");
            });
        });
        test("status 400: trying to patch to an invalid article_id", () => {
          return request(app)
            .patch("/api/articles/notAnInt")
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
        test("status 400: trying to patch something invalid ie not incrementing or decrementing a vote", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "notAnInt" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
      });
    });
    describe("/:article_id/comments", () => {
      describe("POST", () => {
        test("status: 201 responds with the posted comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .expect(201)
            .send({
              username: "butter_bridge",
              body:
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            })
            .then(({ body }) => {
              expect(body.commentObj.body).toEqual(
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
              );
              expect(body.commentObj.article_id).toEqual(1);
              expect(body.commentObj.author).toEqual("butter_bridge");
            });
        });
        test("status 400: trying to comment on an invalid article_id not a number", () => {
          return request(app)
            .post("/api/articles/notAnInt/comments")
            .send({
              username: "butter_bridge",
              body:
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
        test("status 400: trying to comment on an invalid article_id article does not exist in articles table", () => {
          return request(app)
            .post("/api/articles/76666666/comments")
            .send({
              username: "butter_bridge",
              body:
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
        test("status 400: trying to comment anonymously", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({
              body:
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
        test("status 400: trying to post a blank comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "butter_bridge" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
      });
      describe("GET", () => {
        test("status 200: responds with an array of comment objects", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              console.log("inside the get comments test");
              expect(Array.isArray(body.comment)).toBe(true);
            });
        });
        test("comment object contains certain properties", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              body.comment.forEach((comment) => {
                expect(comment).toHaveProperty("comment_id");
                expect(comment).toHaveProperty("votes");
                expect(comment).toHaveProperty("created_at");
                expect(comment).toHaveProperty("author");
                expect(comment).toHaveProperty("body");
              });
            });
        });
        test("status 404: trying to get comments for an invalid article_id", () => {
          return request(app)
            .get("/api/articles/76666666/comments")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("article_id not found");
            });
        });
        test("status 400: trying to get comments for an invalid article_id not a number", () => {
          return request(app)
            .get("/api/articles/notAnInt/comments")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
        test("status 200: by default, sorts the comments by the created_at column ", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment).toBeSortedBy("created_at", { descending: true });
            });
        });
        test("status 200: sorts the comments by any valid column passed in as a query - test for votes query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment).toBeSortedBy("votes", { descending: true });
            });
        });
        test("status 200: sorts the comments by any valid column passed in as a query - test for comment_id query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=comment_id")
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment).toBeSortedBy("comment_id", {
                descending: true,
                coerce: true,
              });
            });
        });
        test("status 200: sorts the comments by any valid column passed in as a query - test for author query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author")
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment).toBeSortedBy("author", { descending: true });
            });
        });
        test("status 404: trying to sort comments for a non-existent article_id", () => {
          return request(app)
            .get("/api/articles/76666666/comments?sort_by=author")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("article_id not found");
            });
        });
        test("status 400: trying to sort comments for an invalid article_id", () => {
          return request(app)
            .get("/api/articles/notAnInt/comments?sort_by=author")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
        test("status 200: accepts an order by query that sorts the comments by descending order", () => {
          return request(app)
            .get("/api/articles/1/comments?order=desc")
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment).toBeSortedBy("created_at", { descending: true });
            });
        });
        test("status 404: trying to order comments for a non-existent article_id", () => {
          return request(app)
            .get("/api/articles/76666666/comments?order=desc")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("article_id not found");
            });
        });
        test("status 400: trying to order comments for an invalid article_id", () => {
          return request(app)
            .get("/api/articles/notAnInt/comments?order=desc")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
      });
    });
  });
  describe("/comments", () => {
    describe("/:comment_id", () => {
      describe("PATCH", () => {
        test("responds with the updated comment incremented", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment[0].votes).toEqual(17);
            });
        });
        test("responds with the updated comment decremented", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment[0].votes).toEqual(15);
            });
        });
        test("status 404: trying to patch a non-existent comment_id", () => {
          return request(app)
            .patch("/api/comments/76666666")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("comment_id not found");
            });
        });
        test("status 400: trying to patch to an invalid article_id", () => {
          return request(app)
            .patch("/api/comments/notAnInt")
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
        test("status 400: trying to patch something invalid ie not incrementing or decrementing a vote", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "notAnInt" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
      });
      describe("DELETE", () => {
        test("status 204 deletes comment from comments table by comment_id", () => {
          return request(app).del("/api/comments/1").expect(204);
        });
        test("status 404 trying to delete comment of a non-existent comment_id", () => {
          return request(app)
            .del("/api/comments/15454")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("comment_id not found");
            });
        });
        test("status 400 trying to delete comment of an invalid comments_id", () => {
          return request(app)
            .del("/api/comments/notAnInt")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
      });
    });
  });
});
