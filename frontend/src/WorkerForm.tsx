import { useEffect, useState, type FormEvent } from "react";

import {
  api,
  getErrorMessage,
  type AdminUser,
  type Company,
  type PageResult,
  type Role,
  type WorkerProfile,
} from "./api";
import {
  emptyWorkerForm,
  maxLengths,
  toWorkerPayload,
  validateWorkerForm,
  type WorkerFormErrors,
  type WorkerFormValues,
} from "./workerValidation";

type Props = {
  role: Role;
  /** When set, the form loads and updates this profile (Admin only on the server). */
  workerId?: string;
  notify: (kind: "error" | "success", message: string) => void;
  onSaved: () => void;
  onCancel?: () => void;
};

function fromProfile(profile: WorkerProfile): WorkerFormValues {
  const text = (value: string | null | undefined) => value ?? "";
  return {
    fullName: profile.fullName,
    dateOfBirth: text(profile.dateOfBirth),
    phone: profile.phone,
    gender: profile.gender,
    saleUserId: text(profile.saleUserId),
    centerName: text(profile.centerName),
    companyId: text(profile.companyId),
    insuranceNumber: text(profile.insuranceNumber),
    insuranceNote: text(profile.insuranceNote),
    nationalId: text(profile.nationalId),
    idIssueDate: text(profile.idIssueDate),
    idIssuePlace: text(profile.idIssuePlace),
    permanentAddress: text(profile.permanentAddress),
    bankName: text(profile.bankName),
    bankAccountNumber: text(profile.bankAccountNumber),
    note: text(profile.note),
  };
}

export function WorkerForm({ role, workerId, notify, onSaved, onCancel }: Props) {
  const isAdmin = role === "admin";
  const [values, setValues] = useState<WorkerFormValues>(emptyWorkerForm);
  const [errors, setErrors] = useState<WorkerFormErrors>({});
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sales, setSales] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(Boolean(workerId));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get<PageResult<Company>>("/companies", { params: { page: 1, pageSize: 100 } })
      .then((response) => active && setCompanies(response.data.items))
      .catch((error) => active && notify("error", getErrorMessage(error)));
    if (isAdmin) {
      api
        .get<AdminUser[] | { items: AdminUser[] }>("/admin/users", { params: { status: "approved" } })
        .then((response) => {
          const list = Array.isArray(response.data) ? response.data : response.data.items;
          if (active) setSales(list.filter((user) => user.role === "sale" && !user.deletedAt));
        })
        .catch((error) => active && notify("error", getErrorMessage(error)));
    }
    return () => {
      active = false;
    };
  }, [isAdmin, notify]);

  useEffect(() => {
    if (!workerId) return;
    let active = true;
    setLoading(true);
    api
      .get<WorkerProfile>(`/workers/${workerId}`)
      .then((response) => active && setValues(fromProfile(response.data)))
      .catch((error) => active && notify("error", getErrorMessage(error)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [workerId, notify]);

  function set<K extends keyof WorkerFormValues>(key: K, value: WorkerFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const found = validateWorkerForm(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      notify("error", "Vui lòng kiểm tra lại các trường được đánh dấu.");
      return;
    }
    setSaving(true);
    try {
      const payload = toWorkerPayload(values, isAdmin);
      if (workerId) await api.put(`/workers/${workerId}`, payload);
      else await api.post("/workers", payload);
      notify("success", workerId ? "Đã cập nhật hồ sơ." : "Đã tạo hồ sơ công nhân.");
      if (!workerId) setValues(emptyWorkerForm);
      onSaved();
    } catch (error) {
      notify("error", getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  const field = (
    key: keyof WorkerFormValues,
    label: string,
    options: { type?: string; required?: boolean; inputMode?: "numeric" | "tel"; wide?: boolean } = {}
  ) => (
    <label className={options.wide ? "field field-wide" : "field"}>
      <span>{label}{options.required && " *"}</span>
      <input
        type={options.type ?? "text"}
        inputMode={options.inputMode}
        maxLength={maxLengths[key as keyof typeof maxLengths]}
        value={values[key]}
        aria-invalid={Boolean(errors[key])}
        onChange={(event) => set(key, event.target.value as never)}
      />
      {errors[key] && <small className="field-error" role="alert">{errors[key]}</small>}
    </label>
  );

  if (loading) return <div className="empty-state">Đang tải hồ sơ...</div>;

  return (
    <form className="worker-form" noValidate onSubmit={submit}>
      <div className="form-grid">
        {field("fullName", "Họ và tên", { required: true })}
        {field("dateOfBirth", "Ngày sinh", { type: "date", required: true })}
        {field("phone", "Số điện thoại", { required: true, inputMode: "tel" })}
        <label className="field">
          <span>Giới tính *</span>
          <select value={values.gender} aria-invalid={Boolean(errors.gender)} onChange={(event) => set("gender", event.target.value as WorkerFormValues["gender"])}>
            <option value="">-- Chọn --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
          {errors.gender && <small className="field-error" role="alert">{errors.gender}</small>}
        </label>
        {field("centerName", "Trung tâm")}
        <label className="field">
          <span>Công ty</span>
          <select value={values.companyId} onChange={(event) => set("companyId", event.target.value)}>
            <option value="">-- Không chọn --</option>
            {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
          </select>
        </label>
        {isAdmin && (
          <label className="field">
            <span>Sale phụ trách</span>
            <select value={values.saleUserId} onChange={(event) => set("saleUserId", event.target.value)}>
              <option value="">-- Không chọn --</option>
              {sales.map((sale) => <option key={sale.id} value={sale.id}>{sale.fullName} ({sale.email})</option>)}
            </select>
          </label>
        )}
        {field("insuranceNumber", "Số bảo hiểm")}
        {field("nationalId", "CCCD/CMND", { inputMode: "numeric" })}
        {field("idIssueDate", "Ngày cấp", { type: "date" })}
        {field("idIssuePlace", "Nơi cấp")}
        {field("permanentAddress", "Địa chỉ thường trú", { wide: true })}
        {field("bankName", "Ngân hàng")}
        {field("bankAccountNumber", "Số tài khoản", { inputMode: "numeric" })}
        {field("insuranceNote", "Ghi chú bảo hiểm", { wide: true })}
        {field("note", "Ghi chú", { wide: true })}
      </div>
      <div className="admin-actions">
        <button className="button button-primary" disabled={saving}>{saving ? "Đang lưu..." : workerId ? "Cập nhật" : "Tạo hồ sơ"}</button>
        {onCancel && <button type="button" className="button button-quiet" onClick={onCancel}>Hủy</button>}
      </div>
    </form>
  );
}
