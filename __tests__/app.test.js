process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

beforeEach(() => connection.seed.run());
afterAll(() => connection.destroy());

describe("/api", () => {
  describe("/api only", () => {
    test("status 404: missing route", () => {
      return request(app)
        .get("/api/nowhere")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("resource not found");
        });
    });
    test("status 405: invalid methods", () => {
      const invalidMethods = ["patch", "post", "delete"];
      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("method not allowed");
          });
      });
      return Promise.all(requests);
    });
  });
  describe("/topics", () => {
    test("status 405: invalid methods", () => {
      const invalidMethods = ["patch", "post", "delete"];
      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("method not allowed");
          });
      });
      return Promise.all(requests);
    });
    describe("GET", () => {
      test("status 200: responds with an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.topics)).toBe(true);
            expect(body.topics.length).toBe(3);
            expect(body.topics.length).toBe(3);
          });
      });
      test("status 200: topic objects contains a slug and description property", () => {
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
    });
  });
  describe("/users", () => {
    test("status 405: invalid methods", () => {
      const invalidMethods = ["patch", "post", "delete"];
      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/users/lurker")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("method not allowed");
          });
      });
      return Promise.all(requests);
    });
    describe("/:username", () => {
      describe("GET", () => {
        test("status 200: responds with the requested username object", () => {
          return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .then(({ body: { userObject } }) => {
              expect(userObject).toEqual({
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
      });
    });
  });
  describe("/articles", () => {
    test("status 405: invalid methods", () => {
      const invalidMethods = ["patch", "post", "delete"];
      const requests = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/articles")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("method not allowed");
          });
      });
      return Promise.all(requests);
    });
    describe("GET", () => {
      test("status 200: responds with an articles array of article objects", () => {
        return request(app)
          .get("/api/articles/")
          .expect(200)
          .then(({ body: { allArticles } }) => {
            expect(Array.isArray(allArticles)).toBe(true);
          });
      });
      test("status 200: each article object contains certain properties", () => {
        return request(app)
          .get("/api/articles/")
          .expect(200)
          .then(({ body: { allArticles } }) => {
            allArticles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("comment_count");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("votes");
            });
          });
      });

      test("status 200: by default, sorts the articles by the created_at column and in descending order", () => {
        return request(app)
          .get("/api/articles/")
          .expect(200)
          .then(({ body: { allArticles } }) => {
            expect(allArticles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      test("status 200: sorts the articles by any valid column passed in as a query - test for author query", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body: { allArticles } }) => {
            expect(allArticles).toBeSortedBy("author", { descending: true });
          });
      });
      test("status 200: sorts the articles by any valid column passed in as a query - test for article_id query", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body: { allArticles } }) => {
            expect(allArticles).toBeSortedBy("article_id", {
              descending: true,
              coerce: true,
            });
          });
      });
      test("status 200: sorts the articles by any valid column passed in as a query - test for votes query", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body: { allArticles } }) => {
            expect(allArticles).toBeSortedBy("votes", { descending: true });
          });
      });
      test("status 200: sorts the articles by any valid column passed in as a query - test for topic query", () => {
        return request(app)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then(({ body: { allArticles } }) => {
            expect(allArticles).toBeSortedBy("topic", { descending: true });
          });
      });
      test("status 200: sorts the articles by any valid column passed in as a query - test for comment_count query", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body: { allArticles } }) => {
            expect(allArticles).toBeSortedBy("comment_count", {
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
          .then(({ body: { allArticles } }) => {
            expect(allArticles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      test("status 200: accepts an order by query that sorts the articles by ascending order", () => {
        return request(app)
          .get("/api/articles/?order=asc")
          .expect(200)
          .then(({ body: { allArticles } }) => {
            expect(allArticles).toBeSortedBy("created_at", { ascending: true });
          });
      });
      test("status 200: accepts a query that filters the articles by author", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body: { allArticles } }) => {
            expect(allArticles[0].author).toEqual("butter_bridge");
          });
      });

      test("status 200: accepts a query that filters the articles by topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body: { allArticles } }) => {
            expect(allArticles[0].topic).toEqual("cats");
          });
      });
      test("status 404: trying to filter articles based on a non-existent author", () => {
        return request(app)
          .get("/api/articles?author=kathryn")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("author not found");
          });
      });
      test("status 404: trying to filter articles based on a non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=kathryn")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("topic not found");
          });
      });
      test("status 200: responds with empty array when articles for an author that does exist but has no articles is requested", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body: { allArticles } }) => {
            expect(Array.isArray(allArticles)).toBe(true);
            expect(allArticles.length).toBe(0);
            expect(allArticles).toEqual([]);
          });
      });
      test("status 200: responds with empty array when articles for an author that does exist but has no articles is requested", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(({ body: { allArticles } }) => {
            expect(Array.isArray(allArticles)).toBe(true);
            expect(allArticles.length).toBe(0);
            expect(allArticles).toEqual([]);
          });
      });
      test("status 400: trying to order articles by an invalid method", () => {
        return request(app)
          .get("/api/articles/?order=disc")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
    });
    describe("/:article_id", () => {
      test("status 405: invalid methods", () => {
        const invalidMethods = ["post", "delete"];
        const requests = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/articles/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("method not allowed");
            });
        });
        return Promise.all(requests);
      });
      describe("GET", () => {
        test("status 200: responds with an article object", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { articleById } }) => {
              expect(articleById).toHaveProperty("article_id");
              expect(articleById).toHaveProperty("author");
              expect(articleById).toHaveProperty("body");
              expect(articleById).toHaveProperty("created_at");
              expect(articleById).toHaveProperty("title");
              expect(articleById).toHaveProperty("votes");
            });
        });
        test("status 200: responds with the specific requested article", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { articleById } }) => {
              expect(articleById.article_id).toEqual(1);
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
        test("status 200: responds with the updated article incremented", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body: { patchedArticle } }) => {
              expect(patchedArticle.votes).toEqual(101);
            });
        });
        test("status 200: responds with the updated article decremented", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -1 })
            .expect(200)
            .then(({ body: { patchedArticle } }) => {
              expect(patchedArticle.votes).toEqual(99);
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
        test("status 200: sends an unchanged article object for the relevant article_id when no inc_votes is provided to the request the body", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ cfgcfu: 100 })
            .expect(200)
            .then(({ body: { patchedArticle } }) => {
              expect(patchedArticle).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 100,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z",
              });
            });
        });
        test("status 200: sends an unchanged article object for the relevant article_id when nothing at all is provided to the request the body", () => {
          return request(app)
            .patch("/api/articles/1")
            .send()
            .expect(200)
            .then(({ body: { patchedArticle } }) => {
              expect(patchedArticle).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 100,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z",
              });
            });
        });
      });
    });

    describe("/:article_id/comments", () => {
      test("status 405: invalid methods", () => {
        const invalidMethods = ["patch", "delete"];
        const requests = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/articles/1/comments")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("method not allowed");
            });
        });
        return Promise.all(requests);
      });
      describe("POST", () => {
        test("status 201: responds with the posted comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .expect(201)
            .send({
              username: "butter_bridge",
              body:
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            })
            .then(({ body: { postedComment } }) => {
              expect(postedComment.body).toEqual(
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
              );
              expect(postedComment.article_id).toEqual(1);
              expect(postedComment.author).toEqual("butter_bridge");
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
            .then(({ body: { commentsByArticleId } }) => {
              expect(Array.isArray(commentsByArticleId)).toBe(true);
            });
        });
        test("status 200: comment object contains certain properties", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { commentsByArticleId } }) => {
              commentsByArticleId.forEach((comment) => {
                expect(comment).toHaveProperty("comment_id");
                expect(comment).toHaveProperty("votes");
                expect(comment).toHaveProperty("created_at");
                expect(comment).toHaveProperty("author");
                expect(comment).toHaveProperty("body");
              });
            });
        });
        test("status 404: trying to get comments for a non-existent article_id", () => {
          return request(app)
            .get("/api/articles/76655/comments")
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
        test("status 200: by default, sorts the comments by the created_at column and by descending order", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { commentsByArticleId } }) => {
              expect(commentsByArticleId).toBeSortedBy("created_at", {
                descending: true,
              });
            });
        });
        test("status 200: sorts the comments by any valid column passed in as a query - test for votes query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(({ body: { commentsByArticleId } }) => {
              expect(commentsByArticleId).toBeSortedBy("votes", {
                descending: true,
              });
            });
        });
        test("status 200: sorts the comments by any valid column passed in as a query - test for comment_id query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=comment_id")
            .expect(200)
            .then(({ body: { commentsByArticleId } }) => {
              expect(commentsByArticleId).toBeSortedBy("comment_id", {
                descending: true,
                coerce: true,
              });
            });
        });
        test("status 200: sorts the comments by any valid column passed in as a query - test for author query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author")
            .expect(200)
            .then(({ body: { commentsByArticleId } }) => {
              expect(commentsByArticleId).toBeSortedBy("author", {
                descending: true,
              });
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
            .then(({ body: { commentsByArticleId } }) => {
              expect(commentsByArticleId).toBeSortedBy("created_at", {
                descending: true,
              });
            });
        });
        test("status 200: accepts an order by query that sorts the comments by ascending order", () => {
          return request(app)
            .get("/api/articles/1/comments?order=asc")
            .expect(200)
            .then(({ body: { commentsByArticleId } }) => {
              expect(commentsByArticleId).toBeSortedBy("created_at", {
                ascending: true,
              });
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
        test("status 200: responds with empty array when an article exists but has no comments", () => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body: { commentsByArticleId } }) => {
              expect(Array.isArray(commentsByArticleId)).toBe(true);
              expect(commentsByArticleId.length).toBe(0);
              expect(commentsByArticleId).toEqual([]);
            });
        });
        test("status 400: trying to order articles by an invalid method", () => {
          return request(app)
            .get("/api/articles/1/comments?order=disc")
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
      test("status 405: invalid methods", () => {
        const invalidMethods = ["get", "post"];
        const requests = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/comments/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("method not allowed");
            });
        });
        return Promise.all(requests);
      });
      describe("PATCH", () => {
        test("status 200: responds with the updated comment incremented", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body: { patchedComment } }) => {
              expect(patchedComment.votes).toEqual(17);
            });
        });
        test("status 200: responds with the updated comment decremented", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -1 })
            .expect(200)
            .then(({ body: { patchedComment } }) => {
              expect(patchedComment.votes).toEqual(15);
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
        test("status 200: sends an unchanged comment object for the relevant comment_id when no inc_votes is provided to the request the body", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ djgodjg: 100 })
            .expect(200)
            .then(({ body: { patchedComment } }) => {
              expect(patchedComment).toEqual({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 16,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              });
            });
        });
        test("status 200: sends an unchanged comment object for the relevant comment_id when nothing at all is provided to the request the body", () => {
          return request(app)
            .patch("/api/comments/1")
            .send()
            .expect(200)
            .then(({ body: { patchedComment } }) => {
              expect(patchedComment).toEqual({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 16,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              });
            });
        });
      });
      describe("DELETE", () => {
        test("status 204: deletes comment from comments table by comment_id", () => {
          return request(app).del("/api/comments/1").expect(204);
        });
        test("status 404: trying to delete comment of a non-existent comment_id", () => {
          return request(app)
            .del("/api/comments/15454")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("comment_id not found");
            });
        });
        test("status 400: trying to delete comment of an invalid comments_id", () => {
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
