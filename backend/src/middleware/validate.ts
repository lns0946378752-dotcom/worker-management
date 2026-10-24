import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { HttpError } from "../utils/http-error.js";

function validationMessage(issues: { path: PropertyKey[]; message: string }[], scope: "body" | "query") {
  const issue = issues[0];
  if (issue && /[À-ỹ]/.test(issue.message)) {
    return issue.message;
  }

  const field = String(issue?.path[0] ?? "");
  if (field === "email") return "Vui lòng nhập địa chỉ email hợp lệ.";
  if (field === "password") return "Mật khẩu chưa đáp ứng yêu cầu.";
  if (field === "fullName") return "Vui lòng nhập họ tên, tối đa 120 ký tự.";
  if (scope === "query") return "Thông tin tìm kiếm hoặc bộ lọc chưa hợp lệ.";
  return "Thông tin gửi lên chưa hợp lệ. Vui lòng kiểm tra lại các trường.";
}

export function validateBody(schema: ZodType): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      next(new HttpError(400, validationMessage(result.error.issues, "body")));
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
      next(new HttpError(400, validationMessage(result.error.issues, "query")));
      return;
    }

    request.validatedQuery = result.data as Record<string, unknown>;
    next();
  };
}
