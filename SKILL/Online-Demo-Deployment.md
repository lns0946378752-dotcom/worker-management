# Deploy ban demo online

## So do

- Vercel: frontend Vite.
- Render (hoac Node host tuong duong): Express API.
- Supabase: PostgreSQL.

Vercel khong host tien trinh Express dai han; API can mot Node web service rieng. Supabase PostgreSQL khac SQL Server; deploy demo nay la chuyen database, khong con dung SQL Server.

## 1. Tao database Supabase

1. Tao project moi trong Supabase.
2. Mo SQL Editor va chay `database/supabase_schema.sql` mot lan.
3. Lay connection details PostgreSQL tu Project Settings > Database. Neu Render khong ket noi duoc direct endpoint, dung Session pooler de tranh mot-so-han-che IPv4 cua direct endpoint; lay dung host, port va username hien trong Supabase.
4. Khong dua connection string/password vao Git, screenshot, prompt hay browser frontend.

## 2. Cau hinh API host

Tao Node web service tu GitHub repo, root o repository root. Build command:

```text
npm install && npm run build --workspace @worker-management/api
```

Start command:

```text
npm run start --workspace @worker-management/api
```

Dat environment variables trong dashboard host (khong trong source):

```text
NODE_ENV=production
DB_DIALECT=postgres
DB_SERVER=<Supabase database host>
DB_PORT=<Supabase port>
DB_NAME=postgres
DB_USER=<Supabase database user>
DB_PASSWORD=<secret>
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
JWT_SECRET=<random secret, at least 32 characters>
CLIENT_ORIGIN=<Vercel production URL>
ADMIN_NAME=Project Administrator
ADMIN_EMAIL=<demo admin email>
ADMIN_PASSWORD=<strong password, at least 12 characters>
```

Khong expose `SUPABASE_SERVICE_ROLE_KEY` cho frontend; app dung PostgreSQL connection chi tu API host.

Admin seed la lenh one-time `npm run seed:admin` voi environment variables tro den remote DB; chi chay mot lan va khong ghi secrets vao repo.

## 3. Deploy frontend Vercel

- Import GitHub repo.
- Root Directory: repository root.
- Framework preset: Vite.
- Build command: `npm run build --workspace @worker-management/web`.
- Output directory: `frontend/dist`.
- Add `VITE_API_URL=https://<api-host>/api`, sau do deploy lai.

Backend CORS `CLIENT_ORIGIN` phai khop chinh xac domain Vercel production.

## 4. Smoke test

1. Mo `https://<api-host>/health`, xac nhan `{ "status": "ok" }`.
2. Mo Vercel URL, dang nhap bang demo Admin, kiem tra vacancies/dashboard.
3. Thu dang ky user va nop don voi thong tin synthetic; khong dung PII that.
4. Kiem tra deploy logs neu loi ket noi DB; khong paste credential vao ticket/chat.

## Ghi chu

- Local SQL Server mode van la mac dinh (`DB_DIALECT=mssql`); PostgreSQL mode bat bang `DB_DIALECT=postgres`.
- Supabase schema la script rieng, khong chay script SQL Server tren PostgreSQL.
- Free plans co gioi han va chinh sach thay doi; kiem tra dieu kien hien tai, khong chon paid plan hay nhap billing neu chua dong y.
- Ban deploy Supabase/PostgreSQL co the khac stack SQL Server ma rubric yeu cau; can thong bao day la demo deploy tam thoi va xac nhan lai voi giang vien truoc ban nop chinh thuc.
