import { z } from "zod";

const trimmedText = (max: number) => z.string().trim().min(1, "TrÆ°á»ng nÃ y khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng.").max(max);
const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

export const registerSchema = z.object({
  fullName: trimmedText(120),
  email: z.string().trim().email("Vui lÃ²ng nháº­p Ä‘á»‹a chá»‰ email há»£p lá»‡.").max(254),
  password: z
    .string()
    .min(8, "Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 8 kÃ½ tá»±.")
    .max(72, "Máº­t kháº©u khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ 72 byte.")
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72, "Máº­t kháº©u khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ 72 byte."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Vui lÃ²ng nháº­p Ä‘á»‹a chá»‰ email há»£p lá»‡.").max(254),
  password: z
    .string()
    .min(1, "Vui lÃ²ng nháº­p máº­t kháº©u.")
    .max(72, "Máº­t kháº©u khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ 72 byte.")
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72, "Máº­t kháº©u khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ 72 byte."),
});

export const companySchema = z.object({
  name: trimmedText(160),
  address: optionalText(240),
  district: trimmedText(120),
  contactName: optionalText(120),
  contactPhone: optionalText(30),
});
export type CompanyInput = z.infer<typeof companySchema>;

const businessRole = z.enum(["admin", "sale", "nvvp"]);

export const adminStatusSchema = z.object({
  status: z.enum(["approved", "rejected", "disabled"]),
  role: businessRole.optional(),
});

export const adminRoleSchema = z.object({ role: businessRole });

export const adminUserListQuerySchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "disabled"]).optional(),
});

export const uuidParam = z.guid();

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().startsWith(value));
const digits = (min: number, max: number) => z.string().trim().regex(/^\d+$/).min(min).max(max);

export const workerProfileSchema = z.object({
  fullName: trimmedText(120),
  dateOfBirth: isoDate.refine((value) => value >= "1900-01-01" && Number(value.slice(0, 4)) <= new Date().getFullYear() - 16),
  phone: z.string().trim().min(7).max(30),
  gender: z.enum(["male", "female", "other"]),
  saleUserId: z.guid().nullable().optional(),
  centerName: optionalText(160),
  companyId: z.guid().nullable().optional(),
  insuranceNumber: optionalText(30),
  insuranceNote: optionalText(500),
  nationalId: digits(9, 12).nullable().optional(),
  idIssueDate: isoDate.nullable().optional(),
  idIssuePlace: optionalText(160),
  permanentAddress: optionalText(300),
  bankName: optionalText(120),
  bankAccountNumber: digits(6, 30).nullable().optional(),
  note: optionalText(1000),
});
export type WorkerProfileInput = z.infer<typeof workerProfileSchema>;

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  sort: z.string().trim().max(80).optional(),
  search: z.string().trim().max(120).optional(),
  district: z.string().trim().max(120).optional(),
  companyId: z.guid().optional(),
});

export type ListQuery = z.infer<typeof listQuerySchema>;
