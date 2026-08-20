import { failure } from "../utils/api.js";

export const notFound = (req, res) =>
  failure(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err?.code === 11000)
    return failure(
      res,
      409,
      "A record with that unique value already exists",
      Object.keys(err.keyPattern || {}),
    );
  if (err?.name === "ValidationError")
    return failure(
      res,
      400,
      "Database validation failed",
      Object.values(err.errors).map((e) => e.message),
    );
  if (err?.name === "CastError") return failure(res, 400, "Invalid identifier");
  return failure(
    res,
    err.statusCode || 500,
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error",
  );
};
