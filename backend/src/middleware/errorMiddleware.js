function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route non trovata: ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Errore del server.';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Identificatore non valido.';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((validationError) => validationError.message)
      .join(' ');
  }

  res.status(statusCode).json({ message });
}

export { notFound, errorHandler };
