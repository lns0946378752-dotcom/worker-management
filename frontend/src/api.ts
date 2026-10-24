import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

export type Role = "admin" | "user";

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

export type Vacancy = {
  id: string;
  companyId: string;
  department: string;
  title: string;
  quantity: number;
  status: "open" | "paused" | "closed";
  workHours: string;
  overtime: string | null;
  baseSalary: number;
  overtimeSalary: number | null;
  allowances: string | null;
  minimumAge: number | null;
  maximumAge: number | null;
  genderRequirement: "any" | "male" | "female";
  company?: Pick<Company, "id" | "name" | "district">;
};

export type Application = {
  id: string;
  vacancyId: string;
  applicantName: string;
  phone: string;
  yearOfBirth: number;
  gender: "male" | "female";
  status: "submitted" | "reviewing" | "accepted" | "rejected";
  vacancy?: Pick<Vacancy, "id" | "title" | "department"> & {
    company?: Pick<Company, "id" | "name">;
  };
};

export type RecruitmentDashboard = {
  companies: number;
  vacancies: {
    total: number;
    open: number;
    paused: number;
    closed: number;
  };
  applications: {
    total: number;
    submitted: number;
    reviewing: number;
    accepted: number;
    rejected: number;
  };
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

export function setAccessToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    const message = error.response?.data.message;
    if (message) {
      const exactTranslations: Record<string, string> = {
        "Email or password is incorrect.": "Email hoặc mật khẩu chưa chính xác.",
        "An account with this email already exists.": "Email này đã được đăng ký.",
        "Applicant does not meet the vacancy gender requirement.": "Giới tính của bạn chưa phù hợp với yêu cầu của vị trí này.",
        "Applicant does not meet the vacancy age requirement.": "Độ tuổi của bạn chưa phù hợp với yêu cầu của vị trí này.",
        "This vacancy is not accepting applications.": "Vị trí này hiện không nhận hồ sơ.",
        "This phone number has already applied for the vacancy.": "Số điện thoại này đã ứng tuyển vị trí trên.",
        "A valid bearer token is required.": "Vui lòng đăng nhập để tiếp tục.",
        "The bearer token is invalid or expired.": "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
        "The account for this token no longer exists.": "Tài khoản không còn tồn tại. Vui lòng đăng nhập lại.",
        "Sign-in is required.": "Vui lòng đăng nhập để tiếp tục.",
        "Your account does not have permission for this action.": "Tài khoản của bạn không có quyền thực hiện thao tác này.",
        "A vacancy with applications cannot be deleted.": "Không thể xóa vị trí đã có hồ sơ ứng tuyển.",
        "Remove or reassign this company's vacancies before deleting it.": "Hãy xóa hoặc chuyển các vị trí tuyển dụng trước khi xóa công ty.",
        "Company was not found.": "Không tìm thấy công ty.",
        "Vacancy was not found.": "Không tìm thấy vị trí tuyển dụng.",
        "Application was not found.": "Không tìm thấy hồ sơ ứng tuyển.",
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
      if (message.includes("does not meet the vacancy gender requirement")) {
        return "Giới tính của bạn chưa phù hợp với yêu cầu của vị trí này.";
      }
      if (message.includes("does not meet the vacancy age requirement")) {
        return "Độ tuổi của bạn chưa phù hợp với yêu cầu của vị trí này.";
      }
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
