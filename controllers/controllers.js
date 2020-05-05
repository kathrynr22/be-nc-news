const { selectTopics } = require('../models/models')

exports.getAllTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics })
  })
}