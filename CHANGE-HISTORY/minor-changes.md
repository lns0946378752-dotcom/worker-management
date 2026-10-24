# Lich su thay doi nho

Ghi cac thay doi nho, sua loi cuc bo, dieu chinh tai lieu/cau hinh, va cac buoc kiem tra khong lam thay doi dang ke kien truc hoac pham vi san pham. Neu chi chay lenh kiem tra ma khong sua file theo doi trong Git, ghi ro la khong co thay doi ma nguon.

## 2026-10-24 - Kiem thu auth voi SQL Server va chuan hoa thong bao tieng Viet

- **May cap nhat:** `SANG-ADMIN`; gio local `+07:00`.
- **Pham vi:** Viet test tich hop API auth voi SQL Server local; bo sung kiem tra gioi han password bcrypt theo byte UTF-8; thong bao API xac thuc, phan quyen, validation, rate limit, 404 va loi server bang tieng Viet co dau; validate form auth tren giao dien; them tuy chon reset password Admin chi tac dong tai khoan da co role Admin.
- **To chuc tai lieu:** Them `SKILL/README.md` de phan biet quy tac AI, huong dan app va tai lieu tham khao; sap xep lai `PROJECT-TRACKING/README.md`.
- **Test da chay:** `npm test` dat 19/19; backend/frontend build va lint dat; 8 ca tich hop SQL Server dat (register/persist/hash, validation, password byte limit, duplicate email, User login, `/auth/me`, role User, rate limit).
- **Gioi han tich hop:** Admin login/dashboard chua xac nhan duoc. Hash hien tai khong khop password trong env; lenh reset tu choi chay vi password cau hinh chi co 7 ky tu, thap hon chinh sach seed toi thieu 12. Khong co thay doi nao duoc ap dung len tai khoan Admin.
- **Bao mat:** Khong ghi email, mat khau, hash, JWT secret hoac thong tin ket noi vao lich su. Khong sua tai khoan User hay du lieu nghiep vu.

## 2026-10-24 - Chuan bi bo ho so nop qua Google Drive

- **May cap nhat:** `SANG-ADMIN`; gio local `+07:00`.
- **Noi dung:** Them bao cao do an, checklist tai len Drive va kich ban video 3–5 phut trong `NOP-BAI/`; bo sung ly do su dung cho 13 muc prompt cua Worker Management.
- **Goi source:** Tao `NOP-BAI/worker-management-source.zip` tu workspace hien tai, co source thay doi chua commit; loai `.env`, `.git`, `node_modules`, build output, thu muc mau nguoi khac va tai lieu tham khao PDF/JPG.
- **Deliverables sao chep rieng:** `worker_management.sql` va `PROMPT-LOG.md` vao `NOP-BAI/`.
- **Gioi han:** Chua tao/chia se Google Drive; chua co video demo; bao cao la Markdown va chi can xuat PDF neu LMS/giang vien yeu cau.

## 2026-10-24 - Cai dependencies va kiem tra ban dong bo

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 13:10 +07:00`
- **Noi dung:** Cai dependencies theo workspace lockfile hien tai bang `npm install`; chay lai unit tests, build va lint.
- **Ket qua:** Test 11/11 dat; backend/frontend build dat; lint dat.
- **Luu y:** Khong co thay doi ma nguon/lockfile duoc ghi nhan trong Git tu qua trinh cai dat va kiem tra. Chua tao `.env` hay chay SQL Server.

## 2026-10-24 - Them so theo doi, skill va ghi nhat ky prompt

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 14:23 +07:00`
- **Repository/branch/commit goc:** `lns0946378752-dotcom/worker-management`, `main`, `98e9625`
- **Noi dung:** Them `PROJECT-TRACKING/` de ghi diem anh huong toan he thong va tung feature, cung nhat ky prompt/phan hoi; them skill ve ket noi SQL Server, JWT va CRUD Admin; README tro den cac tai lieu moi.
- **Kiem chung:** Links/thu muc duoc kiem tra; `git diff --check`, test 18/18, build va lint deu dat.
- **Gioi han:** Nhat ky prompt cu trong `docs/PROMPT-LOG.md` la tom luoc dien dat lai nhu ghi ro trong file; prompt/phan hoi moi duoc ghi lai theo phien. Khong ghi secret. Thay doi chua commit/push.

## 2026-10-24 - Chot yeu cau Sequelize cua giang vien

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 14:33 +07:00`
- **Repository/branch/commit goc:** `lns0946378752-dotcom/worker-management`, `main`, `98e9625`
- **Nguon:** Nguoi dung xac nhan giang vien yeu cau Sequelize de backend ket noi SQL Server.
- **Noi dung:** Cap nhat `SKILL/skill.md`, system impact va prompt/response log; xac dinh khong bat buoc stored procedure theo ghi chu khac. Ghi ro Sequelize ORM khong tu host database; DB hien van chay tren laptop trong LAN.
- **Kiem chung:** Kiem tra noi dung cap nhat va `git diff --check`; khong co thay doi ma nguon trong muc nay.
- **Trang thai:** Thay doi chua commit/push.

## 2026-10-24 - Ghi nhan lo ngai ket noi khi doi mang va deployment

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 14:40 +07:00`
- **Repository/branch/commit goc:** `lns0946378752-dotcom/worker-management`, `main`, `98e9625`
- **Noi dung:** Cap nhat system impact va prompt log: khong can doi DB moi tiep tuc code; DB laptop qua LAN khong con truy cap khi laptop doi mang; ghi nhan yeu cau deploy frontend, backend va database online.
- **Kiem chung:** Kiem tra tai lieu va `git diff --check`; khong co thay doi ma nguon.
- **Trang thai:** Provider, chi phi, domain va ke hoach migrate chua duoc chot; thay doi chua commit/push.

## 2026-10-24 - Doi chieu tai lieu 6 buoc va cong cu

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 14:50 +07:00`
- **Repository/branch/commit goc:** `lns0946378752-dotcom/worker-management`, `main`, `98e9625`
- **Noi dung:** Trich xuat PDF 6 buoc cua giang vien, ghi nhan tool goi y va khoang trong theo tung buoc; them `PROJECT-TRACKING/SIX-STEP-CHECKLIST.md`, cap nhat README tracking index va prompt/response log.
- **Kiem chung:** Doc PDF 22 trang; doi chieu rubric, Web-App guidance va stack hien tai; `git diff --check` dat.
- **Trang thai:** Hoan thien user stories/AC, user flow, I-P-O, SQL integration va deployment van con trong checklist; chua commit/push.

## 2026-10-24 - Tao roadmap va dashboard scope

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 15:27 +07:00`
- **Repository/branch/commit goc:** `lns0946378752-dotcom/worker-management`, `main`, `98e9625`
- **Noi dung:** Them `PROJECT-TRACKING/ROADMAP.md`, link tu README, cap nhat six-step checklist va prompt log de phan tach MVP recruitment voi vision dashboard lao dong.
- **Kiem chung:** Doi chieu requirement file va rubric; `git diff --check` dat.
- **Trang thai:** Chua them dashboard code; chua commit/push.

## 2026-10-24 - Bo sung huong dan va cap nhat tai lieu dashboard

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 15:34 +07:00`
- **Repository/branch/commit goc:** `lns0946378752-dotcom/worker-management`, `main`, `98e9625`
- **Noi dung:** Cap nhat README/API table, roadmap, checklist 6 buoc va impact notes; them huong dan cach dashboard Admin lay/hien thi metrics va cac buoc can kiem thu.
- **Kiem chung:** `npm test` dat 18/18; `npm run build`, `npm run lint` va `git diff --check` deu dat. Chua test SQL Server/browser.
- **Trang thai:** Chua commit/push.

## 2026-10-24 - Khoi tao SQL Server local va kiem thu dashboard

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 15:58 +07:00`
- **Repository/branch/commit lien quan:** `lns0946378752-dotcom/worker-management`, `main`, `90536fa`
- **Noi dung:** Chay script database tren SQL Server Express `SQLEXPRESS`; tao database `WorkerManagement`; tao SQL login rieng cho app, `.env` local va tai khoan Admin seed.
- **Bao mat:** Login chi du quyen `db_datareader`/`db_datawriter` tren database nay; khong dung `sa`. Credential/JWT secret sinh ngau nhien, khong in ra terminal, khong commit. `.env` da duoc Git ignore.
- **Kiem chung:** Tables users/companies/vacancies/applications ton tai; API `/health` tra `ok`; frontend HTTP 200; Admin login va dashboard API thanh cong, metrics 2 companies / 2 vacancies / 1 application.
- **Han che:** Chua manual test CRUD tren browser. Database va credential chi co tren may nay, khong tu dong dong bo sang laptop.
- **Trang thai Git:** Tracking docs chua commit/push; `.env` va PDF cua giang vien khong duoc dua vao Git.

## 2026-10-24 - Them huong dan deploy Vercel/API/Supabase

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 16:56 +07:00`
- **Repository/branch/commit lien quan:** `lns0946378752-dotcom/worker-management`, `main`, sau commit `90536fa`
- **Noi dung:** Cap nhat README, `.env.example`, roadmap va impact docs; them huong dan deploy API Node rieng va frontend Vercel, variables can thiet, RLS va smoke test.
- **Kiem chung:** `npm run build`, `npm test` (18/18), `npm run lint`, runtime dialect probes (postgres opt-in, mssql default). PostgreSQL hosted integration chua duoc chay.
- **Trang thai:** Chua co project/provider credentials; chua deploy.

## 2026-10-24 - Viet huong dan setup deploy cho nguoi moi

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 17:01 +07:00`
- **Repository/branch/commit lien quan:** `lns0946378752-dotcom/worker-management`, `main`, sau commit `df4bfbc`
- **Prompt nguoi dung:** “tạo cho tôi 1 file hướng dẫn chuẩn bị và cài môi trường trên các tool như vercal, supabase vì tôi chưa rành cách dùng và cũng chưa hiểu rõ cách dùng, làm giờ luôn nha”
- **Noi dung:** Mo rong `SKILL/Online-Demo-Deployment.md` thanh huong dan tung buoc cho GitHub, Supabase/Postgres schema, Render Express API, Vercel Vite frontend, tao Admin demo, smoke tests va xu ly loi.
- **Kiem chung:** Kiem tra noi dung huong dan va `git diff --check`; day la documentation-only change.
- **Gioi han:** Chua tao account/project/provider va chua thuc hien deploy; user tu tao account, tu nhap secrets. Khong chon plan tinh phi.
- **Trang thai Git:** Chua commit/push phien ban huong dan expanded nay.

## 2026-10-24 - Mo rong huong dan Supabase/Vercel va giai thich code

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 17:14 +07:00`
- **Repository/branch/commit lien quan:** `lns0946378752-dotcom/worker-management`, `main`, sau commit `4ba9674`
- **Noi dung:** Viet ro cach reset database password Supabase (khong the xem lai password cu), chuyen SQL Editor, chay schema va thao tac Import/Configure/Deploy tren Vercel/Render. Them `SKILL/Codebase-Explanation.md` va index README/PROJECT-TRACKING.
- **Kiem chung:** `git diff --check`; documentation-only phan nay.
- **Han che:** Chua tao cloud resources hay kiem tra UI provider bang tai khoan nguoi dung.
- **Trang thai Git luc ghi:** Dang o worktree, chua commit; du kien push sau khi verify.

## 2026-10-24 - Lap bang tong hop chuc nang va ma nguon

- **May cap nhat lich su:** `SANG-ADMIN`
- **Thoi diem ghi nhan:** `2026-10-24 17:17 +07:00`
- **Repository/branch/commit lien quan:** `lns0946378752-dotcom/worker-management`, `main`, `719a834`
- **Prompt nguoi dung:** “mik cần 1 bảng tổng hợp những chức năng - code - ... đang có theo kiểu cái này nằm ở đâu có chức năng gì, chức năng này hoạt động như thế nào, bản ở trên bạn đang làm về gì”
- **Noi dung:** Tao `PROJECT-TRACKING/SYSTEM-FUNCTION-MAP.md`, tra cuu tung nghiep vu, UI/API/route/controller/service/model, quyen, request/data flow, database dang chay, phan biet app hien tai va legacy-next, danh sach tinh nang chua co.
- **Kiem chung:** Doi chieu bang voi README, routes, controllers va services hien tai; `git diff --check`.
- **Han che:** Tai lieu mo ta code dang co; khong phai bao dam moi chuc nang da duoc user manual test.
- **Trang thai:** Chua commit/push.
