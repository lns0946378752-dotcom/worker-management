import type { WorkerGender, WorkerProfileInput } from "./api";

export type WorkerFormValues = {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  gender: WorkerGender | "";
  saleUserId: string;
  centerName: string;
  companyId: string;
  insuranceNumber: string;
  insuranceNote: string;
  nationalId: string;
  idIssueDate: string;
  idIssuePlace: string;
  permanentAddress: string;
  bankName: string;
  bankAccountNumber: string;
  note: string;
};

export type WorkerFormErrors = Partial<Record<keyof WorkerFormValues, string>>;

export const emptyWorkerForm: WorkerFormValues = {
  fullName: "",
  dateOfBirth: "",
  phone: "",
  gender: "",
  saleUserId: "",
  centerName: "",
  companyId: "",
  insuranceNumber: "",
  insuranceNote: "",
  nationalId: "",
  idIssueDate: "",
  idIssuePlace: "",
  permanentAddress: "",
  bankName: "",
  bankAccountNumber: "",
  note: "",
};

export const maxLengths = {
  fullName: 120,
  phone: 30,
  centerName: 160,
  insuranceNumber: 30,
  insuranceNote: 500,
  nationalId: 12,
  idIssuePlace: 160,
  permanentAddress: 300,
  bankName: 120,
  bankAccountNumber: 30,
  note: 1000,
} as const;

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

/** Mirrors the backend workerProfileSchema; the server stays the authority. */
export function validateWorkerForm(values: WorkerFormValues, today = new Date()): WorkerFormErrors {
  const errors: WorkerFormErrors = {};
  const v = (key: keyof WorkerFormValues) => values[key].trim();

  if (!v("fullName")) errors.fullName = "Vui lòng nhập họ tên.";
  else if (v("fullName").length > maxLengths.fullName) errors.fullName = `Tối đa ${maxLengths.fullName} ký tự.`;

  const dob = v("dateOfBirth");
  if (!dob) errors.dateOfBirth = "Vui lòng nhập ngày sinh.";
  else if (!isRealDate(dob)) errors.dateOfBirth = "Ngày sinh không hợp lệ.";
  else if (dob < "1900-01-01" || Number(dob.slice(0, 4)) > today.getFullYear() - 16) {
    errors.dateOfBirth = "Người lao động phải đủ 16 tuổi trở lên.";
  }

  const phone = v("phone");
  if (!phone) errors.phone = "Vui lòng nhập số điện thoại.";
  else if (phone.length < 7 || phone.length > maxLengths.phone) errors.phone = "Số điện thoại phải từ 7 đến 30 ký tự.";

  if (!values.gender) errors.gender = "Vui lòng chọn giới tính.";

  const nationalId = v("nationalId");
  if (nationalId && !/^\d{9,12}$/.test(nationalId)) errors.nationalId = "CCCD/CMND gồm 9 đến 12 chữ số.";

  const issueDate = v("idIssueDate");
  if (issueDate && !isRealDate(issueDate)) errors.idIssueDate = "Ngày cấp không hợp lệ.";

  const account = v("bankAccountNumber");
  if (account && !/^\d{6,30}$/.test(account)) errors.bankAccountNumber = "Số tài khoản gồm 6 đến 30 chữ số.";

  for (const key of ["centerName", "insuranceNumber", "insuranceNote", "idIssuePlace", "permanentAddress", "bankName", "note"] as const) {
    if (v(key).length > maxLengths[key]) errors[key] = `Tối đa ${maxLengths[key]} ký tự.`;
  }
  return errors;
}

const orNull = (value: string) => value.trim() || null;

export function toWorkerPayload(values: WorkerFormValues, includeSale: boolean): WorkerProfileInput {
  const payload: WorkerProfileInput = {
    fullName: values.fullName.trim(),
    dateOfBirth: values.dateOfBirth.trim(),
    phone: values.phone.trim(),
    gender: values.gender as WorkerGender,
    centerName: orNull(values.centerName),
    companyId: orNull(values.companyId),
    insuranceNumber: orNull(values.insuranceNumber),
    insuranceNote: orNull(values.insuranceNote),
    nationalId: orNull(values.nationalId),
    idIssueDate: orNull(values.idIssueDate),
    idIssuePlace: orNull(values.idIssuePlace),
    permanentAddress: orNull(values.permanentAddress),
    bankName: orNull(values.bankName),
    bankAccountNumber: orNull(values.bankAccountNumber),
    note: orNull(values.note),
  };
  // Only Admin names a Sale; for Sale/NVVP the server decides ownership.
  if (includeSale) payload.saleUserId = orNull(values.saleUserId);
  return payload;
}
