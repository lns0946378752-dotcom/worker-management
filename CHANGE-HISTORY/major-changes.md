# Lich su thay doi lon

Chi ghi cac thay doi lam thay doi dang ke kien truc, cong nghe, pham vi chuc nang, quy trinh chay, hoac cau truc du an. Moi muc phai phan biet ro thay doi duoc dong bo tu remote voi thay doi duoc tao truc tiep tren may.

## 2026-10-24 - Dong bo kien truc do an backend tu remote

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 13:10 +07:00`
- **Repository/branch:** `lns0946378752-dotcom/worker-management`, `main`
- **Commit hien tai:** `51b5d8a` (`feat: migrate worker management to required stack`)
- **Nguon thay doi:** Commit co san tren `origin/main`, duoc fast-forward tu may nay; khong phai thay doi code moi do may nay tu viet.
- **Noi dung lon:** Chuyen app chinh tu ban Next.js demo quan ly nhan su sang he thong quan ly tuyen dung voi API Express + TypeScript theo lop (`routes`, `controllers`, `services`, `models`), giao dien React + Vite, va SQL Server + Sequelize.
- **Chuc nang/pham vi hien tai:** Dang ky/dang nhap JWT; danh sach, tim kiem, loc va phan trang cong ty/viec lam; admin quan ly cong ty va vi tri; ung vien nop ho so; admin xem va cap nhat trang thai ho so; Swagger, validation, phan quyen va rate limiting. Cham cong, tinh luong va cac tinh nang ngoai MVP chua duoc thuc hien.
- **Cau truc lien quan:** `backend/`, `frontend/`, `database/`, `legacy-next/`. `legacy-next/` la ban cu de tham khao, khong phai app chinh hien tai.
- **Kiem chung luc cap nhat:** `npm test` dat 11/11; `npm run build` dat cho backend va frontend; `npm run lint` dat. Chua chay ket noi database that vi may chua co `.env` va can SQL Server.
- **Trang thai Git luc ghi:** `main` khop `origin/main`; worktree sach.

## 2026-10-24 - Hoan thien thao tac quan tri va gia co JWT

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 14:23 +07:00`
- **Repository/branch:** `lns0946378752-dotcom/worker-management`, `main`
- **Commit goc truoc dot:** `98e9625` (`Add SKILL folder`)
- **Nguon thay doi:** Worktree da co mot phan refactor JWT chua commit truoc khi bat dau; duoc giu lai, khong xoa hay reset. Dot nay sua type errors lam build backend that bai, khai bao kieu ro hon cho middleware, va them test hoi quy.
- **Noi dung lon:** Giao dien Admin them sua/xoa cong ty va vi tri, bao gom trang thai va thong tin vi tri; van dung API/backend checks quyen va rang buoc FK san co. JWT tiep tuc yeu cau secret, issuer/audience, HS256 va expiry theo helper dang co.
- **Phan vi test JWT:** Token hop le, signature sai, issuer/audience sai, token het han, thieu identity claims va secret thieu/yeu.
- **Kiem chung:** `npm test` dat 18/18; `npm run build` dat cho backend va frontend; `npm run lint` dat; `git diff --check` dat.
- **Gioi han:** Chua test tay giao dien admin hoac API voi SQL Server vi `.env`/database chua duoc cau hinh tren may nay.
- **Trang thai Git luc ghi:** Cac thay doi dang o worktree, chua commit/push; JWT diff da ton tai mot phan truoc dot nay.

## 2026-10-24 - Xac nhan yeu cau deploy toan bo he thong online

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 14:40 +07:00`
- **Repository/branch/commit goc:** `lns0946378752-dotcom/worker-management`, `main`, `98e9625`
- **Nguon:** Nguoi dung xac nhan thay yeu cau toan bo he thong phai deploy online.
- **Anh huong:** Database chi chay tren laptop se chi truy cap duoc tu backend qua LAN; khi laptop doi mang, ket noi dev co the dut. Deploy can bao phu frontend, Express API va SQL Server/database tuong thich tren ha tang online.
- **Huong de xuat, chua chot:** Azure SQL hoac SQL Server hosting tuong thich; API noi den DB qua environment variables va uu tien private networking; frontend cau hinh API URL/CORS theo hosting. Khong public port SQL cua laptop.
- **Trang thai:** Moi la ghi nhan yeu cau va de xuat; chua chot provider/chi phi/domain, chua tao tai nguyen cloud, chua thay doi code deploy.

## 2026-10-24 - Chia pha vision quan ly lao dong va MVP tuyen dung

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 15:27 +07:00`
- **Repository/branch/commit goc:** `lns0946378752-dotcom/worker-management`, `main`, `98e9625`
- **Nguon:** Nguoi dung chia se file vision backend quan ly lao dong da cung AI soan tu truoc va xac nhan chi can chon vai chuc nang theo rubric; co nhu cau dashboard de su dung sau khi hoan thanh.
- **Noi dung lon:** Tach vision dai han (ho so lao dong, lich su viec, bang cong, trang thai, Excel, roles/audit) khoi MVP dang code (Company–Vacancy–Application). De xuat dashboard recruitment nho cho MVP neu DB/time cho phep; dashboard van hanh lao dong la pha sau do can privacy/audit.
- **Kiem chung:** Doc file vision 366 dong va doi chieu rubric; ghi roadmap va checklist. Chua implement dashboard.
- **Gioi han/cau hoi:** Deadline duoc neu 14:45 nhung thoi gian hien tai 15:27; chua ro deadline thuc. Xung dot ve synthetic sample data can theo doi.
- **Trang thai:** Chi cap nhat tai lieu; chua commit/push.

## 2026-10-24 - Them dashboard tong quan tuyen dung cho Admin

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 15:34 +07:00`
- **Repository/branch/commit goc:** `lns0946378752-dotcom/worker-management`, `main`, `98e9625`
- **Nguon thay doi:** Them moi tren may nay theo huong dashboard recruitment da thong nhat; khong thay doi stack hay mo rong sang cham cong/tinh luong.
- **Noi dung lon:** Them `GET /api/dashboard` co JWT + role Admin, thong ke cong ty, vacancy va application theo status tu Sequelize; giao dien tong quan admin tu dong hien sau dang nhap Admin, co cap nhat so lieu va responsive cards.
- **Pham vi du lieu:** Chi hien so tong hop, khong tra thong tin ung vien/PII; khong dung so lieu gia.
- **Tai lieu:** Cap nhat README, roadmap, six-step checklist va tracking; them huong dan `SKILL/Recruitment-Dashboard.md`.
- **Kiem chung:** `npm test` dat 18/18; `npm run build`, `npm run lint` va `git diff --check` deu dat. SQL Server integration va browser test chua duoc chay; khong tim thay `.env` o repo root hoac `backend/`.
- **Trang thai Git:** Chua commit/push; co cac thay doi khac trong worktree tu cac dot truoc, duoc giu nguyen.
