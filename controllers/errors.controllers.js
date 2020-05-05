exports.handleInternalErrors = (err, req, res, next) => {
  console.log('unhandled error:', err);
  res.status(500).send({ msg: 'Internal server error' });
};