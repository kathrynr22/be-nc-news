const express = require('express');
const apiRouter = require('./routes/apiRouter')
const { handleInternalErrors } = require('./controllers/errors.controllers')
const app = express();

app.use(express.json());
app.use('/api', apiRouter);

app.use(handleInternalErrors);

module.exports = app;
//why is this not green