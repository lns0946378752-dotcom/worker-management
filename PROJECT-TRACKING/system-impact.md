# Diem anh huong toan he thong

## Trang thai tong quan — 2026-10-24

- **May ghi nhan:** `SANG-ADMIN`
- **Repo/branch/commit luc ghi:** `lns0946378752-dotcom/worker-management`, `main`, `98e9625`
- **Kien truc chinh:** React + Vite frontend; Express + TypeScript backend theo routes/controllers/services/Sequelize models; SQL Server.
- **Nguon chuan cho yeu cau:** `docs/YEU-CAU-DO-AN-CUOI-KHOA.md` va rubric cua giang vien trong `SKILL/`.
- **Quy uoc thay doi:** Kiem tra Git truoc khi sua; bao toan thay doi chua commit; cap nhat `CHANGE-HISTORY/` sau moi dot lam viec.

## Xac thuc va quyen truy cap

- Dang ky tu tao tai khoan luon gan role `user`; admin duoc tao bang script seed rieng.
- Backend ky va xac minh bearer JWT; secret lay tu `JWT_SECRET` va phai dai it nhat 32 ky tu.
- JWT duoc rang buoc issuer `worker-management`, audience `worker-management-web`, algorithm `HS256`, va han mot gio.
- Middleware tai role hien tai tu database moi request, khong tin role tu client/JWT de cap quyen.
- Frontend giu access token trong bo nho JavaScript; tai lai trang se mat token va can dang nhap lai. Chua co refresh token/cookie auth.
- **Can regression khi sua:** startup validation secret; login/register; `/api/auth/me`; admin/user access; expired/invalid token; CORS/API calls.
- **Trang thai can chu y:** Mot phan refactor JWT da ton tai o worktree truoc dot sua nay, chua commit (`backend/src/utils/access-token.ts` va cac sua doi auth). Da giu nguyen va bo sung test hoi quy; xac minh bang tests/build sau khi hoan tat.

## Database va cau hinh

- Backend doc `.env` tu `backend/` neu co, neu khong doc `.env` o repo root. Chi dung `.env.example` lam mau; secret that khong duoc dua vao Git.
- `database/worker_management.sql` tao database/bang/constraint/index va du lieu demo; Git khong sao luu database dang chay.
- **Mo hinh da xac nhan:** backend chay tren may nay; laptop chay SQL Server. Tao `.env` tren may backend; laptop chi can SQL Server va script database.
- Ket noi SQL Server tu laptop qua LAN can IP/ten host va port that; `localhost` o backend se khong tro toi laptop.
- Huong dan cai dat: [`../SKILL/SQL-Server-Remote-Setup.md`](../SKILL/SQL-Server-Remote-Setup.md).
- **Quyet dinh da xac nhan:** giang vien yeu cau Sequelize ORM de backend ket noi/thao tac SQL Server. Ap dung Sequelize theo rubric; khong chuyen sang stored procedure theo ghi chu tham khao khac neu chua co yeu cau moi tu giang vien. Sequelize khong tu host database; DB hien chay tren laptop trong mang noi bo.
- **Yeu cau da xac nhan:** giang vien yeu cau deploy toan bo he thong len online. Chay DB tren laptop chi la buoc phat trien/kiem thu; neu laptop chuyen sang mang khac thi backend o may nay thuong se mat ket noi toi SQL Server qua LAN.
- **Huong trien khai de xuat, chua chot nha cung cap:** deploy frontend, Express API va SQL Server tuong thich (vi du Azure SQL) len cac dich vu online; dat API URL/CORS va credentials qua environment variables cua hosting. Nen de API noi toi database qua ket noi/private network neu nha cung cap ho tro; khong public SQL port truc tiep.
- Cac lua chon hosting, tai khoan/chi phi, domain va cach migrate schema/data tu laptop len cloud chua duoc xac nhan. Khong tu tao tai khoan, bat dau trial tinh phi, hay dua secret vao Git.

## Build va checks

- Lenh tu repo root: `npm test`, `npm run build`, `npm run lint`.
- Tich hop database that chua duoc kiem chung neu may nay chua cau hinh SQL Server va `.env`.
- Ket qua sau dashboard: unit tests 18/18, build backend/frontend, lint va `git diff --check` deu dat; ket noi SQL Server that chua duoc chay tren may nay do khong co `.env` o repo root/`backend/`.

## Admin dashboard

- `GET /api/dashboard` la API moi, dung chung authenticate/role middleware; chi Admin duoc truy cap. Middleware truy van role hien tai tu database, khong tin role do client tu gui.
- Service dem cong ty, vacancy va application bang Sequelize; UI chi hien so tong hop/status, khong tra PII.
- **Can kiem tra regression khi sua:** user/guest khong doc duoc API; Admin nhin thay so khop SQL; lam moi cap nhat ket qua; loi ket noi DB duoc hien ro; UI van dung tren man hinh nho.
- Hien chua co SQL Server ket noi de kiem chung endpoint hoac so lieu thuc te.
