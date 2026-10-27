# Worker Management

Đồ án backend quản lý công nhân. Repo được tổ chức thành API Express theo kiến trúc Layered và giao diện demo Vite + Axios, dùng SQL Server với Sequelize.

## Phạm vi bản đầu

- Tài khoản: đăng ký, đăng nhập bằng JWT; tài khoản đăng ký mặc định là `user`; quyền quản trị được cấp riêng bằng lệnh seed.
- Công ty: tạo, xem, sửa, xóa; tìm kiếm, lọc khu vực, sắp xếp và phân trang.
- Tổng quan Admin: số công nhân, công nhân mới (30 ngày), tài khoản chờ duyệt/đang hoạt động và số công ty, lấy từ `GET /api/admin/overview`.
- Quản lý tài khoản & phân quyền: duyệt/từ chối đăng ký, gán vai trò Sale/NVVP, cấp/thu hồi quyền xem danh sách công nhân cho NVVP.
- Danh sách công nhân, công ty (gắn với hồ sơ công nhân) và nhật ký hoạt động dành cho Admin.
- Swagger UI, validation, giới hạn request đăng nhập, unit test và script SQL có dữ liệu mẫu.

Quan hệ nghiệp vụ chính: `Company 1-n WorkerProfile`. Ba vai trò nghiệp vụ: Admin, Sale, NVVP. Tuyển dụng (vị trí, hồ sơ ứng tuyển) đã được loại khỏi ứng dụng; các bảng `vacancies`/`applications` cũ vẫn còn trong database, chưa có migration xóa.

## Công nghệ

- Node.js, TypeScript, Express.js
- Sequelize ORM; local SQL Server (MSSQL) and optional PostgreSQL mode for the temporary online demo
- React, Vite, Axios
- JWT, bcrypt, Zod, Swagger UI

## Cấu trúc

```text
backend/
  src/
    config/       # cấu hình môi trường và kết nối
    controllers/  # request/response HTTP
    middleware/   # xác thực, phân quyền, validation, lỗi
    models/       # Sequelize models và quan hệ
    routes/       # REST endpoints và Swagger annotations
    services/     # nghiệp vụ và truy vấn
frontend/
  src/            # giao diện React gọi API qua Axios
database/
  worker_management.sql
docs/
  PROMPT-LOG.md
  PROJECT_VIVA_GUIDE.md
legacy-next/      # bản Next.js cũ được lưu lại để tham khảo, không thuộc app chạy chính
```

## Chạy lần đầu trên Windows

Yêu cầu: Node.js LTS, npm, SQL Server và SSMS/Azure Data Studio.

1. Tạo database và bảng: mở `database/worker_management.sql` trong SSMS, chọn chạy toàn bộ script.
2. Tạo file cấu hình cục bộ bằng PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Sửa `.env`: đặt thông tin SQL Server đúng máy của bạn và thay `JWT_SECRET` bằng chuỗi ngẫu nhiên dài ít nhất 32 ký tự. Không commit `.env`.
4. Cài dependencies tại thư mục repo:

   ```powershell
   npm install
   ```

5. Tạo tài khoản Admin. Trước khi chạy, đặt `ADMIN_NAME`, `ADMIN_EMAIL` và `ADMIN_PASSWORD` trong `.env`; mật khẩu seed phải có ít nhất 12 ký tự:

   ```powershell
   npm run seed:admin
   ```

6. Khởi chạy API và giao diện:

   ```powershell
   npm run dev
   ```

   - Web: `http://localhost:5173`
   - API health: `http://localhost:4000/health`
   - Swagger UI: `http://localhost:4000/api-docs`

Nếu API không khởi động, kiểm tra SQL Server có chạy, database đã được tạo và các biến `DB_*` trỏ đúng instance. Ứng dụng báo lỗi thay vì chuyển sang dữ liệu giả.

## API chính

| Method | Path | Truy cập | Mục đích |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Công khai | Tạo tài khoản User |
| POST | `/api/auth/login` | Công khai, giới hạn tốc độ | Đăng nhập, trả JWT |
| GET | `/api/auth/me` | Bearer JWT | Lấy tài khoản hiện tại |
| GET | `/api/companies` | Đã đăng nhập | Tìm kiếm/lọc/sắp xếp/phân trang công ty |
| POST/PUT/DELETE | `/api/companies` | Admin | Quản lý công ty |
| GET | `/api/admin/overview` | Admin | Số liệu tổng quan quản lý công nhân |

Ví dụ phân trang/lọc:

```text
GET /api/companies?page=1&pageSize=10&search=kj&district=Bien+Hoa&sort=name:asc
```

Các trường sort được allowlist ở backend; page size tối đa 100.

## Kiểm tra

```powershell
npm test
npm run build
npm run lint
```

Unit tests kiểm tra validation và quy tắc pagination/sorting. Kiểm thử tích hợp với SQL Server cần database local được cấu hình.

Kiểm tra luồng đăng ký/đăng nhập với SQL Server local và tài khoản Admin đã cấu hình:

```powershell
npm run test:integration
```

Lệnh này tạo rồi xóa một tài khoản kiểm thử tổng hợp; không chạy trên database production. Nếu cần đặt lại mật khẩu cho đúng tài khoản Admin local, xem [`SKILL/README.md`](./SKILL/README.md).

## Tài liệu đồ án

- [Hướng dẫn dự án để bảo vệ đồ án (cách chạy, phân quyền, API, bảng "hỏi gì mở file nào")](./docs/PROJECT_GUIDE_FOR_DEFENSE.md)
- [Nhật ký prompt](./docs/PROMPT-LOG.md) (13 nhóm prompt được tóm lược, không phải nguyên văn)
- [Hướng dẫn vấn đáp và demo (bản cũ, xem cảnh báo đầu file)](./docs/PROJECT_VIVA_GUIDE.md)
- [Yêu cầu và rubric của giảng viên](./docs/YEU-CAU-DO-AN-CUOI-KHOA.md)
- [Theo dõi điểm ảnh hưởng toàn hệ thống và từng chức năng](./PROJECT-TRACKING/README.md)
- [Lộ trình MVP và dashboard](./PROJECT-TRACKING/ROADMAP.md)
- [Hướng dẫn kết nối backend tới SQL Server trên laptop](./SKILL/SQL-Server-Remote-Setup.md)
- [Hướng dẫn JWT](./SKILL/JWT-Authentication-Flow.md) và [luồng CRUD Admin](./SKILL/Admin-CRUD-Flow.md)
- [Hướng dẫn deploy demo Vercel + API host + Supabase](./SKILL/Online-Demo-Deployment.md)
- [Giải thích cấu trúc và luồng code cho người mới](./SKILL/Codebase-Explanation.md)

The optional PostgreSQL mode is a deployment workaround for the demo, not a replacement for the instructor's SQL Server requirement. Keep local `.env` on `DB_DIALECT=mssql` unless explicitly testing the hosted PostgreSQL environment.

Thông tin hồ sơ dùng trong dữ liệu mẫu là giả. Không đưa CCCD, tài khoản ngân hàng hay dữ liệu cá nhân thật vào database demo.
