const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter')
const usersRouter = require('./usersRouter')

apiRouter.get('/', (req, res, next) => {
  res.status(200).send({ msg: 'api up and running' })
})

apiRouter.use('/topics', topicsRouter)
apiRouter.use('/users', usersRouter)

module.exports = apiRouter