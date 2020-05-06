exports.handle405s = (req, res) => {
  res.status(405).send({ msg: 'method not allowed' })
};

exports.send404 = (req, res, next) => {
  res.status(404).send({ msg: 'resource not found' })
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg })
  } else {
    next(err)
  }
}

exports.handleInternalErrors = (err, req, res, next) => {
  console.log('unhandled error:', err);
  res.status(500).send({ msg: 'Internal server error' });
};