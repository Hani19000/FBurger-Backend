export const sendSuccess = (res, statusCode, data = null) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
