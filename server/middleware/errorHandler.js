const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Server Error';

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    if (err.keyValue && err.keyValue.email) {
      message = 'An account with this email already exists';
    }
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err.name === 'MongooseServerSelectionError') {
    statusCode = 503;
    message = 'Database connection error, please try again later';
  }

  if (err.name === 'MongoNetworkError' || err.name.includes('Mongo')) {
    statusCode = 503;
    message = 'Database connection error, please try again later';
  }

  console.error(err);
  res.status(statusCode).json({ message: message || 'Server Error' });
};

module.exports = { notFound, errorHandler };