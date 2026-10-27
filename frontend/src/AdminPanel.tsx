import { useCallback, useEffect, useState } from "react";

import {
  api,
  getErrorMessage,
  type AccountStatus,
  type AdminOverview,
  type AdminUser,
  type AuditLogEntry,
  type PageResult,
  type Role,
  type WorkerSummary,
} from "./api";
import { WorkerForm } from "./WorkerForm";

export type AdminView = "dashboard" | "accounts" | "workers" | "audit";

type UsersData = ReturnType<typeof useAdminUsers>;

type Props = {
  view: AdminView;
  currentUserId: string;
  notify: (kind: "error" | "success", message: string) => void;
};

const roleLabels: Record<Role, string> = {
  admin: "Admin",
  sale: "Sale",
  nvvp: "NVVP",
  user: "Chưa phân quyền (user cũ)",
};

/** Roles removed from the business model (e.g. a leftover "manager" row) are flagged instead of shown as valid. */
const roleLabel = (role: string) => roleLabels[role as Role] ?? `Vai trò không còn hợp lệ (${role})`;

const statusLabels: Record<AccountStatus, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  disabled: "Vô hiệu hóa",
};

const assignableRoles = ["sale", "nvvp"] as const;
const approvalRoles = ["admin", "sale", "nvvp"] as const;

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleString("vi-VN") : "");

function useAdminUsers(notify: Props["notify"]) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<{ items: AdminUser[] }>("/admin/users");
      setUsers(response.data.items);
    } catch (error) {
      notify("error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { users, loading, reload };
}

function AccountsPage({ currentUserId, notify, users, loading, reload }: Pick<Props, "currentUserId" | "notify"> & UsersData) {
  const [filter, setFilter] = useState<"" | AccountStatus>("");
  const [roleDraft, setRoleDraft] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  async function run(userId: string, action: () => Promise<unknown>, success: string) {
    setBusyId(userId);
    try {
      await action();
      notify("success", success);
      await reload();
    } catch (error) {
      notify("error", getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  }

  function approve(user: AdminUser) {
    const role = roleDraft[user.id] ?? (user.role !== "user" ? user.role : "");
    if (!role) {
      notify("error", "Hãy chọn vai trò trước khi duyệt tài khoản.");
      return;
    }
    void run(user.id, () => api.patch(`/admin/users/${user.id}/status`, { status: "approved", role }), "Đã duyệt tài khoản.");
  }

  function setStatus(user: AdminUser, status: "rejected" | "disabled") {
    void run(user.id, () => api.patch(`/admin/users/${user.id}/status`, { status }), status === "rejected" ? "Đã từ chối tài khoản." : "Đã vô hiệu hóa tài khoản.");
  }

  function remove(user: AdminUser) {
    if (!window.confirm(`Xóa tài khoản ${user.email}? Lịch sử và dữ liệu liên quan vẫn được giữ lại.`)) return;
    void run(user.id, () => api.delete(`/admin/users/${user.id}`), "Đã xóa tài khoản.");
  }

  const visible = users.filter((user) => !filter || user.status === filter);

  return (
    <section className="content">
      <div className="section-heading">
        <div>
          <h2>Quản lý tài khoản & phân quyền</h2>
          <p>Duyệt hoặc từ chối đăng ký, vô hiệu hóa và xóa tài khoản. Bên dưới là phần gán vai trò và quyền xem danh sách cho NVVP.</p>
        </div>
        <select aria-label="Lọc theo trạng thái" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
          <option value="">Tất cả trạng thái</option>
          {(Object.keys(statusLabels) as AccountStatus[]).map((status) => (
            <option key={status} value={status}>{statusLabels[status]}</option>
          ))}
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Tài khoản</th><th>Vai trò</th><th>Trạng thái</th><th>Ngày đăng ký</th><th>Thao tác</th></tr></thead>
          <tbody>
            {visible.map((user) => {
              const isSelf = user.id === currentUserId;
              const deleted = Boolean(user.deletedAt);
              const busy = busyId === user.id;
              return (
                <tr key={user.id}>
                  <td>{user.fullName}<small>{user.email}</small></td>
                  <td>{roleLabel(user.role)}</td>
                  <td>{deleted ? "Đã xóa" : statusLabels[user.status]}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    {deleted ? null : (
                      <div className="admin-actions">
                        {user.status !== "approved" && (
                          <>
                            <select
                              aria-label={`Vai trò khi duyệt ${user.email}`}
                              value={roleDraft[user.id] ?? (user.role !== "user" ? user.role : "")}
                              onChange={(event) => setRoleDraft({ ...roleDraft, [user.id]: event.target.value })}
                            >
                              <option value="">Chọn vai trò</option>
                              {approvalRoles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}
                            </select>
                            <button className="button button-primary" disabled={busy} onClick={() => approve(user)}>Duyệt</button>
                          </>
                        )}
                        {user.status === "pending" && (
                          <button className="button button-quiet" disabled={busy} onClick={() => setStatus(user, "rejected")}>Từ chối</button>
                        )}
                        {user.status === "approved" && !isSelf && (
                          <button className="button button-quiet" disabled={busy} onClick={() => setStatus(user, "disabled")}>Vô hiệu hóa</button>
                        )}
                        {!isSelf && (
                          <button className="button button-danger" disabled={busy} onClick={() => remove(user)}>Xóa</button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && visible.length === 0 && <div className="empty-state">Không có tài khoản phù hợp.</div>}
      </div>
    </section>
  );
}

function PermissionsPage({ notify, users, loading, reload }: Pick<Props, "notify"> & UsersData) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [roleDraft, setRoleDraft] = useState<Role | "">("");
  const [busy, setBusy] = useState(false);

  const selected = users.find((user) => user.id === selectedId && !user.deletedAt) ?? null;
  const editable = selected?.status === "approved";

  useEffect(() => {
    setRoleDraft(selected?.role ?? "");
  }, [selected?.id, selected?.role]);

  const needle = search.trim().toLowerCase();
  const matches = users
    .filter((user) => !user.deletedAt)
    .filter((user) => !needle || user.fullName.toLowerCase().includes(needle) || user.email.toLowerCase().includes(needle));

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    try {
      await action();
      notify("success", success);
    } catch (error) {
      notify("error", getErrorMessage(error));
    } finally {
      await reload();
      setBusy(false);
    }
  }

  const saveRole = () => selected && roleDraft && run(() => api.patch(`/admin/users/${selected.id}/role`, { role: roleDraft }), "Đã lưu vai trò.");

  const setGrant = (grant: boolean) =>
    selected &&
    run(
      () => (grant ? api.put(`/admin/users/${selected.id}/worker-list-grant`) : api.delete(`/admin/users/${selected.id}/worker-list-grant`)),
      grant ? "Đã cấp quyền xem danh sách nhân sự." : "Đã thu hồi quyền xem danh sách nhân sự."
    );

  return (
    <section className="content">
      <div className="section-heading">
        <div>
          <h3>Phân quyền</h3>
          <p>Chọn một tài khoản để gán vai trò (Sale hoặc NVVP) và cấp/thu hồi quyền xem danh sách cho NVVP. Chỉ tài khoản đã duyệt mới được phân quyền.</p>
        </div>
      </div>
      <input aria-label="Tìm tài khoản" placeholder="Tìm theo tên hoặc email" value={search} onChange={(event) => setSearch(event.target.value)} />
      <div className="table-wrap">
        <table>
          <thead><tr><th>Tài khoản</th><th>Vai trò</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            {matches.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}<small>{user.email}</small></td>
                <td>{roleLabel(user.role)}</td>
                <td>{statusLabels[user.status]}</td>
                <td><button className="button button-quiet" onClick={() => setSelectedId(user.id)}>{user.id === selectedId ? "Đang chọn" : "Chọn"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && matches.length === 0 && <div className="empty-state">Không tìm thấy tài khoản.</div>}
      </div>

      {selected && (
        <div className="table-wrap" aria-label="Quyền của tài khoản đã chọn">
          <h3>{selected.fullName} <small>{selected.email}</small></h3>
          <p>
            Vai trò hiện tại: <strong>{roleLabel(selected.role)}</strong> · Trạng thái: <strong>{statusLabels[selected.status]}</strong>
          </p>
          {!editable && <p role="alert">Tài khoản chưa được duyệt nên chưa thể phân quyền. Hãy duyệt tài khoản ở mục “Quản lý tài khoản” trước.</p>}

          {selected.role === "admin" ? (
            <p>Tài khoản Admin không được chỉnh vai trò tại đây.</p>
          ) : (
            <div className="admin-actions">
              <select aria-label="Vai trò" disabled={!editable || busy} value={roleDraft} onChange={(event) => setRoleDraft(event.target.value as Role)}>
                <option value="" disabled>Chọn vai trò</option>
                {assignableRoles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}
              </select>
              <button className="button button-primary" disabled={!editable || busy || !roleDraft || roleDraft === selected.role || roleDraft === "user"} onClick={() => void saveRole()}>
                Lưu vai trò
              </button>
            </div>
          )}

          {selected.role === "nvvp" && (
            <>
              <h4>Quyền xem danh sách nhân sự</h4>
              <p>Hiện tại: <strong>{selected.hasWorkerListGrant ? "Đã được cấp" : "Chưa được cấp"}</strong> (chỉ xem, không thêm/sửa/xóa).</p>
              <div className="admin-actions">
                {selected.hasWorkerListGrant ? (
                  <button className="button button-danger" disabled={!editable || busy} onClick={() => void setGrant(false)}>Thu hồi quyền</button>
                ) : (
                  <button className="button button-primary" disabled={!editable || busy} onClick={() => void setGrant(true)}>Cấp quyền</button>
                )}
              </div>
            </>
          )}

          {(selected.role === "sale" || selected.role === "user") && <p>Vai trò này không có quyền xem danh sách nhân sự.</p>}
        </div>
      )}
    </section>
  );
}

function WorkersAdminPage({ notify }: Pick<Props, "notify">) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PageResult<WorkerSummary> | null>(null);
  const [editor, setEditor] = useState<{ id?: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await api.get<PageResult<WorkerSummary>>("/workers", { params: { page, pageSize: 10 } });
      setData(response.data);
    } catch (error) {
      notify("error", getErrorMessage(error));
    }
  }, [page, notify]);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(worker: WorkerSummary) {
    if (!window.confirm(`Xóa hồ sơ ${worker.fullName}?`)) return;
    try {
      await api.delete(`/workers/${worker.id}`);
      notify("success", "Đã xóa hồ sơ.");
      await load();
    } catch (error) {
      notify("error", getErrorMessage(error));
    }
  }

  const totalPages = data?.pagination.totalPages ?? 1;

  if (editor) {
    return (
      <section className="content">
        <div className="section-heading">
          <div><h2>{editor.id ? "Sửa hồ sơ công nhân" : "Tạo hồ sơ công nhân"}</h2><p>Các trường có dấu * là bắt buộc.</p></div>
        </div>
        <WorkerForm
          role="admin"
          workerId={editor.id}
          notify={notify}
          onCancel={() => setEditor(null)}
          onSaved={() => { setEditor(null); void load(); }}
        />
      </section>
    );
  }

  return (
    <section className="content">
      <div className="section-heading">
        <div>
          <h2>Danh sách công nhân</h2>
          <p>Danh sách tóm tắt, không hiển thị CCCD hay số tài khoản.</p>
        </div>
        <button className="button button-primary" onClick={() => setEditor({})}>Tạo hồ sơ</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Họ tên</th><th>Ngày sinh</th><th>Điện thoại</th><th>Trung tâm</th><th>Công ty</th><th></th></tr></thead>
          <tbody>
            {data?.items.map((worker) => (
              <tr key={worker.id}>
                <td>{worker.fullName}</td>
                <td>{worker.dateOfBirth}</td>
                <td>{worker.phone}</td>
                <td>{worker.centerName}</td>
                <td>{worker.companyName}</td>
                <td>
                  <button className="button button-quiet" onClick={() => setEditor({ id: worker.id })}>Sửa</button>{" "}
                  <button className="button button-danger" onClick={() => void remove(worker)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && data.items.length === 0 && <div className="empty-state">Chưa có hồ sơ công nhân.</div>}
      </div>
      <div className="admin-actions">
        <button className="button button-quiet" disabled={page <= 1} onClick={() => setPage(page - 1)}>Trước</button>
        <span>Trang {page}/{totalPages}</span>
        <button className="button button-quiet" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Sau</button>
      </div>
    </section>
  );
}

function AuditPage({ notify }: Pick<Props, "notify">) {
  const [items, setItems] = useState<AuditLogEntry[] | null>(null);

  useEffect(() => {
    api
      .get<{ items: AuditLogEntry[] }>("/admin/audit-logs")
      .then((response) => setItems(response.data.items))
      .catch((error: unknown) => notify("error", getErrorMessage(error)));
  }, [notify]);

  return (
    <section className="content">
      <div className="section-heading">
        <div><h2>Nhật ký hoạt động</h2><p>200 thao tác quản trị gần nhất.</p></div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Thời gian</th><th>Hành động</th><th>Người thực hiện</th><th>Tài khoản bị tác động</th><th>Chi tiết</th></tr></thead>
          <tbody>
            {items?.map((entry) => (
              <tr key={entry.id}>
                <td>{formatDate(entry.created_at)}</td>
                <td>{entry.action}</td>
                <td>{entry.actor_email}</td>
                <td>{entry.target_email}</td>
                <td>{entry.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {items && items.length === 0 && <div className="empty-state">Chưa có nhật ký.</div>}
      </div>
    </section>
  );
}

function AccountsAndPermissions({ currentUserId, notify }: Pick<Props, "currentUserId" | "notify">) {
  const data = useAdminUsers(notify);
  return (
    <>
      <AccountsPage currentUserId={currentUserId} notify={notify} {...data} />
      <PermissionsPage notify={notify} {...data} />
    </>
  );
}

function OverviewPage({ notify }: Pick<Props, "notify">) {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOverview((await api.get<AdminOverview>("/admin/overview")).data);
    } catch (error) {
      notify("error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void load();
  }, [load]);

  const cards: [string, number, boolean?][] = overview
    ? [
        ["Tổng công nhân", overview.workers.total, true],
        ["Công nhân mới (30 ngày)", overview.workers.newLast30Days],
        ["Tài khoản chờ duyệt", overview.accounts.pending],
        ["Tài khoản đang hoạt động", overview.accounts.active],
        ["Công ty", overview.companies],
      ]
    : [];

  return (
    <section className="content">
      <div className="section-heading">
        <div>
          <h2>Tổng quan quản lý công nhân</h2>
          <p>Số liệu lấy trực tiếp từ hệ thống.</p>
        </div>
        <button className="button button-quiet" disabled={loading} onClick={() => void load()}>{loading ? "Đang tải..." : "Làm mới"}</button>
      </div>
      {overview ? (
        <div className="dashboard-grid">
          {cards.map(([label, value, highlight]) => (
            <article className={highlight ? "dashboard-card dashboard-card-highlight" : "dashboard-card"} key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">{loading ? "Đang tải số liệu..." : "Chưa có số liệu tổng quan."}</div>
      )}
    </section>
  );
}

export function AdminPanel({ view, currentUserId, notify }: Props) {
  if (view === "dashboard") return <OverviewPage notify={notify} />;
  if (view === "accounts") return <AccountsAndPermissions currentUserId={currentUserId} notify={notify} />;
  if (view === "workers") return <WorkersAdminPage notify={notify} />;
  return <AuditPage notify={notify} />;
}