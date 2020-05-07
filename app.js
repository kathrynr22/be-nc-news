const express = require("express");
const apiRouter = require("./routes/apiRouter");
const {
  handleInternalErrors,
  handleCustomErrors,
  handlePSQLErrors,
  send404,
} = require("./controllers/errorControllers");
const app = express();

app.use(express.json());
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

// app.listen(9090, (err) => {
//   if (err) throw err;
//   else console.log("listening on port 9090");
// });

module.exports = app;
