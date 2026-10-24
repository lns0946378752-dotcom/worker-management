import { useEffect, useState, type FormEvent } from "react";

import {
  api,
  getErrorMessage,
  setAccessToken,
  type Account,
  type Application,
  type Company,
  type PageResult,
  type Vacancy,
} from "./api";

type View = "vacancies" | "companies" | "applications";

const emptyCompany = {
  name: "",
  address: "",
  district: "",
  contactName: "",
  contactPhone: "",
};

const emptyVacancy = {
  companyId: "",
  department: "",
  title: "",
  quantity: 1,
  status: "open" as Vacancy["status"],
  workHours: "",
  overtime: "",
  baseSalary: 0,
  overtimeSalary: "",
  allowances: "",
  minimumAge: "",
  maximumAge: "",
  genderRequirement: "any" as Vacancy["genderRequirement"],
};

const emptyApplication = {
  applicantName: "",
  phone: "",
  yearOfBirth: "",
  gender: "male" as Application["gender"],
};

function formatSalary(value: number | string) {
  return new Intl.NumberFormat("vi-VN").format(Number(value)) + " đ/tháng";
}

function App() {
  const [account, setAccount] = useState<Account | null>(null);
  const [view, setView] = useState<View>("vacancies");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ fullName: "", email: "", password: "" });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState("");
  const [companyForm, setCompanyForm] = useState(emptyCompany);
  const [vacancyForm, setVacancyForm] = useState(emptyVacancy);
  const [applicationForm, setApplicationForm] = useState(emptyApplication);
  const [applyTo, setApplyTo] = useState<Vacancy | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadCompanies() {
    const response = await api.get<PageResult<Company>>("/companies", {
      params: { page: 1, pageSize: 100, sort: "name:asc" },
    });
    setCompanies(response.data.items);
  }

  async function loadVacancies() {
    const response = await api.get<PageResult<Vacancy>>("/vacancies", {
      params: {
        page,
        pageSize: 10,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(district ? { district } : {}),
        ...(status ? { status } : {}),
        sort: "createdAt:desc",
      },
    });
    setVacancies(response.data.items);
    setTotalPages(response.data.pagination.totalPages);
  }

  async function loadApplications() {
    const response = await api.get<PageResult<Application>>("/applications", {
      params: { page, pageSize: 10 },
    });
    setApplications(response.data.items);
    setTotalPages(response.data.pagination.totalPages);
  }

  useEffect(() => {
    void loadCompanies().catch((loadError: unknown) => setError(getErrorMessage(loadError)));
  }, []);

  useEffect(() => {
    if (view !== "vacancies") return;
    void loadVacancies().catch((loadError: unknown) => setError(getErrorMessage(loadError)));
  }, [view, page, search, district, status]);

  useEffect(() => {
    if (view !== "applications" || account?.role !== "admin") return;
    void loadApplications().catch((loadError: unknown) => setError(getErrorMessage(loadError)));
  }, [view, page, account]);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
      const response = await api.post<{ user: Account; token: string }>(endpoint, authForm);
      setAccessToken(response.data.token);
      setAccount(response.data.user);
      setNotice(`Xin chào ${response.data.user.fullName}.`);
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
    setApplications([]);
    setNotice("Bạn đã đăng xuất.");
    setView("vacancies");
  }

  async function submitCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/companies", companyForm);
      setCompanyForm(emptyCompany);
      await loadCompanies();
      setNotice("Đã thêm công ty.");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setBusy(false);
    }
  }

  async function submitVacancy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/vacancies", {
        ...vacancyForm,
        quantity: Number(vacancyForm.quantity),
        baseSalary: Number(vacancyForm.baseSalary),
        overtimeSalary: vacancyForm.overtimeSalary ? Number(vacancyForm.overtimeSalary) : null,
        minimumAge: vacancyForm.minimumAge ? Number(vacancyForm.minimumAge) : null,
        maximumAge: vacancyForm.maximumAge ? Number(vacancyForm.maximumAge) : null,
      });
      setVacancyForm(emptyVacancy);
      await loadVacancies();
      setNotice("Đã thêm vị trí tuyển dụng.");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setBusy(false);
    }
  }

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!applyTo) return;
    setBusy(true);
    setError("");
    try {
      await api.post("/applications", {
        ...applicationForm,
        vacancyId: applyTo.id,
        yearOfBirth: Number(applicationForm.yearOfBirth),
      });
      setApplyTo(null);
      setApplicationForm(emptyApplication);
      setNotice("Đã gửi thông tin ứng tuyển.");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setBusy(false);
    }
  }

  async function changeApplicationStatus(id: string, nextStatus: Application["status"]) {
    setError("");
    try {
      await api.patch(`/applications/${id}/status`, { status: nextStatus });
      await loadApplications();
      setNotice("Đã cập nhật trạng thái hồ sơ.");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    }
  }

  const canManage = account?.role === "admin";

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => setView("vacancies")}>
          <span className="brand-mark">WM</span>
          <span>
            <strong>Worker Management</strong>
            <small>Cổng thông tin tuyển dụng KJ Tech</small>
          </span>
        </a>
        <div className="account-bar">
          {account ? (
            <>
              <span>{account.fullName} · {account.role === "admin" ? "Quản trị viên" : "Người dùng"}</span>
              <button className="button button-quiet" onClick={signOut}>Đăng xuất</button>
            </>
          ) : (
            <form className="auth-form" onSubmit={submitAuth}>
              {authMode === "register" && (
                <input
                  aria-label="Họ và tên"
                  placeholder="Họ và tên"
                  required
                  value={authForm.fullName}
                  onChange={(event) => setAuthForm({ ...authForm, fullName: event.target.value })}
                />
              )}
              <input
                aria-label="Email"
                autoComplete="email"
                placeholder="Email"
                required
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
              />
              <input
                aria-label="Mật khẩu"
                autoComplete={authMode === "login" ? "current-password" : "new-password"}
                minLength={authMode === "register" ? 8 : 1}
                placeholder="Mật khẩu"
                required
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

      <section className="hero">
        <div>
          <p className="eyebrow">KẾT NỐI CÔNG VIỆC PHÙ HỢP</p>
          <h1>Tìm công việc tiếp theo của bạn</h1>
          <p>Tra cứu vị trí tuyển dụng theo công ty, khu vực và bộ phận.</p>
        </div>
        <div className="hero-count">
          <strong>{vacancies.length}</strong>
          <span>vị trí trên trang</span>
        </div>
      </section>

      <nav className="tabs" aria-label="Điều hướng">
        <button className={view === "vacancies" ? "tab active" : "tab"} onClick={() => { setPage(1); setView("vacancies"); }}>Việc làm</button>
        <button className={view === "companies" ? "tab active" : "tab"} onClick={() => setView("companies")}>Công ty</button>
        {canManage && (
          <button className={view === "applications" ? "tab active" : "tab"} onClick={() => { setPage(1); setView("applications"); }}>
            Hồ sơ ứng tuyển
          </button>
        )}
        {canManage && <a className="swagger-link" href="http://localhost:4000/api-docs" target="_blank" rel="noreferrer">Swagger API ↗</a>}
      </nav>

      {(error || notice) && (
        <div className={error ? "message message-error" : "message message-success"} role="status">
          {error || notice}
          <button aria-label="Đóng thông báo" onClick={() => { setError(""); setNotice(""); }}>×</button>
        </div>
      )}

      {view === "vacancies" && (
        <section className="content">
          <div className="section-heading">
            <div>
              <h2>Vị trí đang tuyển</h2>
              <p>Tìm kiếm và lọc danh sách tuyển dụng.</p>
            </div>
          </div>
          <div className="filters">
            <input
              aria-label="Tìm kiếm vị trí"
              placeholder="Tên vị trí, bộ phận..."
              value={search}
              onChange={(event) => { setPage(1); setSearch(event.target.value); }}
            />
            <select aria-label="Lọc theo khu vực" value={district} onChange={(event) => { setPage(1); setDistrict(event.target.value); }}>
              <option value="">Tất cả khu vực</option>
              {Array.from(new Set(companies.map((company) => company.district))).sort().map((item) => <option key={item}>{item}</option>)}
            </select>
            <select aria-label="Lọc trạng thái" value={status} onChange={(event) => { setPage(1); setStatus(event.target.value); }}>
              <option value="">Tất cả trạng thái</option>
              <option value="open">Đang tuyển</option>
              <option value="paused">Tạm ngưng</option>
              <option value="closed">Đã đóng</option>
            </select>
          </div>
          {canManage && companies.length > 0 && (
            <form className="inline-form vacancy-form" onSubmit={submitVacancy}>
              <h3>Thêm vị trí tuyển dụng</h3>
              <select required aria-label="Công ty tuyển dụng" value={vacancyForm.companyId} onChange={(event) => setVacancyForm({ ...vacancyForm, companyId: event.target.value })}>
                <option value="">Chọn công ty</option>
                {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
              </select>
              <input required placeholder="Tên vị trí" value={vacancyForm.title} onChange={(event) => setVacancyForm({ ...vacancyForm, title: event.target.value })} />
              <input required placeholder="Bộ phận" value={vacancyForm.department} onChange={(event) => setVacancyForm({ ...vacancyForm, department: event.target.value })} />
              <input required placeholder="Thời gian làm việc" value={vacancyForm.workHours} onChange={(event) => setVacancyForm({ ...vacancyForm, workHours: event.target.value })} />
              <input required min="1" type="number" aria-label="Số lượng" value={vacancyForm.quantity} onChange={(event) => setVacancyForm({ ...vacancyForm, quantity: Number(event.target.value) })} />
              <input required min="0" type="number" aria-label="Lương cơ bản" placeholder="Lương cơ bản (đ)" value={vacancyForm.baseSalary || ""} onChange={(event) => setVacancyForm({ ...vacancyForm, baseSalary: Number(event.target.value) })} />
              <input min="0" type="number" aria-label="Tuổi tối thiểu" placeholder="Tuổi từ" value={vacancyForm.minimumAge} onChange={(event) => setVacancyForm({ ...vacancyForm, minimumAge: event.target.value })} />
              <input min="0" type="number" aria-label="Tuổi tối đa" placeholder="Tuổi đến" value={vacancyForm.maximumAge} onChange={(event) => setVacancyForm({ ...vacancyForm, maximumAge: event.target.value })} />
              <select aria-label="Giới tính yêu cầu" value={vacancyForm.genderRequirement} onChange={(event) => setVacancyForm({ ...vacancyForm, genderRequirement: event.target.value as typeof vacancyForm.genderRequirement })}>
                <option value="any">Không giới hạn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
              <button className="button button-primary" disabled={busy}>Lưu vị trí</button>
            </form>
          )}
          {vacancies.length === 0 ? (
            <div className="empty-state">Chưa có vị trí phù hợp. Quản trị viên có thể thêm vị trí tuyển dụng sau khi tạo công ty.</div>
          ) : (
            <div className="vacancy-grid">
              {vacancies.map((vacancy) => (
                <article className="vacancy-card" key={vacancy.id}>
                  <div className="card-topline">
                    <span className="status-pill">{vacancy.status === "open" ? "Đang tuyển" : vacancy.status === "paused" ? "Tạm ngưng" : "Đã đóng"}</span>
                    <span>{vacancy.company?.district}</span>
                  </div>
                  <p className="company-name">{vacancy.company?.name ?? "Công ty"}</p>
                  <h3>{vacancy.title}</h3>
                  <p>{vacancy.department} · {vacancy.workHours}</p>
                  <strong className="salary">{formatSalary(vacancy.baseSalary)}</strong>
                  <p className="vacancy-detail">
                    Cần {vacancy.quantity} người
                    {vacancy.minimumAge || vacancy.maximumAge ? ` · ${vacancy.minimumAge ?? "?"}–${vacancy.maximumAge ?? "?"} tuổi` : ""}
                    {vacancy.genderRequirement !== "any" ? ` · ${vacancy.genderRequirement === "male" ? "Nam" : "Nữ"}` : ""}
                  </p>
                  {vacancy.status === "open" && <button className="button button-primary" onClick={() => setApplyTo(vacancy)}>Ứng tuyển</button>}
                </article>
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </section>
      )}

      {view === "companies" && (
        <section className="content">
          <div className="section-heading">
            <div><h2>Danh sách công ty</h2><p>Thông tin doanh nghiệp và khu vực tuyển dụng.</p></div>
          </div>
          {canManage && (
            <form className="inline-form" onSubmit={submitCompany}>
              <h3>Thêm công ty</h3>
              <input required placeholder="Tên công ty" value={companyForm.name} onChange={(event) => setCompanyForm({ ...companyForm, name: event.target.value })} />
              <input required placeholder="Khu vực / khu công nghiệp" value={companyForm.district} onChange={(event) => setCompanyForm({ ...companyForm, district: event.target.value })} />
              <input placeholder="Địa chỉ" value={companyForm.address} onChange={(event) => setCompanyForm({ ...companyForm, address: event.target.value })} />
              <input placeholder="Nhân sự liên hệ" value={companyForm.contactName} onChange={(event) => setCompanyForm({ ...companyForm, contactName: event.target.value })} />
              <input placeholder="Số điện thoại liên hệ" value={companyForm.contactPhone} onChange={(event) => setCompanyForm({ ...companyForm, contactPhone: event.target.value })} />
              <button className="button button-primary" disabled={busy}>Lưu công ty</button>
            </form>
          )}
          <div className="company-grid">
            {companies.map((company) => (
              <article className="company-card" key={company.id}>
                <span className="company-monogram">{company.name.slice(0, 1).toUpperCase()}</span>
                <div><h3>{company.name}</h3><p>{company.district}</p><p>{company.address || "Chưa cập nhật địa chỉ"}</p></div>
              </article>
            ))}
            {companies.length === 0 && <div className="empty-state">Chưa có công ty trong hệ thống.</div>}
          </div>
        </section>
      )}

      {view === "applications" && canManage && (
        <section className="content">
          <div className="section-heading"><div><h2>Hồ sơ ứng tuyển</h2><p>Quản trị viên xem và cập nhật trạng thái xử lý.</p></div></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Ứng viên</th><th>Vị trí</th><th>Công ty</th><th>Liên hệ</th><th>Trạng thái</th></tr></thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.applicantName}<small>{application.yearOfBirth} · {application.gender === "male" ? "Nam" : "Nữ"}</small></td>
                    <td>{application.vacancy?.title}</td>
                    <td>{application.vacancy?.company?.name}</td>
                    <td>{application.phone}</td>
                    <td>
                      <select aria-label={`Trạng thái ${application.applicantName}`} value={application.status} onChange={(event) => void changeApplicationStatus(application.id, event.target.value as Application["status"])}>
                        <option value="submitted">Mới gửi</option>
                        <option value="reviewing">Đang xem xét</option>
                        <option value="accepted">Đạt</option>
                        <option value="rejected">Không đạt</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {applications.length === 0 && <div className="empty-state">Chưa có hồ sơ ứng tuyển.</div>}
          </div>
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </section>
      )}

      {applyTo && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setApplyTo(null); }}>
          <section aria-labelledby="apply-title" aria-modal="true" className="modal" role="dialog">
            <button className="modal-close" aria-label="Đóng" onClick={() => setApplyTo(null)}>×</button>
            <p className="eyebrow">ỨNG TUYỂN</p>
            <h2 id="apply-title">{applyTo.title}</h2>
            <p>{applyTo.company?.name}</p>
            <form className="modal-form" onSubmit={submitApplication}>
              <label>Họ tên<input required maxLength={120} value={applicationForm.applicantName} onChange={(event) => setApplicationForm({ ...applicationForm, applicantName: event.target.value })} /></label>
              <label>Số điện thoại<input required minLength={7} maxLength={30} type="tel" value={applicationForm.phone} onChange={(event) => setApplicationForm({ ...applicationForm, phone: event.target.value })} /></label>
              <label>Năm sinh<input required min="1900" max={new Date().getFullYear() - 16} type="number" value={applicationForm.yearOfBirth} onChange={(event) => setApplicationForm({ ...applicationForm, yearOfBirth: event.target.value })} /></label>
              <label>Giới tính<select value={applicationForm.gender} onChange={(event) => setApplicationForm({ ...applicationForm, gender: event.target.value as typeof applicationForm.gender })}><option value="male">Nam</option><option value="female">Nữ</option></select></label>
              <button className="button button-primary" disabled={busy}>Gửi hồ sơ</button>
            </form>
          </section>
        </div>
      )}
      <footer>Worker Management · Đồ án cuối khóa · API dùng SQL Server và Sequelize</footer>
    </main>
  );
}

function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}) {
  if (totalPages < 2) return null;
  return (
    <div className="pagination">
      <button className="button button-quiet" disabled={page <= 1} onClick={() => setPage(page - 1)}>Trước</button>
      <span>Trang {page} / {totalPages}</span>
      <button className="button button-quiet" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Sau</button>
    </div>
  );
}

export default App;
