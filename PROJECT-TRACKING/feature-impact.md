# Diem anh huong theo chuc nang

Cap nhat: 2026-10-24 14:23 +07:00, may `SANG-ADMIN`, branch `main`; code changes cua dot hien tai chua duoc commit.

## Kha nang chon database cho deploy demo

- **Files chinh:** `backend/src/config/database.ts`, `backend/src/models/index.ts`, `database/supabase_schema.sql`.
- **Hanh vi:** local mac dinh `mssql`; dat `DB_DIALECT=postgres` thi Sequelize dung PostgreSQL va SSL tuy chon. Mo hinh chung duoc giu; `minimumAge`/`maximumAge` dung SMALLINT de tuong thich ca hai DBMS.
- **Data:** schema Supabase co sample synthetic rows; bat RLS va khong tao policy public. Backend phai ket noi bang server-side DB credential.
- **Limit:** chua test voi project Supabase that; thay doi DBMS la compromise tam thoi so voi yeu cau SQL Server.

## Authentication va authorization

- **Files chinh:** `backend/src/services/auth-service.ts`, `backend/src/utils/access-token.ts`, `backend/src/middleware/auth.ts`, `backend/src/routes/auth-routes.ts`, `frontend/src/api.ts`, `frontend/src/App.tsx`.
- **Hành vi:** User đăng ký/đăng nhập; JWT bearer; Admin được tạo riêng bằng seed; middleware xác minh token và lấy role hiện tại từ database.
- **Kiểm tra đầu vào:** JWT secret tối thiểu 32 ký tự; token HS256 có issuer/audience/thời hạn; mật khẩu đăng ký từ 8 ký tự và tối đa 72 byte UTF-8 để phù hợp bcrypt. Email được trim, chuẩn hóa chữ thường; đăng ký công khai luôn tạo role `user`.
- **Thông báo:** lỗi xác thực, phân quyền và validation trả tiếng Việt có dấu; lỗi không xác định không làm lộ lỗi nội bộ.
- **Hạn chế:** frontend chỉ giữ token trong bộ nhớ; tải lại trang cần đăng nhập lại. Chưa có refresh token.
- **Kiểm tra:** unit test không cần database: `npm test`; kiểm thử luồng API với SQL Server/Admin local: `npm run test:integration`. Kiểm thử tích hợp tạo và xóa tài khoản tổng hợp; không dùng production.

## Quan ly cong ty (Admin)

- **Files chinh:** `frontend/src/App.tsx`, `backend/src/routes/company-routes.ts`, `backend/src/controllers/company-controller.ts`, `backend/src/services/company-service.ts`.
- **Hanh vi:** admin tao/sua/xoa; danh sach xem cong khai. Chi xoa duoc cong ty khong con vi tri; backend tra loi loi neu con lien ket.
- **UI:** thao tac sua/xoa chi hien cho admin; xoa can xac nhan; loi API duoc hien cho nguoi dung.
- **Can kiem tra tay:** dang nhap admin va user; tao/sua cong ty; thu xoa cong ty co vacancy va khong co vacancy. Chua chay do database chua ket noi.

## Quan ly vi tri tuyen dung (Admin)

- **Files chinh:** `frontend/src/App.tsx`, `backend/src/routes/vacancy-routes.ts`, `backend/src/controllers/vacancy-controller.ts`, `backend/src/services/vacancy-service.ts`.
- **Hanh vi:** admin tao/sua/xoa; danh sach cong khai co search/filter/pagination.
- **Rang buoc xoa:** backend tu choi xoa neu da co ho so ung tuyen.
- **UI:** sua dung lai form tao; huy sua; xoa can xac nhan; sau khi xoa item cuoi trang truoc se lui page.
- **Can kiem tra tay:** admin/user; sua vacancy; xoa vacancy co/khong co applications; thu loc va phan trang. Chua chay do database chua ket noi.

## Ung tuyen va xu ly ho so

- **Files chinh:** `backend/src/services/application-service.ts`, `backend/src/routes/application-routes.ts`, `frontend/src/App.tsx`.
- **Hanh vi:** ung vien nop ho so vao vacancy dang mo; backend kiem tra tuoi/gioi tinh va chan so dien thoai nop trung cho cung vacancy; admin xem danh sach va doi trang thai.
- **Quyen:** danh sach va cap nhat trang thai chi admin; endpoint nop ho so cong khai va co rate limit.
- **Test tay:** gui ho so hop le/khong hop le, nop trung, user goi API admin, admin cap nhat status.

## Dashboard tuyen dung (Admin)

- **Files chinh:** `backend/src/routes/dashboard-routes.ts`, `backend/src/controllers/dashboard-controller.ts`, `backend/src/services/dashboard-service.ts`, `frontend/src/api.ts`, `frontend/src/App.tsx`, `frontend/src/styles.css`.
- **Hanh vi:** Admin xem tong so cong ty, vacancy va application; vacancy duoc dem theo `open`/`paused`/`closed`, application theo `submitted`/`reviewing`/`accepted`/`rejected`; co nut lam moi.
- **Quyen va du lieu:** `GET /api/dashboard` bat buoc JWT va role `admin`; backend truy van count tu Sequelize/SQL Server, khong tinh tu danh sach phan trang, khong tra thong tin ca nhan.
- **Da kiem tra:** SQL Server Express local, Admin login va dashboard endpoint thanh cong; database mau tra 2 cong ty, 2 vacancy, 1 application.
- **Can kiem tra tay:** user/guest bi tu choi endpoint; doi status/tao ho so roi bam lam moi; CRUD tren browser va responsive layout.
