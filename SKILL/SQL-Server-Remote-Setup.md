# Huong dan ket noi backend toi SQL Server tren laptop

## Muc dich va pham vi

Huong dan nay danh cho truong hop backend chay tren may lam code, SQL Server chay tren laptop trong cung mang nha. File `.env` chua thong tin ket noi chi tao tren may chay backend va khong dua len Git, email, chat cong khai hoac video demo.

## 1. Tao database va du lieu mau tren laptop

Mo PowerShell tai thu muc goc repository tren laptop va chay:

```powershell
sqlcmd -S ".\SQLEXPRESS" -E -i ".\database\worker_management.sql"
```

- `-E` dung Windows Authentication cua tai khoan Windows hien tai.
- Neu instance khong phai `SQLEXPRESS`, thay `.\SQLEXPRESS` bang ten instance dung, vi du `localhost` cho SQL Server default instance.
- Tai khoan can co quyen tao database. Script tao `WorkerManagement`, bang, rang buoc, index va mot so ban ghi mau.
- Neu khong co `sqlcmd`, mo `database\worker_management.sql` bang SSMS va Execute toan bo script.
- Khong chay script tren database co du lieu can giu neu chua backup va hieu ro tac dong.

## 2. Cho phep ket noi trong mang noi bo

1. Xac nhan laptop va may chay backend dang o cung mang tin cay.
2. Bat TCP/IP cho SQL Server instance trong SQL Server Configuration Manager; restart service neu cong cu yeu cau.
3. Xac dinh port TCP cua instance. Port mac dinh thuong la `1433`, nhung named instance co the dung port khac.
4. Neu Windows Firewall can quy tac inbound, chi cho phep TCP port SQL tu dia chi IP rieng cua may chay backend; khong mo port ra Internet.
5. Neu router co port forwarding den SQL Server, tat quy tac do. Khong public SQL Server truc tiep.

Khong can chia se tai khoan Windows hoac mat khau qua email. Neu SQL Server bat buoc dung SQL Authentication cho ket noi tu may khac, hay tao login rieng chi du quyen tren database demo va chuyen credential bang password manager/kenh bi ma hoa.

## 3. Tao `.env` tren may chay backend

Tao file `.env` o thu muc goc repo tu `.env.example`:

```powershell
Copy-Item .env.example .env
```

Dat `DB_SERVER` la IP rieng hoac ten laptop co the phan giai tren mang noi bo; khong dung `localhost` vi backend va SQL Server o hai may khac nhau. Dat `DB_PORT`, `DB_NAME=WorkerManagement`, `DB_USER`, `DB_PASSWORD` theo cau hinh SQL Server. Tao `JWT_SECRET` ngau nhien dai it nhat 32 ky tu. Khong paste gia tri that vao terminal duoc ghi log, prompt, email hay GitHub.

Backend doc `.env` trong `backend\` neu file do ton tai; neu khong, backend doc `.env` o thu muc goc. Chi tao mot ban `.env` o thu muc goc de de quan ly.

## 4. Kiem tra ket noi va chay ung dung

1. Tren may backend, kiem tra laptop co the truy cap tren port SQL Server da cau hinh.
2. Chay `npm run dev` tu thu muc goc repository.
3. Xac nhan API hien health check tai `http://localhost:4000/health`, giao dien tai `http://localhost:5173`, va Swagger tai `http://localhost:4000/api-docs`.
4. Neu API bao loi ket noi, kiem tra ten/IP laptop, port, TCP/IP, firewall, authentication va database name. Khong sua `DB_SERVER` thanh `localhost` neu database van o laptop.

## 5. An toan va dong bo

- `.env` da duoc `.gitignore` bo qua; khong force-add file nay.
- Chi chia se `.env.example` voi placeholder; khong ghi credential that vao huong dan.
- Git khong sao luu database. Tao va cat giu backup SQL rieng; neu can di chuyen, dung backup duoc ma hoa.
- Khi doi laptop/IP/mat khau/port, cap nhat `.env` tren may backend; khong can commit thay doi nay.
- Neu credential da bi gui nham hoac commit, thu hoi/doi credential ngay va thong bao nguoi phu trach; chi xoa file hien tai khong xoa secret khoi Git history.
