function sendError(res, status, publicMessage, err) {
  const body = { error: publicMessage };
  if (process.env.NODE_ENV !== 'production' && err) {
    body.details = err.message;
  }
  return res.status(status).json(body);
}

module.exports = sendError;