# Prompt va phan hoi du an

Nhat ky nay luu cac prompt va ket qua/quyet dinh thuc te tu cac phien tiep theo khi da bat dau theo doi. Cac muc cu trong `docs/PROMPT-LOG.md` la tom luoc duoc dien dat lai, khong phai ban ghi nguyen van cua prompt lich su; khong sua chung thanh "nguyen van".

## 2026-10-24 — Chot uu tien hoan thien MVP

### Prompt nguoi dung (nguyen van)

> trước hết là hoàn thiện phần thiết thực về JWT, promt log trung thực, hoàn thiện admin
> còn về AI đấy là thầy kêu nhừo AI hỗ trợ trong quá trình làm sản phẩm chứ ko bắt buộc trong sảm phẩm phải có chat AI hỗ trợ, mình là new be trong làng vibe code nên những yêu cầu quá cao như thế sẽ ít xuất hiện, ngoài ra, tôi cần 1 cái gì đó để theo dõi tiến trình cũng như xem lại những điểm quan trọng trong dự án, ví dụ như 1 đoạn code nào đó có ảnh hưởng lớn đến các chức năng của web chẳng hạn.... tốt nhất là tách nó làm 2 loại 1 là loại ảnh hưởng lớn đến toàn bộ hệ thống, 2 là loại ảnh hưởng đến 1 - n chức năng đi, có 1 số file mình nghĩ cũng nên đưa vào skill như file ghi lại hướng dẫn làm 1 cái gì đó, mỗi khi làm 1 cái gì đó mới hoặc như nào đó bạn sẽ create 1 file .md mới trong folder skill để hướng dẫn với dạng 1. "nội dung"     2. "nội dung"
> ví dụ 1. hướng dẫn cài môi trường để be giao tiếp với db chẳng hạn, nếu mình thấy có gì chưa ổn hay ý tưởng mới mình sẽ đề xuất để bạn xem (hợp lý -> thực hiên; chưa hợp lí -> giải thích vì sao cần vì sao không cần)...; ngoài ra thầy có gửi file hướng dẫn dự án web-app để tụi mình tham khảo đấy, nếu cần thì có thể tham khảo lấy trực tiếp hoặc báo với mình về vấn đề nào đó, nhớ phải luôn cập nhập vào trong change-history và 1 file hay folder ghi lại promt tôi gửi và nội dung của bạn nha, giờ bạn thực hiện tao tác và được trước cho mình 1 câu lệnh để bên kia chạy db trên sql

### Phan hoi va quyet dinh

- Da chon AI la cong cu ho tro qua trinh lam bai, khong them chat AI vao san pham.
- Uu tien: gia co/test JWT, lam day du thao tac quan tri cong ty va vi tri, ghi prompt trung thuc, theo doi diem anh huong cap he thong va cap feature.
- Phan hoi ban dau cung cap lenh chay `database/worker_management.sql` bang `sqlcmd` tren laptop; lenh can thay instance neu khac `SQLEXPRESS`.
- Da tao huong dan rieng cho ket noi backend may nay toi SQL Server tren laptop. Khong ghi credential that vao Git.

### Ket qua thuc hien trong dot nay

- JWT: giu nguyen refactor dang co trong worktree, sua type errors lam build fail, va them tests cho claim, secret, issuer/audience, signature va expiry.
- Admin: them sua/xoa cong ty va vi tri tren giao dien; API backend da co cac endpoints tuong ung va rang buoc khong xoa du lieu dang co lien ket.
- Da tao `PROJECT-TRACKING/` voi hai file theo doi rieng cap he thong va cap chuc nang, cung nhat ky prompt/phan hoi.
- Da tao skill ve SQL Server remote setup, JWT va CRUD Admin; README tro den cac file huong dan.
- Da gui lenh chay script SQL tren laptop bang `sqlcmd`, su dung Windows Authentication; instance mac dinh can duoc doi neu ten khong phai `SQLEXPRESS`.
- Kiem tra: unit test 18/18; backend/frontend build dat; lint dat; `git diff --check` dat. Khong co `.env` va chua chay integration/manual test voi SQL Server that.
- Diem can xac nhan: `SKILL/skill.md` yeu cau stored procedure cho moi thao tac, trong khi rubric hien tai ghi Sequelize va code dang dung Sequelize truc tiep. Chua thay doi data access; can hoi lai nguoi dung/giang vien truoc khi chot.
- Thay doi trong worktree chua commit/push; mot phan JWT chua commit da ton tai truoc khi bat dau cong viec va duoc giu lai.

## 2026-10-24 — Xac nhan Sequelize la yeu cau cua giang vien

### Prompt nguoi dung (nguyen van)

> thì đúng là thầy kêu dùng sqquelize để hỗ trợ kết nối be đẩy db lên online á, nhớ thế.

### Phan hoi va quyet dinh da chot

- Ghi nho stack bat buoc la Express backend + Sequelize ORM + SQL Server, theo rubric cua giang vien.
- Sequelize duoc dung de backend ket noi va thao tac voi SQL Server; khong chuyen sang stored procedure theo dong ghi chu tham khao khac neu chua co yeu cau moi cua giang vien.
- Lam ro cach dien dat "đẩy db lên online": Sequelize khong host database. Hien tai SQL Server chay tren laptop trong mang noi bo, backend chay tren may nay; neu can host DB online trong tuong lai thi phai chon va cau hinh dich vu SQL Server rieng.
- Da cap nhat `SKILL/skill.md` va `PROJECT-TRACKING/system-impact.md` de may/agent tiep theo khong doc nham rule stored procedure la yeu cau cua do an.

## 2026-10-24 — Xac nhan yeu cau deploy toan bo he thong

### Prompt nguoi dung (nguyen van)

> vậy giờ mình chờ làm xong db mới tiếp tục hả, có ý này là khi mình mang lap ra ngoài và kết nối mạng ngoài thì db vs be có ngưng đồ bộ vì khác mạng không, toàn bộ hệ thống thầy bảo phải deloy lên online ấy

### Phan hoi va ghi nhan

- Khong can dung code trong luc cho database; co the tiep tuc cac phan frontend/backend doc lap, sau do test integration khi DB san sang.
- SQL Server chay tren laptop chi phu hop phat trien trong cung LAN; neu laptop doi sang mang khac thi backend tren may nay thuong khong truy cap duoc database.
- Yeu cau deploy toan bo he thong len online duoc ghi nhan la da xac nhan tu nguoi dung theo loi dan cua thay. Pham vi online gom frontend, API backend va SQL Server/database tuong thich, khong phai chi public frontend.
- De xuat de DB online tuong thich SQL Server (vi du Azure SQL), API va frontend cung host online; khong mo port SQL Server cua laptop ra Internet.
- Nha cung cap, chi phi/tai khoan, domain, cach deploy va cach migrate data chua chot. Chua tao tai nguyen cloud hay thay doi code deploy.

## 2026-10-24 — Goi y phan mem va ap dung tai lieu 6 buoc

### Prompt nguoi dung (nguyen van)

> ờ gợi ý các phần mềm có thể hỗ trợ mình trong mảng này đi, mik nhớ trong các file của thầy cũng có gợi ý, ngoài ra thì trong file 6 bước triển khai bạn xem thử có gì cần dùng không luôn

### Phan hoi va ket qua

- Doc rubric anh cua giang vien, `SKILL/Hướng dẫn Dự Án Web-APP.md`, `SKILL/skill.md`, va trich xuat tai lieu `SKILL/6 bước triển khai dự án phần mềm (1).pdf` (22 trang).
- Cong cu duoc giang vien/rubric goi ten: Cursor, ChatGPT, GitHub Copilot. Trong PDF 6 buoc, cong cu ve flow goi y: Draw.io, Figma/FigJam, Mermaid.js; AI coding goi y Cursor, Claude Sonnet, ChatGPT.
- Tao checklist tien do theo 6 buoc tai `PROJECT-TRACKING/SIX-STEP-CHECKLIST.md`.
- Da phan biet vi du voi yeu cau: OTP/email, refresh token, PostgreSQL/Prisma va Tailwind trong PDF chi la vi du, khong thay rubric da xac nhan stack Express + SQL Server/Sequelize + React/Vite.
- De xuat theo repo: VS Code + Copilot (hien tai), Git/GitHub, SQL Server + SSMS, Swagger UI da co; Mermaid de quan ly flow trong Git; Draw.io de tao so do; Postman tuy chon neu Swagger chua du cho test thu cong.
- Hosting: Azure App Service/Static Web Apps + Azure SQL la phuong an de nghien cuu, chua duoc chon hay tao tai nguyen; can kiem tra chi phi/tai khoan.

## 2026-10-24 — Chia pha theo vision lao dong va dashboard

### Prompt nguoi dung (nguyen van)

> tôi có 1 bất ngờ đây, file này do tôi làm cùng AI từ chủ nhật tuần trước, hiện tại chưa cần làm hết 1 lần chỉ cần vài chức năng theo yêu cầu của thầy là được, à tôi cũng đang rất cần cái dashboard để đưa vào sử dụng sau khi hoàn thành dự án nên chắc sẽ cần thêm vào luôn nếu bạn thấy hợp lý và kịp giờ vì giờ là 15h26 trong khi hạn là 14h45, chỉ còn chưa đầy 1h30p cho tôi thôi

### Phan hoi va danh gia

- Doc `SKILL/yeu_cau_backend_quan_ly_lao_dong.md`: vision dai han gom ho so lao dong (co CCCD/ngan hang), company/recruitment, bang cong/trang thai, lich su viec lam, import/export Excel, roles va audit. File cung co nhieu rule quan trong: khong tu suy dien nghi viec, khong cong trung bang cong, giu lich su.
- Phan biet vision dai han voi rubric MVP: hien tai code dang la recruitment MVP (`Company -> Vacancy -> Application`) va can uu tien hoan thien flow nay de dap ung rubric.
- Dashboard van hanh lao dong that la huong hop ly sau nay, nhung khong nen them toan bo vao deadline gan vi can them schema, role, privacy controls, audit va integration tests.
- De xuat dashboard nho cho MVP neu con thoi gian: so cong ty, vacancy theo status, application theo status va ho so moi; lay so lieu tu SQL/API aggregate, khong hardcode. Dashboard nay khac dashboard timesheet/worker management dai han.
- Deadline user nhac “14:45” trong khi gio hien tai 15:27; ghi nhan la moc thoi gian khong nhat quan, can xac nhan truoc khi mo them scope.
- Tao `PROJECT-TRACKING/ROADMAP.md` va cap nhat six-step checklist. Chua thay doi feature code o buoc nay.
- Xung dot data: rubric can SQL script co data mau; vision noi khong dung fake/demo data. De xuat chi dung synthetic data cho bai nop, khong PII that; DB van hanh khong dung data gia. Can nguoi dung xac nhan neu khong phu hop yeu cau cua thay.

## 2026-10-24 — Trien khai dashboard recruitment MVP

### Prompt nguoi dung (nguyen van)

> tôi có 1 bất ngờ đây, file này do tôi làm cùng AI từ chủ nhật tuần trước, hiện tại chưa cần làm hết 1 lần chỉ cần vài chức năng theo yêu cầu của thầy là được, à tôi cũng đang rất cần cái dashboard để đưa vào sử dụng sau khi hoàn thành dự án nên chắc sẽ cần thêm vào luôn nếu bạn thấy hợp lý và kịp giờ vì giờ là 15h26 trong khi hạn là 14h45, chỉ còn chưa đầy 1h30p cho tôi thôi

### Dinh chinh thoi han

Nguoi dung dinh chinh thoi han thuc la 17:10 ngay 2026-10-24, khong phai moc 14:45 trong prompt tren. Dashboard recruitment MVP duoc dong y lam neu kip; khong mo rong sang dashboard nhan su/cham cong.

### Phan hoi va ket qua thuc te

- Them dashboard Admin cho Company/Vacancy/Application: count tong va theo status, API `GET /api/dashboard` co JWT + role Admin, giao dien co tab Tong quan va nut Lam moi.
- So lieu lay truc tiep tu Sequelize/SQL Server; khong hardcode va khong hien PII.
- Them huong dan `SKILL/Recruitment-Dashboard.md`; cap nhat README, roadmap, checklist 6 buoc va impact/history.
- Unit test/build/lint: `npm test` dat 18/18; `npm run build`, `npm run lint` va `git diff --check` deu dat. Chua chay SQL Server integration hoac browser manual test; khong co `.env` o repo root/`backend/`.
- Files code chinh: `backend/src/routes/dashboard-routes.ts`, `backend/src/controllers/dashboard-controller.ts`, `backend/src/services/dashboard-service.ts`, `frontend/src/api.ts`, `frontend/src/App.tsx`, `frontend/src/styles.css`.
- Git: thay doi chua commit/push; commit goc luc bat dau la `98e9625` tren `main`.
