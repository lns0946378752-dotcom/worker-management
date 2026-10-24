# Diem anh huong theo chuc nang

Cap nhat: 2026-10-24 14:23 +07:00, may `SANG-ADMIN`, branch `main`; code changes cua dot hien tai chua duoc commit.

## Authentication va authorization

- **Files chinh:** `backend/src/services/auth-service.ts`, `backend/src/utils/access-token.ts`, `backend/src/middleware/auth.ts`, `backend/src/routes/auth-routes.ts`, `frontend/src/api.ts`, `frontend/src/App.tsx`.
- **Hanh vi:** user dang ky/dang nhap; bearer JWT; admin seed rieng; middleware xac minh token va lay role hien tai tu DB.
- **Validation:** JWT secret toi thieu 32 ky tu; token HS256 co issuer/audience/expiry; test token nam tai `backend/src/utils/access-token.test.ts`.
- **Han che:** frontend chi giu token trong memory; refresh trang can dang nhap lai. Chua co refresh token.
- **Kiem tra lien quan:** `npm test` dat 18/18, `npm run build` va `npm run lint` deu dat; integration voi database can SQL Server va chua chay.

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
- **Can kiem tra tay:** Admin xem so lieu; user/guest bi tu choi endpoint; doi status/tao ho so roi bam lam moi; giao dien responsive. Chua xac nhan voi SQL Server that.
