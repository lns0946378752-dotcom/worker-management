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
    return error.response?.data.message ?? "Không thể kết nối máy chủ. Hãy kiểm tra API và SQL Server.";
  }
  return error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định.";
}
