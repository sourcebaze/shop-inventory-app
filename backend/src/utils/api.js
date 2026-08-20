export const success = (res, status, message, data = {}) =>
  res.status(status).json({ success: true, message, data });
export const failure = (res, status, message, errors = []) =>
  res.status(status).json({ success: false, message, errors });
