const express = require("express");
const apiRouter = require("./routes/apiRouter");
const {
  handleInternalErrors,
  handleCustomErrors,
  handlePSQLErrors,
  send404,
} = require("./controllers/errorControllers");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  const { method, url } = req;
  console.log(`error occured on ${method} ${url}:`, err);
  next(err);
});

app.use(send404);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;
