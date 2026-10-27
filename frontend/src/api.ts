import axios from "axios";

import { writeToken, getTokenStorage } from "./session";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

export type Role = "admin" | "sale" | "nvvp" | "user";

export type Account = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
};

export type Company = {
  id: string;
  name: string;
  address: string | null;
  district: string;
  contactName: string | null;
  contactPhone: string | null;
};

export type AccountStatus = "pending" | "approved" | "rejected" | "disabled";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  status: AccountStatus;
  createdAt: string;
  deletedAt: string | null;
  hasWorkerListGrant: boolean;
};

export type AuditLogEntry = {
  id: number;
  actor_email: string | null;
  action: string;
  target_email: string | null;
  company_id: string | null;
  details: string | null;
  created_at: string;
};

export type WorkerSummary = {
  id: string;
  fullName: string;
  dateOfBirth: string | null;
  phone: string | null;
  gender: string | null;
  centerName: string | null;
  companyId: string | null;
  companyName: string | null;
  createdAt: string;
};

export type WorkerGender = "male" | "female" | "other";

/** Payload of POST/PUT /workers; mirrors backend workerProfileSchema (17 profile fields incl. id on read). */
export type WorkerProfileInput = {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  gender: WorkerGender;
  saleUserId?: string | null;
  centerName?: string | null;
  companyId?: string | null;
  insuranceNumber?: string | null;
  insuranceNote?: string | null;
  nationalId?: string | null;
  idIssueDate?: string | null;
  idIssuePlace?: string | null;
  permanentAddress?: string | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  note?: string | null;
};

export type WorkerProfile = WorkerProfileInput & {
  id: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type AdminOverview = {
  workers: { total: number; newLast30Days: number };
  accounts: { pending: number; active: number };
  companies: number;
};

export type PageResult<T> = {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export function setAccessToken(token: string | null): boolean {
  const { storage, persistent } = getTokenStorage();
  const saved = writeToken(storage, token) && (persistent || token === null);
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return saved;
  }

  delete api.defaults.headers.common.Authorization;
  return saved;
}

/** Asks the server who this token belongs to; role and status are never taken from the browser. */
export async function fetchCurrentAccount(token: string): Promise<Account> {
  const response = await api.get<{ user: Account }>("/auth/me", { headers: { Authorization: "Bearer " + token } });
  return response.data.user;
}

export function getErrorStatus(error: unknown): number | null {
  return axios.isAxiosError(error) ? (error.response?.status ?? null) : null;
}

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    const message = error.response?.data.message;
    if (message) {
      const exactTranslations: Record<string, string> = {
        "Email or password is incorrect.": "Email hoặc mật khẩu chưa chính xác.",
        "An account with this email already exists.": "Email này đã được đăng ký.",
        "A valid bearer token is required.": "Vui lòng đăng nhập để tiếp tục.",
        "The bearer token is invalid or expired.": "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
        "The account for this token no longer exists.": "Tài khoản không còn tồn tại. Vui lòng đăng nhập lại.",
        "Sign-in is required.": "Vui lòng đăng nhập để tiếp tục.",
        "Your account does not have permission for this action.": "Tài khoản của bạn không có quyền thực hiện thao tác này.",
        "Company was not found.": "Không tìm thấy công ty.",
        "Account was not found.": "Không tìm thấy tài khoản.",
        "The selected company does not exist.": "Công ty đã chọn không tồn tại.",
        "Request body is invalid.": "Thông tin gửi lên chưa hợp lệ. Vui lòng kiểm tra lại các trường.",
        "Query parameters are invalid.": "Thông tin tìm kiếm chưa hợp lệ.",
        "Request validation failed.": "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.",
        "A record with the same unique values already exists.": "Dữ liệu này đã tồn tại.",
        "Request body must contain valid JSON.": "Dữ liệu gửi lên không đúng định dạng.",
        "An unexpected server error occurred.": "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
        "Origin is not allowed by the CORS policy.": "Trang web chưa được cấp quyền kết nối tới máy chủ.",
        "Page must be a positive integer.": "Số trang phải là số nguyên dương.",
        "Page size must be an integer between 1 and 100.": "Số mục mỗi trang phải nằm trong khoảng 1 đến 100.",
        "Sort must be a field name followed by asc or desc.": "Cách sắp xếp chưa đúng định dạng.",
        "Sort field or direction is not supported.": "Trường hoặc chiều sắp xếp này chưa được hỗ trợ.",
      };
      if (exactTranslations[message]) return exactTranslations[message];
      if (/[À-ỹ]/.test(message)) return message;
      return "Thao tác chưa thành công. Vui lòng kiểm tra thông tin và thử lại.";
    }
    if (error.response?.status === 401) return "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.";
    if (error.response?.status === 403) return "Bạn không có quyền thực hiện thao tác này.";
    if (error.response?.status === 404) return "Không tìm thấy nội dung yêu cầu.";
    if (error.response?.status === 429) return "Bạn thao tác quá nhanh. Vui lòng chờ một lúc rồi thử lại.";
    return "Không thể kết nối máy chủ. Vui lòng kiểm tra API và cơ sở dữ liệu.";
  }
  return "Đã xảy ra lỗi không xác định. Vui lòng thử lại hoặc báo quản trị viên.";
}
