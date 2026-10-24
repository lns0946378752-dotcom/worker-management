# Tien do theo 6 buoc trien khai du an

Nguon tham chieu: `SKILL/6 bước triển khai dự án phần mềm (1).pdf` (22 trang). Checklist nay doi chieu quy trinh trong PDF voi repo hien tai, khong coi vi du cong nghe/nghiep vu trong bai giang la yeu cau moi cua do an.

Cap nhat: 2026-10-24 15:32 +07:00, may `SANG-ADMIN`, branch `main`, HEAD `98e9625` (cac thay doi trong dot nay chua commit).

## Buoc 1 — Y tuong va tinh kha thi

- **Trang thai:** Co pham vi MVP va stack duoc xac nhan.
- **Hien co:** De tai he thong tuyen dung lao dong; backend Express, SQL Server/Sequelize; frontend React/Vite; AI ho tro lam san pham, khong can chat AI trong app.
- **MVP:** Quan ly company/vacancy/application; bo qua cham cong, tinh luong, OCR/chatbot va tinh nang khong co trong rubric.
- **Vision sau MVP:** dashboard van hanh lao dong co the huu ich cho su dung that, nhung can lam sau va can bao ve PII; dashboard recruitment MVP da duoc them de phuc vu quan tri va demo.
- **Can lam them:** Viet muc tieu va ket qua demo gon, co the do duoc; ghi han che/chi phi deploy truoc khi tao tai nguyen cloud.
- **Tham chieu:** PDF trang 3–6.

## Buoc 2 — Actors va hanh vi

- **Trang thai:** Actors xuat hien trong code va docs, chua co bang Actor-Behavior chinh thuc theo PDF.
- **Actors du kien theo hanh vi hien tai:** Guest/applicant (xem viec va nop ho so); registered User (dang ky/dang nhap); Admin (quan ly company/vacancy, xem va cap nhat applications).
- **Can xac nhan trong docs:** User dang nhap hien tai khong co hanh dong nghiep vu rieng ngoai account; ho so nop khong bat buoc dang nhap. Khong tu them OTP/email service hay actor ben thu ba khi chua co tich hop.
- **Tham chieu:** PDF trang 7–9.

## Buoc 3 — User Stories va Acceptance Criteria

- **Trang thai:** Chua duoc dac ta day du thanh bo user stories theo mau.
- **Theo PDF:** 3–5 stories cho moi actor; moi story co Given-When-Then cho happy path va exception path.
- **Can lam:** Viet stories nho, gan actor va AC vao feature hien co (auth, browse/filter, apply, admin CRUD/review); khong viet lai chuc nang chua nam trong scope.
- **Tham chieu:** PDF trang 10–13.

## Buoc 4 — User Flow

- **Trang thai:** Chua co hai so do user flow duoc chot va link tu tai lieu.
- **Theo PDF:** Toi thieu 2 flow; co decision branch va xu ly loi/vong lai.
- **De xuat cho du an:** (1) dang ky/dang nhap JWT; (2) tim viec → nop ho so → ket qua validation/ung tuyen. Chi them email/OTP neu giang vien/nguoi dung xac nhan.
- **Cong cu:** Mermaid trong Markdown la lua chon it cong suc va de quan ly bang Git; Draw.io neu can so do truc quan de chen vao bao cao/video; Figma/FigJam phu hop hon neu can phac UI/collaboration.
- **Tham chieu:** PDF trang 14–16.

## Buoc 5 — Modules va I-P-O

- **Trang thai:** Layered architecture va cac module code da co; dac ta Input–Processing–Output chua duoc tong hop theo checklist PDF.
- **Module code hien tai:** Auth; Companies; Vacancies; Applications; Admin Dashboard. Dashboard co route/controller/service rieng, tra ve count theo status va khong tra PII.
- **Can lam:** Tao bang I-P-O + quyen + loi cho cac hanh dong chinh; link den route/service va tests that. Khong chuyen sang Clean Architecture/NestJS/TypeORM hay PostgreSQL/Prisma tu vi du trong PDF.
- **Tham chieu:** PDF trang 17–18.

## Buoc 6 — Vibe coding, review va nghiem thu

- **Trang thai:** Code da chia theo module; build/lint/test da chay; tracking va prompt history dang duoc bo sung.
- **Da kiem chung sau dashboard:** 18 unit tests, backend/frontend production build, lint va `git diff --check` deu PASS.
- **Chua kiem chung:** Integration/CRUD thuc te voi SQL Server; UI Admin tren browser; deploy online. Khong co `.env` o repo root/`backend/` trong moi truong hien tai.
- **Can lam:** Luu prompt thuc te moi va ly do; review tung diff; doi chieu AC; demo module nho; bo sung tests cho loi/phan quyen. Khong ghi prompt cu thanh nguyen van neu chi con tom tat.
- **Tham chieu:** PDF trang 19–22.

## Phan mem theo muc dich

| Muc dich | Cong cu | Tinh trang va ly do |
| --- | --- | --- |
| Code va AI ho tro | VS Code + Copilot dang dung; ChatGPT/Cursor la lua chon thay the/bo sung | Rubric liet ke Cursor, ChatGPT, GitHub Copilot. Nen dung mot cong cu AI chinh de giam chi phi va de truy vet prompt; AI la cong cu lam bai, khong can chatbot trong san pham. |
| Quan ly source va dong bo may | Git + GitHub Private repo | Da co; commit/push source va docs. `.env` va SQL backup khong commit. |
| Quan ly SQL Server | SQL Server + SSMS | SSMS la cong cu Windows de chay script, xem schema va du lieu tren laptop; credential ket noi giu trong `.env` tren backend. |
| Test/tra cuu API | Swagger UI da co; Postman tuy chon | Bat dau bang Swagger UI. Chi cai Postman neu can luu collection/request va kich ban test lap lai. |
| Ve user flow | Mermaid truoc; Draw.io neu can file hinh | Mermaid luu text trong Git va de AI doc; Draw.io duoc PDF goi y cho so do truc quan. Figma/FigJam chi can neu can wireframe/collaboration. |
| Deploy | Azure App Service/Static Web Apps + Azure SQL la phuong an de nghien cuu | Chua duoc giang vien chi dinh provider; kiem tra free tier, chi phi, tai khoan va SQL firewall truoc khi chon. |

### Nhung gi khong copy may moc tu PDF

- PDF ghi PostgreSQL/Prisma, Tailwind, OTP/email verification, refresh token, OCR trong cac vi du; rubric rieng cua do an chot Express, SQL Server/Sequelize, Vite/Axios, JWT va layered architecture.
- OTP, email, refresh-token va AI/OCR khong tu dong tro thanh scope bat buoc neu rubric/giang vien chua yeu cau.

## Thu tu viec de nghi

1. Hoan thanh database tren laptop va test ket noi backend may nay.
2. Manual test role user/admin va luong company/vacancy/application.
3. Hoan thien user stories + acceptance criteria.
4. Ve 2 user flows (Mermaid truoc; chuyen Draw.io neu can).
5. Viet I-P-O theo module va link code/test.
6. Chon ha tang deploy sau khi biet ngan sach/tai khoan; migrate DB len dich vu SQL tuong thich, khong public port SQL tren laptop.
