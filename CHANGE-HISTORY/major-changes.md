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

