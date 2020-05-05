const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter')

apiRouter.get('/', (req, res, next) => {
  res.status(200).send({ msg: 'api up and running' })
})

apiRouter.use('/topics', topicsRouter)

module.exports = apiRouter