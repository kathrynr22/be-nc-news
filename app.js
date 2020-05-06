const express = require('express');
const apiRouter = require('./routes/apiRouter')
const { handleInternalErrors, handle405s, send404 } = require('./controllers/errorControllers')
const app = express();

app.use(express.json());
app.use('/api', apiRouter);
app.use(send404)

app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg })
  else next(err)
})
app.use(handle405s)
app.use(handleInternalErrors);

module.exports = app;
//why is this not green