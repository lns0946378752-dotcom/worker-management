# Ban do chuc nang va ma nguon Worker Management

Cap nhat: 2026-10-24, branch `main`, commit hien tai duoc push la `719a834`.

## 1. "Ban dang lam" la ban nao?

Repository co hai ung dung khac nhau:

| Ung dung | Vi tri | Dung de lam gi | Tinh trang |
|---|---|---|---|
| Worker Management hien tai | `backend/`, `frontend/`, `database/` | MVP tuyen dung: tai khoan, cong ty, vi tri tuyen dung, ho so ung tuyen, dashboard Admin | Day la ung dung chinh duoc chay bang `npm run dev`. |
| Ung dung Next.js cu | `legacy-next/` | Ban giao dien quan ly lao dong cu, co cac module worker/report va code tich hop Supabase | Chi de tham khao; khong phai ung dung recruitment dang chay. Code Supabase cu khong co nghia la da tao database Supabase online. |

Vi vay, "ban o tren" hien tai khong phai he thong cham cong/tinh luong. Day la **ban MVP quan ly tuyen dung lao dong** theo quan he `Company -> Vacancy -> Application`, co dang ky/dang nhap va quyen Admin.

## 2. Cach mot chuc nang di qua he thong

```text
Nguoi dung bam/nop form
  -> frontend/src/App.tsx
  -> frontend/src/api.ts (Axios gui HTTP request)
  -> backend/src/app.ts (gan URL vao route)
  -> backend/src/routes/<feature>-routes.ts (HTTP method, auth, role, validation)
  -> backend/src/controllers/<feature>-controller.ts (nhan request, tra HTTP response)
  -> backend/src/services/<feature>-service.ts (quy tac nghiep vu + query)
  -> backend/src/models/index.ts (Sequelize model/quan he)
  -> SQL Server local hoac PostgreSQL demo online
```

Controller chu yeu dieu phoi request/response; service la noi doc quy tac nghiep vu va truy van. Backend moi la noi kiem tra quyen that; khong chi an nut tren giao dien.

## 3. Bang chuc nang va noi code

| Chuc nang / ai dung | Giao dien | API route | Controller -> service | Cach hoat dong va quyen | Du lieu |
|---|---|---|---|---|---|
| Xem danh sach viec lam — khach/User/Admin | `frontend/src/App.tsx` (view `vacancies`), `frontend/src/api.ts` | `GET /api/vacancies` — `backend/src/routes/vacancy-routes.ts` | `vacancy-controller.ts` -> `vacancy-service.ts` | UI tai danh sach; backend ap search, loc status/khu vuc/cong ty/bo phan, sort va pagination. Cong khai, khong can dang nhap. | Doc `vacancies`, join `companies`. |
| Tim kiem/loc/phan trang vacancy — khach/User/Admin | `frontend/src/App.tsx` (search, district, status, pagination) | `GET /api/vacancies?...` | `vacancy-controller.ts` -> `vacancy-service.ts` | Query string duoc validate; sort field duoc allowlist, page size toi da 100. | SQL Server/PostgreSQL qua Sequelize. |
| Xem danh sach cong ty — khach/User/Admin | `frontend/src/App.tsx` (view `companies`) | `GET /api/companies` — `backend/src/routes/company-routes.ts` | `company-controller.ts` -> `company-service.ts` | Tim theo ten/khu vuc/nguoi lien he; loc district; sort va pagination. Cong khai. | Doc `companies`. |
| Đăng ký User | Form đăng ký trong `frontend/src/App.tsx` | `POST /api/auth/register` — `backend/src/routes/auth-routes.ts` | `auth-controller.ts` -> `auth-service.ts` | Trim họ tên/email, chuẩn hóa email chữ thường; mật khẩu 8 ký tự trở lên và tối đa 72 byte UTF-8; bcrypt hash; role luôn là `user`; trả JWT. Không có đăng ký Admin công khai. | Tạo row trong `users`; không lưu mật khẩu thô. |
| Đăng nhập | Form header trong `App.tsx`; trang riêng `/admin` dùng chung luồng login | `POST /api/auth/login` | `auth-controller.ts` -> `auth-service.ts` | Tìm User theo email chuẩn hóa, bcrypt compare; thông tin sai trả 401 chung; giới hạn 10 lần/15 phút; thành công trả user + JWT. | Đọc `users`; token giữ trong bộ nhớ frontend. |
| Lay User hien tai | Frontend/API client | `GET /api/auth/me` | `auth-controller.ts` -> `auth-service.ts`; auth middleware truoc controller | JWT duoc verify; backend tai role hien tai tu DB. | Doc `users`. |
| Đăng nhập Admin qua URL riêng | `/admin` trong `frontend/src/App.tsx`, rewrite `vercel.json` | Dùng `POST /api/auth/login` | Cùng luồng auth | Trang chỉ nhận đăng nhập, không đăng ký. User bị từ chối trên giao diện; mọi API Admin vẫn kiểm tra role ở backend. | `users`. |
| Tạo/đặt lại Admin local | Không tạo từ form công khai | `npm run seed:admin`; tùy chọn xác nhận `npm run seed:admin -- --reset-password` | `backend/src/scripts/seed-admin.ts` | Đọc biến ADMIN từ env; mặc định chỉ tạo email mới và từ chối thay đổi tài khoản đã có. Cờ reset chỉ đổi hash nếu email khớp một tài khoản đã có role `admin`; không nâng quyền User. | Tạo/cập nhật đúng row Admin trong `users`. |
| Them/sua/xoa cong ty — Admin | Form/cards trong `frontend/src/App.tsx` | `POST /api/companies`, `PUT /api/companies/:id`, `DELETE /api/companies/:id` | `company-controller.ts` -> `company-service.ts` | Route bat buoc JWT + `requireRole("admin")`; validate input. Khong cho xoa cong ty con vacancy. | Tao/cap nhat/xoa `companies`. |
| Tao/sua/xoa vacancy — Admin | Form/card trong view `vacancies` | `POST /api/vacancies`, `PUT /api/vacancies/:id`, `DELETE /api/vacancies/:id` | `vacancy-controller.ts` -> `vacancy-service.ts` | Route Admin-only; kiem tra company ton tai. Khong cho xoa vacancy da co application. UI xac nhan truoc khi xoa. | Tao/cap nhat/xoa `vacancies`. |
| Nop don ung tuyen — khach/User/Admin | Modal Ung tuyen trong `frontend/src/App.tsx` | `POST /api/applications` — `backend/src/routes/application-routes.ts` | `application-controller.ts` -> `application-service.ts` | Khong bat buoc login; gioi han 5 lan/gio. Chi nhan vacancy `open`; kiem tra tuoi/gioi tinh; chan so dien thoai nop trung cung vacancy. | Tao row `applications`, status ban dau `submitted`. |
| Admin xem ho so | View `applications` trong `frontend/src/App.tsx` | `GET /api/applications` | `application-controller.ts` -> `application-service.ts` | JWT + Admin; ho tro loc/trang va hien ten, lien he, vacancy/company. Thong tin lien he la PII, chi Admin xem. | Doc `applications`, join vacancy/company. |
| Admin cap nhat status ho so | Bang ho so trong `frontend/src/App.tsx` | `PATCH /api/applications/:id/status` | `application-controller.ts` -> `application-service.ts` | JWT + Admin; validate status trong `submitted`, `reviewing`, `accepted`, `rejected`. | Cap nhat `applications.status`. |
| Dashboard tuyen dung | View `dashboard` trong `frontend/src/App.tsx` | `GET /api/dashboard` — `backend/src/routes/dashboard-routes.ts` | `dashboard-controller.ts` -> `dashboard-service.ts` | JWT + Admin; dem cong ty, vacancy va application tong/theo status tu DB; nut lam moi goi lai API. Khong tra ten/phone ung vien. | Count tren `companies`, `vacancies`, `applications`. |
| Báo lỗi/toast tiếng Việt | Component toast trong `frontend/src/App.tsx`; `frontend/src/api.ts`; styles trong `frontend/src/styles.css` | API error response | `backend/src/middleware/error-handler.ts`, `validate.ts` và middleware/service liên quan | API trả thông báo tiếng Việt có dấu cho xác thực, quyền, validation, lỗi nghiệp vụ, 404 và rate limit; toast tự ẩn sau 5 giây hoặc người dùng đóng. Lỗi nội bộ không lộ chi tiết. | Không ghi thêm database. |
| Swagger API | Link hien cho Admin trong sidebar | `/api-docs`; khai bao route docs trong `backend/src/app.ts` va annotations trong route files | Khong qua business service neu chi xem docs | Mo giao dien thu API; endpoint van tu check token/quyen nhu thuong. | Khong ghi du lieu. |

`*.controller.ts` va `*.service.ts` viet tat trong bang la cac file nam trong `backend/src/controllers/` va `backend/src/services/` co ten feature tuong ung.

## 4. File he thong dung chung

| File/thu muc | Trach nhiem |
|---|---|
| `frontend/src/main.tsx` | Khoi tao React va nap `App`. |
| `frontend/src/App.tsx` | Trang UI chinh, state, forms, tabs/sidebar va cac request. |
| `frontend/src/api.ts` | Cấu hình Axios/base URL, type dữ liệu, token header và dự phòng thông báo API tiếng Việt. |
| `frontend/src/styles.css` | Mau sac, layout, responsive, sidebar/toast/modal. |
| `vercel.json` | Rewrite request frontend route (vi du `/admin`) ve SPA entry de refresh URL khong bi 404. |
| `backend/src/server.ts` | Kiem tra JWT config + DB authenticate va bat HTTP server. |
| `backend/src/app.ts` | Tao Express, Helmet, CORS, JSON limit, rate limit toan API, Swagger, gan route, 404/error handler. |
| `backend/src/middleware/auth.ts` | Doc Bearer JWT, verify va tai role tu DB; `requireRole` chan quyen khong phu hop. |
| `backend/src/middleware/validate.ts` + `backend/src/validators/schemas.ts` | Validate body/query bằng Zod trước khi vào nghiệp vụ; lỗi trả tiếng Việt. |
| `backend/src/middleware/error-handler.ts` | Chuẩn hóa HTTP errors, validation, unique conflict và lỗi server; lỗi server được log ở backend nhưng không lộ chi tiết ra API. |
| `backend/src/utils/access-token.ts` | Ky/verify JWT HS256, issuer/audience, expiry 1 gio; secret toi thieu 32 ky tu. |
| `backend/src/utils/pagination.ts` | Tinh page/limit/offset, allowlist sorting va metadata pagination. |
| `backend/src/models/index.ts` | Models, field types, constraints/index khai bao ORM va quan he Company-Vacancy-Application. |
| `backend/src/config/database.ts` | Khoi tao Sequelize; `DB_DIALECT` mac dinh `mssql`, `postgres` la opt-in online demo. |
| `backend/src/config/env.ts` | Nap `.env` local; secrets khong commit. |

## 5. Du lieu dang chay va du lieu tren Git

Hien tai local:

- SQL Server Express instance: `.\SQLEXPRESS`.
- Database: `WorkerManagement`.
- Bang: `users`, `companies`, `vacancies`, `applications`.
- Vi tri file database: `C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\WorkerManagement.mdf` va `WorkerManagement_log.ldf`.
- App ket noi bang `.env` root (file bi Git ignore). `.env` khong duoc commit/guid vao chat.
- Du lieu mau company/vacancy/application duoc tao boi `database/worker_management.sql`; Admin seed duoc tao bang `npm run seed:admin`.
- Cac thay doi database local khong tu dong di len GitHub.

Online deployment:

- Da co code/chuan bi opt-in PostgreSQL qua `database/supabase_schema.sql` va `DB_DIALECT=postgres`.
- Chua tao project Supabase, Render API service hay Vercel deployment trong phien duoc ghi nhan.
- `legacy-next/` co code Supabase cu, nhung khong chung minh project cloud/database da duoc tao.
- Vercel la frontend, Render (hoac Node host tuong duong) la API, Supabase la PostgreSQL; day la demo architecture, khac SQL Server rubric ban dau.

## 6. Chuc nang chua co / khong nen nham la da co

- Khong co cham cong, bang luong, payroll, ho so nhan su/CCCD/ngan hang, import Excel hay dashboard worker trong app recruitment hien tai.
- Khong co Google login, email verification/OTP, quen mat khau, refresh token.
- JWT mat khi reload trang do frontend chi giu token trong memory.
- Chua co deploy online hoat dong (URL Vercel/Render) hay database Supabase duoc xac nhan.
- SQL Server local va Supabase PostgreSQL la hai database rieng; khong tu dong sync.
- `legacy-next/` co mot so UI/logic cu nhung khong nen coi la tinh nang da noi vao backend recruitment hien tai.

## 7. Cach dung bang nay khi tim loi

1. Ghi ro thao tac nao, tai khoan role gi (khong ghi mat khau), ket qua mong doi va thong bao thuc te.
2. Tim hang tuong ung trong bang; bat dau o cot giao dien, theo API route roi doc controller/service.
3. Kiem tra Network tab: URL, HTTP method, status va response message; khong chup Authorization header/cookie.
4. Neu request dung nhung du lieu sai, kiem tra service/model/database; xac nhan app dang noi toi DB nao.
5. Gui screenshot da che email/phone va cung cap steps-to-reproduce; khong gui `.env`, token hay database password.
