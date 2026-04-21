function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route non trovata: ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || 'Errore del server.'
  });
}

export { notFound, errorHandler };
