import type { ErrorRequestHandler } from "express";
import { UniqueConstraintError, ValidationError as SequelizeValidationError } from "sequelize";
import { ZodError } from "zod";

import { HttpError } from "../utils/http-error.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  void next;
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }

  if (error instanceof ZodError || error instanceof SequelizeValidationError) {
    response.status(400).json({ message: "Request validation failed." });
    return;
  }

  if (error instanceof UniqueConstraintError) {
    response.status(409).json({ message: "A record with the same unique values already exists." });
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({ message: "Request body must contain valid JSON." });
    return;
  }

  console.error("Unhandled API error:", error);
  response.status(500).json({ message: "An unexpected server error occurred." });
};
