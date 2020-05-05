exports.handle405s = (req, res) => {
  res.status(405).send({ msg: 'method not allowed' })
};

exports.handleInternalErrors = (err, req, res, next) => {
  console.log('unhandled error:', err);
  res.status(500).send({ msg: 'Internal server error' });
};