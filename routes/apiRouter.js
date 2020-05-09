const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");

const { handle405s } = require("../controllers/errorControllers");

apiRouter
  .route("/")
  .get((req, res, next) => {
    res.status(200).send({ msg: "api up and running" });
  })
  .all(handle405s);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
