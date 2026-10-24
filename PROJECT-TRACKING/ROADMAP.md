# Lo trinh de tai va dashboard

Cap nhat 2026-10-24, may `SANG-ADMIN`, branch `main`, HEAD `98e9625`.

## Dinh huong tong the

Tai lieu `SKILL/yeu_cau_backend_quan_ly_lao_dong.md` ghi lai y tuong dai han ve he thong quan ly lao dong noi bo: ho so lao dong, cong ty/tuyen dung, lich su lam viec, bang cong va trang thai lam viec. Day la huong san pham sau nay, khong dong nghia phai xay tat ca trong MVP nop mon hoc.

Rubric hien tai van la nguon chuan cho stack va deliverables: Express, Sequelize, SQL Server, Vite/Axios, Layered architecture, auth JWT Admin/User, it nhat hai nghiep vu co quan he, search/filter/pagination, Swagger, SQL script, prompt log va video demo.

## Pha 1 — MVP nop mon hoc (uu tien)

Code hien tai tap trung vao Company -> Vacancy -> Application. Hoan thien va demo mot vong dau-cuoi:

1. Dang ky/dang nhap JWT; seed admin; backend enforced role.
2. Public xem/tim/loc viec va cong ty.
3. Admin them/sua/xoa cong ty va vi tri; rang buoc khong xoa du lieu dang lien ket.
4. Ung vien nop ho so; admin xem va cap nhat trang thai.
5. **Dashboard tuyen dung cho Admin (da them):** tong cong ty, vi tri dang mo/tam dung/dong, tong ho so va dem theo trang thai. API Admin-only lay so dem truc tiep tu database; khong hien PII hay tao so lieu gia. SQL Server integration va thao tac UI thuc te van can kiem tra khi DB san sang.
6. SQL script, Swagger, test, README, prompt log trung thuc, demo video.

Dashboard nay co gia tri de theo doi quy trinh tuyen dung trong app hien tai va co the dung de demo; no **khong phai** dashboard quan ly lao dong/bang cong day du.

## Pha 2 — Dashboard van hanh lao dong (sau khi MVP/deploy)

Chi bat dau sau khi xac nhan roles, business rules, privacy va database schema:

- So lao dong dang lam theo cong ty/bo phan va lich su lam viec.
- Tong hop bang cong theo ky, danh sach can kiem tra; khong tu danh dau nghi viec khi thieu ten tren bang cong.
- Theo doi nhu cau tuyen va lich su dieu chinh.
- Yeu cau bao nghi va trang thai xu ly theo quyen.

Khong them tinh luong; tai lieu nguoi dung ghi ro luong/chi tra nam ngoai pham vi. Khong lam dashboard bang data gia.

## Pha 3 — Ho so va tich hop noi bo

- Ho so ca nhan co CCCD, ngay sinh, dien thoai, Zalo, tai khoan ngan hang, bao hiem va sale phu trach.
- Lich su chinh sua thong tin dinh danh, lich su lam viec va chuyen cong ty.
- Import/export Excel, nhap bang cong, log thao tac, quan ly tai khoan/roles, dang nhap Google.

Day la du lieu nhay cam va scope lon. Truoc khi code can chot phan quyen tung truong, luu tru/ma hoa, retention, audit, backup, hosting va quy trinh cap quyen. Khong dua data lao dong that vao repo/demo; chi dung synthetic fixtures neu duoc cho phep cho bai nop.

## Quy tac scope va dau vao du lieu

- Khong nham lan rubric nop mon hoc voi vision dai han trong file yeu cau lao dong.
- Rubric yeu cau SQL script co du lieu mau; file vision noi khong dung fake/demo data. Chot huong an toan: script nop mon chi dung du lieu synthetic, khong thong tin ca nhan that; moi truong van hanh dung DB rieng va data duoc phe duyet. Neu nguoi dung/thay yeu cau khac, can xac nhan truoc khi sua script.
- Google login trong vision chua duoc xay; MVP rubric dang dung dang ky/dang nhap JWT email/password. Khong tu them OAuth trong thoi gian MVP.
- Dashboard MVP chi bao cao ve recruitment entities da co; chua hien thong tin CCCD, bank, timesheet, payroll hoac PII.
- Deploy toan bo he thong online la yeu cau da xac nhan; chon hosting va chuyen database sau khi co thong tin tai khoan/chi phi va ket noi DB.

## Trang thai kiem chung dashboard MVP

- API va giao dien da duoc them; metric `open`, `paused`, `closed`, `submitted`, `reviewing`, `accepted`, `rejected` dung cac gia tri status hien co trong model.
- Dashboard chi hien cho Admin; backend cung bao ve endpoint bang JWT va role hien tai tu database.
- Chua ket noi SQL Server de chay integration test hoac xac nhan so lieu tren du lieu that; can lam buoc nay truoc demo.
