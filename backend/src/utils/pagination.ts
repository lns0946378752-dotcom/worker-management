import type { FindOptions } from "sequelize";

import { HttpError } from "./http-error.js";

export function getPagination(pageValue: unknown, pageSizeValue: unknown) {
  const page = Number(pageValue ?? 1);
  const pageSize = Number(pageSizeValue ?? 10);

  if (!Number.isInteger(page) || page < 1) {
    throw new HttpError(400, "Page must be a positive integer.");
  }

  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new HttpError(400, "Page size must be an integer between 1 and 100.");
  }

  return { page, pageSize, offset: (page - 1) * pageSize, limit: pageSize };
}

export function getPaginationResponse(
  count: number,
  pagination: ReturnType<typeof getPagination>
) {
  return {
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalItems: count,
    totalPages: Math.ceil(count / pagination.pageSize),
  };
}

export function getOrder(
  sortValue: unknown,
  allowedFields: readonly string[],
  defaultField: string
): FindOptions["order"] {
  if (sortValue === undefined) {
    return [[defaultField, "ASC"]];
  }

  if (typeof sortValue !== "string") {
    throw new HttpError(400, "Sort must be a field name followed by asc or desc.");
  }

  const [field, direction, extra] = sortValue.split(":");
  if (
    extra !== undefined ||
    !allowedFields.includes(field) ||
    (direction !== "asc" && direction !== "desc")
  ) {
    throw new HttpError(400, "Sort field or direction is not supported.");
  }

  return [[field, direction.toUpperCase() as "ASC" | "DESC"]];
}
