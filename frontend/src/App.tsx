import { useCallback, useEffect, useState, type FormEvent } from "react";

import { AdminPanel, type AdminView } from "./AdminPanel";
import { WorkerForm } from "./WorkerForm";
import {
  api,
  fetchCurrentAccount,
  getErrorMessage,
  getErrorStatus,
  setAccessToken,
  type Account,
  type Company,
  type PageResult,
} from "./api";
import { getTokenStorage, readToken, restoreSession, resolveView, viewToHash } from "./session";

type View = "home" | "worker-new" | "companies" | AdminView;

const emptyCompany = {
  name: "",
  address: "",
  district: "",
  contactName: "",
  contactPhone: "",
};

function App() {
  const [adminRoute, setAdminRoute] = useState(() => window.location.pathname === "/admin");
  const [account, setAccount] = useState<Account | null>(null);
  const [view, setView] = useState<View>("home");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ fullName: "", email: "", password: "" });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyForm, setCompanyForm] = useState(emptyCompany);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [restoring, setRestoring] = useState(() => readToken(getTokenStorage().storage) !== null);
  const [restoreFailed, setRestoreFailed] = useState(false);
  const [restoreAttempt, setRestoreAttempt] = useState(0);

  const notify = useCallback((kind: "error" | "success", message: string) => {
    if (kind === "error") {
      setError(message);
      setNotice("");
    } else {
      setNotice(message);
      setError("");
    }
  }, []);

  // Restore the session after a reload: the stored token is verified by the server, which also supplies the current role.
  useEffect(() => {
    if (readToken(getTokenStorage().storage) === null) {
      setRestoring(false);
      return;
    }
    let cancelled = false;
    setRestoring(true);
    setRestoreFailed(false);
    void restoreSession({ storage: getTokenStorage().storage, fetchMe: fetchCurrentAccount, statusOf: getErrorStatus }).then((result) => {
      if (cancelled) return;
      if (result.status === "authenticated") {
        setAccessToken(result.token);
        setAccount(result.account);
        setView(resolveView(window.location.hash, result.account.role));
        if (window.location.pathname === "/admin" && result.account.role === "admin") {
          window.history.replaceState({}, "", "/" + window.location.hash);
          setAdminRoute(false);
        }
      } else if (result.status === "anonymous") {
        setAccessToken(null);
        setNotice(result.reason === "expired" ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." : "Tài khoản hiện không được phép truy cập. Vui lòng đăng nhập lại.");
      } else {
        setRestoreFailed(true);
      }
      setRestoring(false);
    });
    return () => {
      cancelled = true;
    };
  }, [restoreAttempt]);

  // Keep the current screen in the URL hash so F5 returns to it (only after the server confirmed the role).
  useEffect(() => {
    if (account) window.history.replaceState(null, "", window.location.pathname + viewToHash(view));
  }, [account, view]);

  // A token that stops being accepted mid-session ends the session instead of leaving a half-working UI.
  useEffect(() => {
    const id = api.interceptors.response.use(undefined, (failure: unknown) => {
      const sentToken = Boolean(api.defaults.headers.common.Authorization);
      if (sentToken && getErrorStatus(failure) === 401) {
        setAccessToken(null);
        setAccount(null);
        setView("home");
        setNotice("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
      return Promise.reject(failure);
    });
    return () => api.interceptors.response.eject(id);
  }, []);

  useEffect(() => {
    const syncRoute = () => setAdminRoute(window.location.pathname === "/admin");
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  useEffect(() => {
    if (!error && !notice) return;
    const timeout = window.setTimeout(() => {
      setError("");
      setNotice("");
    }, 5000);
    return () => window.clearTimeout(timeout);
  }, [error, notice]);

  async function loadCompanies() {
    const response = await api.get<PageResult<Company>>("/companies", {
      params: { page: 1, pageSize: 100, sort: "name:asc" },
    });
    setCompanies(response.data.items);
  }

  useEffect(() => {
    if (account?.role !== "admin") {
      setCompanies([]);
      return;
    }
    void loadCompanies().catch((loadError: unknown) => setError(getErrorMessage(loadError)));
  }, [account]);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const email = authForm.email.trim();
    const passwordBytes = new TextEncoder().encode(authForm.password).length;
    if (authMode === "register" && !authForm.fullName.trim()) {
      setError("Vui lòng nhập họ và tên.");
      return;
    }
    if (authMode === "register" && authForm.fullName.trim().length > 120) {
      setError("Họ và tên không được vượt quá 120 ký tự.");
      return;
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }
    if (authMode === "register" && authForm.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    if (!authForm.password || passwordBytes > 72) {
      setError(passwordBytes > 72 ? "Mật khẩu không được vượt quá 72 byte." : "Vui lòng nhập mật khẩu.");
      return;
    }

    setBusy(true);
    try {
      const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
      const response = await api.post<{ user: Account; token?: string; message?: string }>(endpoint, {
        ...authForm,
        fullName: authForm.fullName.trim(),
        email,
      });
      if (!response.data.token) {
        setAuthForm({ fullName: "", email: "", password: "" });
        setAuthMode("login");
        setNotice(response.data.message ?? "Đăng ký thành công. Tài khoản đang chờ Admin duyệt.");
        return;
      }
      if (adminRoute && response.data.user.role !== "admin") {
        setAccessToken(null);
        setError("Tài khoản này không có quyền quản trị viên.");
        return;
      }
      const persisted = setAccessToken(response.data.token);
      setAccount(response.data.user);
      if (response.data.user.role === "admin") setView("dashboard");
      if (adminRoute) {
        window.history.replaceState({}, "", "/");
        setAdminRoute(false);
      }
      setNotice(
        persisted
          ? `Xin chào ${response.data.user.fullName}.`
          : "Đăng nhập thành công, nhưng trình duyệt không cho lưu phiên (đang chặn dữ liệu trang web). Tải lại trang sẽ phải đăng nhập lại."
      );
      setAuthForm({ fullName: "", email: "", password: "" });
    } catch (authError) {
      setError(getErrorMessage(authError));
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    setAccessToken(null);
    setAccount(null);
    setNotice("Bạn đã đăng xuất.");
    setView("home");
    if (adminRoute) {
      window.history.replaceState({}, "", "/");
      setAdminRoute(false);
    }
  }

  async function submitCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (editingCompanyId) {
        await api.put(`/companies/${editingCompanyId}`, companyForm);
      } else {
        await api.post("/companies", companyForm);
      }
      setCompanyForm(emptyCompany);
      setEditingCompanyId(null);
      await loadCompanies();
      setNotice(editingCompanyId ? "Đã cập nhật công ty." : "Đã thêm công ty.");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setBusy(false);
    }
  }

  function editCompany(company: Company) {
    setEditingCompanyId(company.id);
    setCompanyForm({
      name: company.name,
      address: company.address ?? "",
      district: company.district,
      contactName: company.contactName ?? "",
      contactPhone: company.contactPhone ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteCompany(company: Company) {
    if (!window.confirm(`Xóa công ty "${company.name}"? Chỉ xóa được công ty chưa gắn với hồ sơ công nhân.`)) return;

    setBusy(true);
    setError("");
    try {
      await api.delete(`/companies/${company.id}`);
      if (editingCompanyId === company.id) {
        setEditingCompanyId(null);
        setCompanyForm(emptyCompany);
      }
      await loadCompanies();
      setNotice("Đã xóa công ty.");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setBusy(false);
    }
  }

  const canManage = account?.role === "admin";
  const canCreateWorker = account?.role === "admin" || account?.role === "sale" || account?.role === "nvvp";

  if (restoring) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-card" role="status" aria-live="polite">
          <p>Đang khôi phục phiên đăng nhập...</p>
        </section>
      </main>
    );
  }

  if (restoreFailed) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-card" role="alert">
          <p>Không thể xác minh phiên đăng nhập vì máy chủ chưa phản hồi. Phiên của bạn chưa bị đăng xuất.</p>
          <button className="button button-primary" onClick={() => setRestoreAttempt(restoreAttempt + 1)}>Thử lại</button>
          <button
            className="button button-quiet"
            onClick={() => {
              setAccessToken(null);
              setRestoreFailed(false);
            }}
          >
            Đăng xuất
          </button>
        </section>
      </main>
    );
  }

  if (adminRoute && !canManage) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-card">
          <a className="brand" href="/">
            <span className="brand-mark">WM</span>
            <span><strong>Worker Management</strong><small>Khu vực quản trị</small></span>
          </a>
          <h1>Đăng nhập quản trị</h1>
          <p>Trang dành riêng cho tài khoản Admin.</p>
          <form className="admin-login-form" noValidate onSubmit={submitAuth}>
            <label>Email<input aria-label="Email Admin" autoComplete="username" type="email" placeholder="Email quản trị" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} /></label>
            <label>Mật khẩu<input aria-label="Mật khẩu Admin" autoComplete="current-password" type="password" placeholder="Mật khẩu" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} /></label>
            <button className="button button-primary" disabled={busy}>{busy ? "Đang đăng nhập..." : "Đăng nhập Admin"}</button>
          </form>
          <a className="text-button admin-back-link" href="/">← Quay lại trang chủ</a>
        </section>
        {(error || notice) && (
          <div className={error ? "toast toast-error" : "toast toast-success"} role="alert">
            <span>{error || notice}</span>
            <button aria-label="Đóng thông báo" onClick={() => { setError(""); setNotice(""); }}>×</button>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => setView("home")}>
          <span className="brand-mark">WM</span>
          <span>
            <strong>Worker Management</strong>
            <small>Quản lý công nhân KJ Tech</small>
          </span>
        </a>
        <div className="account-bar">
          {account ? (
            <>
              <span>{account.fullName} · {account.role === "admin" ? "Quản trị viên" : "Người dùng"}</span>
              <button className="button button-quiet" onClick={signOut}>Đăng xuất</button>
            </>
          ) : (
            <form className="auth-form" noValidate onSubmit={submitAuth}>
              {authMode === "register" && (
                <input
                  aria-label="Họ và tên"
                  placeholder="Họ và tên"
                  maxLength={120}
                  value={authForm.fullName}
                  onChange={(event) => setAuthForm({ ...authForm, fullName: event.target.value })}
                />
              )}
              <input
                aria-label="Email"
                autoComplete="email"
                maxLength={254}
                placeholder="Email"
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
              />
              <input
                aria-label="Mật khẩu"
                autoComplete={authMode === "login" ? "current-password" : "new-password"}
                maxLength={72}
                placeholder="Mật khẩu"
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
              />
              <button className="button button-primary" disabled={busy}>
                {authMode === "login" ? "Đăng nhập" : "Đăng ký"}
              </button>
              <button
                className="text-button"
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                type="button"
              >
                {authMode === "login" ? "Tạo tài khoản" : "Đã có tài khoản?"}
              </button>
            </form>
          )}
        </div>
      </header>

      <nav className="tabs sidebar" aria-label="Menu chính">
        <p className="sidebar-label">MENU</p>
        {canCreateWorker && (
          <button className={view === "worker-new" ? "tab active" : "tab"} onClick={() => setView("worker-new")}>
            <span aria-hidden="true">＋</span> Tạo hồ sơ công nhân
          </button>
        )}
        {canManage && (
          <>
            <button className={view === "dashboard" ? "tab active" : "tab"} onClick={() => setView("dashboard")}>
              <span aria-hidden="true">▦</span> Tổng quan
            </button>
            <button className={view === "workers" ? "tab active" : "tab"} onClick={() => setView("workers")}>
              <span aria-hidden="true">☷</span> Danh sách công nhân
            </button>
            <button className={view === "companies" ? "tab active" : "tab"} onClick={() => setView("companies")}>
              <span aria-hidden="true">▤</span> Công ty
            </button>
            <button className={view === "accounts" ? "tab active" : "tab"} onClick={() => setView("accounts")}>
              <span aria-hidden="true">☰</span> Quản lý tài khoản & phân quyền
            </button>
            <button className={view === "audit" ? "tab active" : "tab"} onClick={() => setView("audit")}>
              <span aria-hidden="true">✎</span> Nhật ký hoạt động
            </button>
          </>
        )}
        {canManage && (
          <a
            className="tab sidebar-link"
            href={(api.defaults.baseURL ?? "http://localhost:4000/api").replace(/\/api\/?$/, "/api-docs")}
            target="_blank"
            rel="noreferrer"
          >
            API tài liệu ↗
          </a>
        )}
        {account && (
          <div className="sidebar-bottom">
            <span className="sidebar-account">{account.fullName}<small>{canManage ? "Quản trị viên" : "Người dùng"}</small></span>
            <button className="tab" onClick={signOut}><span aria-hidden="true">↪</span> Đăng xuất</button>
          </div>
        )}
      </nav>

      {(error || notice) && (
        <div className={error ? "toast toast-error" : "toast toast-success"} role={error ? "alert" : "status"}>
          {error || notice}
          <button aria-label="Đóng thông báo" onClick={() => { setError(""); setNotice(""); }}>×</button>
        </div>
      )}

      {view === "home" && (
        <section className="content">
          <div className="section-heading">
            <div>
              <h2>Hệ thống quản lý công nhân</h2>
              <p>
                {account
                  ? canCreateWorker
                    ? "Chọn “Tạo hồ sơ công nhân” ở menu để đăng ký hồ sơ mới."
                    : "Tài khoản của bạn chưa có chức năng nghiệp vụ nào hiển thị ở đây."
                  : "Đăng nhập bằng tài khoản đã được Admin duyệt để sử dụng hệ thống. Tài khoản đăng ký mới cần chờ Admin duyệt và cấp vai trò."}
              </p>
            </div>
          </div>
        </section>
      )}

      {account && canCreateWorker && view === "worker-new" && (
        <section className="content">
          <div className="section-heading">
            <div>
              <h2>Tạo hồ sơ công nhân</h2>
              <p>Các trường có dấu * là bắt buộc.</p>
            </div>
          </div>
          <WorkerForm role={account.role} notify={notify} onSaved={() => undefined} />
        </section>
      )}

      {account && canManage && (view === "dashboard" || view === "accounts" || view === "workers" || view === "audit") && (
        <AdminPanel view={view} currentUserId={account.id} notify={notify} />
      )}
      {view === "companies" && canManage && (
        <section className="content">
          <div className="section-heading">
            <div><h2>Danh sách công ty</h2><p>Công ty dùng để gắn với hồ sơ công nhân.</p></div>
          </div>
          {canManage && (
            <form className="inline-form" onSubmit={submitCompany}>
              <h3>{editingCompanyId ? "Cập nhật công ty" : "Thêm công ty"}</h3>
              <input required placeholder="Tên công ty" value={companyForm.name} onChange={(event) => setCompanyForm({ ...companyForm, name: event.target.value })} />
              <input required placeholder="Khu vực / khu công nghiệp" value={companyForm.district} onChange={(event) => setCompanyForm({ ...companyForm, district: event.target.value })} />
              <input placeholder="Địa chỉ" value={companyForm.address} onChange={(event) => setCompanyForm({ ...companyForm, address: event.target.value })} />
              <input placeholder="Nhân sự liên hệ" value={companyForm.contactName} onChange={(event) => setCompanyForm({ ...companyForm, contactName: event.target.value })} />
              <input placeholder="Số điện thoại liên hệ" value={companyForm.contactPhone} onChange={(event) => setCompanyForm({ ...companyForm, contactPhone: event.target.value })} />
              <button className="button button-primary" disabled={busy}>
                {editingCompanyId ? "Cập nhật công ty" : "Lưu công ty"}
              </button>
              {editingCompanyId && (
                <button
                  className="button button-quiet"
                  type="button"
                  onClick={() => { setEditingCompanyId(null); setCompanyForm(emptyCompany); }}
                >
                  Hủy sửa
                </button>
              )}
            </form>
          )}
          <div className="company-grid">
            {companies.map((company) => (
              <article className="company-card" key={company.id}>
                <span className="company-monogram">{company.name.slice(0, 1).toUpperCase()}</span>
                <div className="company-card-content">
                  <h3>{company.name}</h3>
                  <p>{company.district}</p>
                  <p>{company.address || "Chưa cập nhật địa chỉ"}</p>
                  {canManage && (
                    <div className="admin-actions">
                      <button className="button button-quiet" type="button" onClick={() => editCompany(company)}>Sửa</button>
                      <button className="button button-danger" type="button" disabled={busy} onClick={() => void deleteCompany(company)}>Xóa</button>
                    </div>
                  )}
                </div>
              </article>
            ))}
            {companies.length === 0 && <div className="empty-state">Chưa có công ty trong hệ thống.</div>}
          </div>
        </section>
      )}

      <footer>Worker Management · Đồ án cuối khóa · Backend sử dụng Sequelize ORM</footer>
    </main>
  );
}

export default App;
