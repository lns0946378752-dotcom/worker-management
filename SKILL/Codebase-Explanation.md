# Giai thich cau truc va luong code

Tai lieu nay la ban do de doc project; khong phai moi dong code deu nen co comment lap lai. Khi muon hoc mot chuc nang, doc theo thu tu: giao dien -> API client -> route -> controller -> service -> model/database.

## 1. Toan canh he thong

```text
Nguoi dung
  -> frontend React/Vite (frontend/src)
  -> Axios request (frontend/src/api.ts)
  -> Express app/router (backend/src/app.ts, backend/src/routes)
  -> middleware (xác thực JWT, phân quyền, kiểm tra dữ liệu)
  -> controller (HTTP request/response)
  -> service (nghiệp vụ và truy vấn)
  -> Sequelize model
  -> SQL Server local hoặc PostgreSQL demo online
```

- **Frontend** hien thi trang, form, bang, menu va gui API request.
- **Backend API** kiem tra request/quyen, chay nghiep vu va tra JSON. Khong nen de frontend noi truc tiep toi database.
- **Sequelize** la ORM: code TypeScript thao tac model; dialect chon cach giao tiep voi DBMS.
- **Database** luu tai khoan, cong ty, vi tri va ho so. SQL Server/PostgreSQL la dich vu database, Git khong chua database dang chay.

## 2. Thu muc va file can biet

| Vi tri | Vai tro |
|---|---|
| `frontend/src/App.tsx` | Trang React chinh, state giao dien, form va thao tac nguoi dung |
| `frontend/src/api.ts` | Axios base URL, kieu du lieu TypeScript, token Authorization va thong bao loi tieng Viet |
| `frontend/src/styles.css` | Giao dien, sidebar, toast, form, cards va responsive |
| `frontend/src/main.tsx` | Gan component React vao trang HTML |
| `backend/src/app.ts` | Tao Express app, CORS, rate limiting, Swagger, gan cac router |
| `backend/src/server.ts` | Kiem tra JWT/database va bat dau lang nghe port |
| `backend/src/routes/` | Khai bao URL, HTTP method va middleware/quyen |
| `backend/src/controllers/` | Doc request, goi service, tra response |
| `backend/src/services/` | Quy tac nghiep vu va truy van Sequelize |
| `backend/src/models/index.ts` | Dinh nghia User/Company/Vacancy/Application va quan he |
| `backend/src/middleware/` | Xac thuc, phan quyen, validate request va xu ly loi |
| `backend/src/validators/schemas.ts` | Quy tac validate body/query bang Zod |
| `backend/src/config/database.ts` | Cau hinh Sequelize; mac dinh MSSQL, `DB_DIALECT=postgres` bat PostgreSQL |
| `backend/src/config/env.ts` | Doc `.env` local; file secret khong dua len Git |
| `database/worker_management.sql` | Script T-SQL tao schema va du lieu mau tren SQL Server |
| `database/supabase_schema.sql` | Script PostgreSQL rieng cho Supabase demo |
| `legacy-next/` | App Next.js cu, khong phai app recruitment hien tai |

## 3. Cach lan theo mot request

Vi du danh sach cong ty:

1. `App.tsx` goi `api.get("/companies", ...)`.
2. `api.ts` ghep base URL (local mac dinh `http://localhost:4000/api`; deploy dung `VITE_API_URL`).
3. `app.ts` gan `/api/companies` toi `company-routes.ts`.
4. `company-routes.ts` validate query va chuyen toi controller.
5. `company-controller.ts` goi service.
6. `company-service.ts` dung model `Company` de query va pagination.
7. Sequelize gui query toi DB, service tra ket qua cho controller, controller tra JSON.
8. React nhan response va cap nhat state de render UI.

Hay dung cung thu tu nay khi hoc chuc nang khac; thay `companies` bang `auth`, `vacancies`, `applications` hoac `dashboard`.

## 4. Dang ky, dang nhap va token

1. Form dang ky/dang nhap o `frontend/src/App.tsx` gui `POST /auth/register` hoac `/auth/login`.
2. `backend/src/routes/auth-routes.ts` ap rate limit cho login va goi validate middleware.
3. `auth-controller.ts` goi ham `registerUser`/`loginUser`.
4. `auth-service.ts` doc/tao record `User`; password duoc bcrypt hash (khong luu plaintext). Tai khoan tu dang ky duoc gan role `user`.
5. `access-token.ts` ky JWT HS256 co subject, issuer, audience va thoi han 1 gio.
6. Token chi duoc giu trong bo nho frontend va gan vao Authorization header. Tai lai trang se can dang nhap lai.
7. Khi endpoint can dang nhap, `middleware/auth.ts` verify JWT va doc role hien tai tu DB; khong tin role frontend tu khai.
8. Admin duoc tao bang `npm run seed:admin` tu env rieng; khong dang ky Admin cong khai.

Du lieu User luu trong bang `users` cua database dang duoc cau hinh (`WorkerManagement` local hoac Supabase demo). Token khong phai row user va khong duoc xem la mat khau.

## 5. Cac nghiep vu khac

| Nghiep vu | Route | Controller -> service | Luu tru |
|---|---|---|---|
| Quan ly company | `backend/src/routes/company-routes.ts` | `company-controller.ts` -> `company-service.ts` | `companies` |
| Tim/quan ly vacancy | `backend/src/routes/vacancy-routes.ts` | `vacancy-controller.ts` -> `vacancy-service.ts` | `vacancies` |
| Nop/xem application | `backend/src/routes/application-routes.ts` | `application-controller.ts` -> `application-service.ts` | `applications` |
| Dashboard Admin | `backend/src/routes/dashboard-routes.ts` | `dashboard-controller.ts` -> `dashboard-service.ts` | Count aggregates tren cac bang |

Company co nhieu Vacancy; Vacancy co nhieu Application. FK chan xoa company/vacancy neu con du lieu lien ket. Nop don la cong khai, khong bat buoc login; admin moi duoc xem va cap nhat status.

## 6. Sidebar, trang Admin va thong bao

- Sidebar hien viec lam/cong ty cho moi nguoi; Admin co them tong quan va ho so.
- `/admin` la duong dan mo trang dang nhap rieng cho Admin (Vite local va production duoc rewrite ve React entry); backend van la noi kiem tra quyen that.
- Toast dropdown hien thong bao tam thoi; frontend chuyen cac thong diep API da biet sang tieng Viet. Loi khong nhan dien duoc dung thong diep chung tieng Viet, khong hien SQL/credential cho user.
- Neu User dang nhap tu `/admin`, khong duoc vao khu vuc Admin.

## 7. Database local va database online

- May hien tai: `.env` root cau hinh `DB_DIALECT=mssql`, SQL Server `SQLEXPRESS`, database `WorkerManagement`.
- Online demo: API host nhan `DB_DIALECT=postgres` va credentials Supabase qua host environment variables. Frontend chi biet URL API; khong nhan DB password hay service-role key.
- `database/worker_management.sql` la T-SQL; `database/supabase_schema.sql` la PostgreSQL. Khong chay nham script.
- Supabase demo la database rieng, khong tu dong dong bo du lieu voi SQL Server local.

## 8. Cach tu hoc mot file

1. Doc ten file/folder va phan import de biet no phu thuoc vao dau.
2. Tim noi su dung route/function bang VS Code **Find All References** hoac search symbol.
3. Doc request input, validate, role, response/output.
4. Theo data path xuong service/model; kiem tra data luu trong DB hay chi state frontend.
5. Chay mot thao tac va xem Network tab (URL/status/response; khong chup Authorization token).
6. Neu thay doi, chay `npm test`, `npm run build`, `npm run lint`; so sanh `git diff`.

Khong paste `.env`, password, JWT, Authorization header, Supabase connection string, applicant phone/email that vao prompt/anh.
