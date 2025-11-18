export const notFoundHandler = (req, res, next) => {
  const error = new Error("Ruta no encontrada");
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, _next) => {
  const status = err.statusCode || 500;
  const response = {
    error: err.message || "Error interno del servidor",
  };

  if (process.env.NODE_ENV === "development" && err.stack) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};

