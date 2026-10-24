# Huong dan chuan bi moi truong deploy demo

Tai lieu nay danh cho nguoi moi, theo tung buoc de co website recruitment demo truy cap duoc tu Internet:

```text
Trinh duyet -> Vercel (React/Vite) -> Render (Express API) -> Supabase (PostgreSQL)
```

Vercel chi host frontend trong setup nay; Express API can Node host rieng. Supabase PostgreSQL khac SQL Server dang chay local. Cac thay doi trong repository cho phep Sequelize chon PostgreSQL cho demo, con local van mac dinh SQL Server.

> Day la nhanh deploy tam thoi theo lua chon cua nguoi dung de kip bao cao. Neu rubric bat buoc SQL Server, can noi ro database demo online dung PostgreSQL va xac nhan voi giang vien truoc khi nop chinh thuc.

## 0. Chuan bi tai khoan va source

Can co tai khoan GitHub (repo `lns0946378752-dotcom/worker-management`), Vercel, Supabase va Render. Dang nhap cac dich vu bang tai khoan cua ban. Dung goi Free neu hien co va phu hop; khong nhap the, khong kich hoat paid plan/trial tinh phi neu chua dong y.

Code deploy da duoc push tai commit `df4bfbc` tren nhanh `main`. Neu Vercel/Render khong thay commit, vao GitHub kiem tra nhanh `main` co commit do.

Tuyet doi khong paste `.env`, database password, JWT secret, access token hay Supabase service-role key vao chat, GitHub, anh chup man hinh, hoac bien `VITE_*`. Chi nhap database credential vao phan Environment Variables cua backend host.

## 1. Tao database PostgreSQL tren Supabase

1. Dang nhap Supabase, chon **New project**.
2. Chon organization, dat ten project (vi du `worker-management-demo`) va password database manh. Luu password vao password manager rieng; khong dung lai password email/GitHub.
3. Chon region gan ban nhat neu co. Cho den khi project bao san sang.
4. Mo **SQL Editor** → **New query**.
5. Tren GitHub, mo `database/supabase_schema.sql` trong commit `df4bfbc`, copy toan bo noi dung vao SQL Editor va bam **Run** mot lan.
6. Mo **Table Editor** va xac nhan co cac bang `users`, `companies`, `vacancies`, `applications`. Du lieu cong ty/vacancy/application mau la synthetic; khong nhap ho so nguoi that.
7. Vao **Project Settings** → **Database** → **Connect**. Lay thong tin **Session pooler** neu duoc cung cap (de tranh mot so host khong truy cap duoc direct endpoint qua IPv4). Ghi tam cac truong host, port, database, username vao noi an toan. Khong chup/man hinh chia se phan password.

Khong chay `database/worker_management.sql` tren Supabase; file do la T-SQL cho SQL Server, khong phai PostgreSQL. Schema Supabase da bat Row Level Security va khong tao policy truy cap cong khai. Backend se ket noi database server-side, khong can Supabase anon/service-role key.

## 2. Deploy Express API tren Render

1. Dang nhap Render bang GitHub, chon **New** → **Web Service**, ket noi repo nay, nhanh `main`.
2. Cau hinh service:

   | Muc | Gia tri |
   |---|---|
   | Root Directory | de trong (repository root) |
   | Runtime | Node |
   | Build Command | `npm install && npm run build --workspace @worker-management/api` |
   | Start Command | `npm run start --workspace @worker-management/api` |

3. Truoc khi deploy, them cac Environment Variables sau trong Render. Thay placeholder bang dung gia tri tu Supabase; khong them dau ngoac `< >`.

   | Key | Gia tri |
   |---|---|
   | `NODE_ENV` | `production` |
   | `DB_DIALECT` | `postgres` |
   | `DB_SERVER` | host Session pooler cua Supabase |
   | `DB_PORT` | port Session pooler, dung gia tri dashboard cung cap |
   | `DB_NAME` | database name dashboard cung cap, thuong la `postgres` |
   | `DB_USER` | username pooler dashboard cung cap |
   | `DB_PASSWORD` | password database Supabase |
   | `DB_SSL` | `true` |
   | `DB_SSL_REJECT_UNAUTHORIZED` | `true` |
   | `JWT_SECRET` | secret ngau nhien rieng, dai toi thieu 32 ky tu |
   | `CLIENT_ORIGIN` | tam thoi `http://localhost:5173`; sau nay thay bang Vercel URL |

   Khong can dat `PORT`; Render tu cap port. Tao JWT secret bang password manager/generator, khong dung database password. Khong them `ADMIN_PASSWORD` neu se tao Admin theo buoc 4.

4. Chon **Create Web Service** va xem tab **Logs**. Build phai thanh cong va service phai bao live.
5. Copy domain public cua service, vi du `https://<ten-service>.onrender.com`. Mo `https://<ten-service>.onrender.com/health`; ket qua mong doi la `{"status":"ok"}`.

Neu service khong khoi dong, mo Logs va doc loi. Loi xac thuc DB: doi chieu host/port/username/password va dam bao dung Session pooler. Khong in/paste gia tri secrets de gui debug.

## 3. Deploy frontend tren Vercel

1. Dang nhap Vercel bang GitHub, chon **Add New** → **Project**.
2. Import repository `worker-management`, branch `main`.
3. Chon cau hinh:

   | Muc | Gia tri |
   |---|---|
   | Root Directory | `.` (repo root) |
   | Framework Preset | Vite |
   | Install Command | `npm install` |
   | Build Command | `npm run build --workspace @worker-management/web` |
   | Output Directory | `frontend/dist` |

4. Trong **Environment Variables**, them:

   | Key | Gia tri |
   |---|---|
   | `VITE_API_URL` | `https://<ten-service>.onrender.com/api` |

5. Bam **Deploy**, cho den khi build hoan tat va copy production URL Vercel, vi du `https://<project>.vercel.app`.
6. Quay lai Render → **Environment**, sua `CLIENT_ORIGIN` thanh dung origin Vercel (chi domain, khong them `/` hay `/api`), luu thay doi va redeploy/restart API.

Vercel URL la cong khai. Chi dung data mau. Neu thay doi `VITE_API_URL`, can redeploy frontend de Vite nhung gia tri moi vao ban build.

## 4. Tao tai khoan Admin demo tren database online

Khong dung password Admin local. Tao tai khoan rieng cho demo online:

1. Mo Vercel website va dang ky tai khoan demo voi email do ban quan ly va password manh. Dang ky mac dinh la role `user`.
2. Trong Supabase, mo **SQL Editor**, chay truy van sau va thay email bang email vua dang ky:

   ```sql
   UPDATE public.users
   SET role = 'admin', updated_at = NOW()
   WHERE email = lower('your-demo-email@example.com')
   RETURNING id, email, role;
   ```

3. Xac nhan chi mot row cua dung tai khoan demo duoc tra ve. Dang xuat va dang nhap lai tren website de giao dien nap role Admin.

Chi chay truy van nay cho tai khoan cua ban tren project demo. Khong tao tai khoan cho nguoi khac hay dung email/password that cua ho.

## 5. Kiem tra truoc khi bao cao

1. API health: `https://<ten-service>.onrender.com/health` phai tra `status: ok`.
2. API docs: `https://<ten-service>.onrender.com/api-docs`.
3. Vercel website load danh sach viec; dang nhap Admin; tab Tong quan hien metrics.
4. Tao mot user demo moi, dang xuat, nop don ung tuyen bang synthetic data.
5. Admin xem don va thay doi status; bam lam moi dashboard.
6. Thu dong/mo lai tab va truy cap website tu dien thoai/mang khac.
7. Truoc buoi bao cao, mo website/API truoc va kiem tra lai DB. Free service co the ngu hoac cold start; tinh nang, quota va chinh sach mien phi co the thay doi.

## Loi thuong gap

- **`localhost` tren website online:** sai API URL. Vercel `VITE_API_URL` phai tro toi domain Render cong khai.
- **CORS 403:** `CLIENT_ORIGIN` tren Render phai khop origin Vercel production, khong co slash cuoi.
- **API restart/error connect:** xem Render Logs; xac nhan DB env values va Supabase network/SSL. Khong sua bang cach public SQL Server local.
- **Vercel build fail:** xac nhan Root Directory la repo root, build command workspace dung, output `frontend/dist`.
- **Khong thay dashboard Admin sau khi doi role:** dang xuat/dang nhap lai de frontend cap nhat account role.
- **Website phan hoi cham lan dau:** free Node host co the sleep; truy cap `/health` truoc roi tai lai website.

## An toan va trade-off

- `.env` hien tai van chua thong tin SQL Server local; khong sua/noi credential Supabase vao file do. Hosted secrets chi cau hinh tai dashboard Render/Supabase.
- Khong commit `.env`, password, database URL hay JWT secret. Khong de `DATABASE_URL`/Supabase service key trong bien `VITE_*` vi Vite se dua gia tri vao JS frontend cong khai.
- Khong ket noi frontend truc tiep toi database; moi thao tac di qua Express API.
- PostgreSQL demo khac SQL Server yeu cau goc cua rubric. Neu can demo dung DBMS rubric, sau nay chon SQL Server hosting va chuyen env sang MSSQL; Sequelize van duoc giu.
- Chua co provider account/project nao duoc tao boi repository. Can chu tai khoan tu tao va tu nhap secrets; khong nhap billing/paid plan neu chua dong y.
