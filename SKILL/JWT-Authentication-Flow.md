# Huong dan lam viec voi JWT authentication

## 1. Luong xac thuc hien tai

1. User dang ky tai `POST /api/auth/register`; backend hash password bang bcrypt va luon tao role `user`.
2. Admin duoc tao rieng bang `npm run seed:admin`; khong cho client gui role `admin` khi dang ky.
3. Login tra access token JWT. Frontend gan token vao header `Authorization: Bearer ...`.
4. `authenticate` verify chu ky, algorithm, issuer, audience va expiration; sau do lay account/role moi nhat tu SQL Server.
5. `requireRole("admin")` kiem tra quyen o backend cho moi endpoint quan tri. An nut tren UI khong thay the middleware.

## 2. Quy tac khi thay doi

- JWT secret chi doc tu `JWT_SECRET`; startup tu choi neu secret thieu hoac ngan hon 32 ky tu.
- Token hien tai dung HS256, issuer `worker-management`, audience `worker-management-web`, het han sau mot gio.
- Khong dua role tu request/client lam nguon cap quyen; middleware lay role tu database.
- Khong ghi token, secret, password hoac authorization header vao log, test fixture, prompt log hay Git.
- Frontend hien chi giu token trong bo nho; khong tu dong luu localStorage. Refresh token/cookie-based session chua nam trong scope.
- Khi doi claims/issuer/audience/expiry, danh gia anh huong login, `/auth/me`, cac API role-gated va client; bo sung test hoi quy truoc khi merge.

## 3. Test va kiem tra

1. Them test cho token hop le, secret sai/yeu/thieu, issuer/audience sai, claims khong hop le va token het han.
2. Chay `npm test`, `npm run build`, `npm run lint` tu repo root.
3. Neu SQL Server san sang, kiem tra login, `/api/auth/me`, API admin voi admin token va API admin voi user token.
4. Bao rieng test unit va integration; khong goi integration la PASS neu chua ket noi database.
