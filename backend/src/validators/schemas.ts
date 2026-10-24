import { z } from "zod";

const trimmedText = (max: number) => z.string().trim().min(1, "Trường này không được để trống.").max(max);
const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

export const registerSchema = z.object({
  fullName: trimmedText(120),
  email: z.string().trim().email("Vui lòng nhập địa chỉ email hợp lệ.").max(254),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
    .max(72, "Mật khẩu không được vượt quá 72 byte.")
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72, "Mật khẩu không được vượt quá 72 byte."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Vui lòng nhập địa chỉ email hợp lệ.").max(254),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu.")
    .max(72, "Mật khẩu không được vượt quá 72 byte.")
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72, "Mật khẩu không được vượt quá 72 byte."),
});

export const companySchema = z.object({
  name: trimmedText(160),
  address: optionalText(240),
  district: trimmedText(120),
  contactName: optionalText(120),
  contactPhone: optionalText(30),
});
export type CompanyInput = z.infer<typeof companySchema>;

export const vacancySchema = z
  .object({
    companyId: z.string().uuid(),
    department: trimmedText(120),
    title: trimmedText(160),
    quantity: z.coerce.number().int().positive().max(100_000),
    status: z.enum(["open", "paused", "closed"]).default("open"),
    workHours: trimmedText(160),
    overtime: optionalText(240),
    baseSalary: z.coerce.number().nonnegative().max(1_000_000_000),
    overtimeSalary: z.coerce.number().nonnegative().max(1_000_000_000).nullable().optional(),
    allowances: optionalText(500),
    minimumAge: z.coerce.number().int().min(16).max(100).nullable().optional(),
    maximumAge: z.coerce.number().int().min(16).max(100).nullable().optional(),
    genderRequirement: z.enum(["any", "male", "female"]).default("any"),
  })
  .refine(
    (vacancy) =>
      vacancy.minimumAge === null ||
      vacancy.minimumAge === undefined ||
      vacancy.maximumAge === null ||
      vacancy.maximumAge === undefined ||
      vacancy.minimumAge <= vacancy.maximumAge,
    { message: "Độ tuổi tối thiểu không được lớn hơn độ tuổi tối đa.", path: ["minimumAge"] }
  );
export type VacancyInput = z.infer<typeof vacancySchema>;

export const applicationSchema = z.object({
  vacancyId: z.string().uuid(),
  applicantName: trimmedText(120),
  phone: z.string().trim().min(7).max(30),
  yearOfBirth: z.coerce.number().int().min(1900).max(new Date().getFullYear() - 16),
  gender: z.enum(["male", "female"]),
});

export const applicationStatusSchema = z.object({
  status: z.enum(["submitted", "reviewing", "accepted", "rejected"]),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  sort: z.string().trim().max(80).optional(),
  search: z.string().trim().max(120).optional(),
  district: z.string().trim().max(120).optional(),
  companyId: z.string().uuid().optional(),
  department: z.string().trim().max(120).optional(),
  status: z.enum(["open", "paused", "closed"]).optional(),
  applicationStatus: z.enum(["submitted", "reviewing", "accepted", "rejected"]).optional(),
});

export type ListQuery = z.infer<typeof listQuerySchema>;
