import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { HttpError } from "../utils/http-error.js";

export function validateBody(schema: ZodType): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      next(new HttpError(400, "Request body is invalid.", result.error.issues));
      return;
    }

    request.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodType): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request.query);
    if (!result.success) {
      next(new HttpError(400, "Query parameters are invalid.", result.error.issues));
      return;
    }

    request.validatedQuery = result.data as Record<string, unknown>;
    next();
  };
}
