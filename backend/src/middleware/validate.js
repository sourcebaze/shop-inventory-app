import { failure } from "../utils/api.js";
export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error)
      return failure(
        res,
        422,
        "Validation failed",
        error.details.map((d) => d.message),
      );
    req[source] = value;
    next();
  };
