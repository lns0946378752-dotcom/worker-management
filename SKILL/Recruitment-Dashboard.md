# Huong dan dashboard tuyen dung cho Admin

## Muc dich

Dashboard hien thi so lieu tong hop cua cac bang `Company`, `Vacancy` va `Application` de Admin theo doi MVP tuyen dung. Dashboard nay khong phai dashboard cham cong, nhan su hay tinh luong.

## Luong hoat dong

1. Admin dang nhap; giao dien chuyen sang tab `Tong quan`.
2. Frontend goi `GET /api/dashboard` kem bearer JWT.
3. Route dung `authenticate` va `requireRole("admin")`; role duoc xac minh theo tai khoan hien tai trong DB.
4. Service dung Sequelize `count()` truy van SQL Server va tra tong so cong ty, vacancy, application cung so dem tung status.
5. Frontend hien thi cac so lieu va nut `Lam moi`; khong tai thong tin ca nhan ung vien trong endpoint nay.

## Response

```json
{
  "companies": 3,
  "vacancies": {
    "total": 8,
    "open": 4,
    "paused": 2,
    "closed": 2
  },
  "applications": {
    "total": 12,
    "submitted": 5,
    "reviewing": 3,
    "accepted": 2,
    "rejected": 2
  }
}
```

So trong vi du chi de minh hoa cau truc response, khong phai so lieu cua moi truong that.

## Files chinh

- `backend/src/routes/dashboard-routes.ts`: endpoint va middleware phan quyen.
- `backend/src/controllers/dashboard-controller.ts`: tra JSON response.
- `backend/src/services/dashboard-service.ts`: truy van counts qua Sequelize.
- `frontend/src/api.ts`: kieu response.
- `frontend/src/App.tsx`: tai metrics va render dashboard.
- `frontend/src/styles.css`: layout responsive.

## Kiem thu va su co

1. Chay `npm test`, `npm run build`, `npm run lint` tai repo root.
2. Cau hinh SQL Server that; dang nhap Admin va doi chieu cac so dem voi DB.
3. Thu goi endpoint khong token va voi tai khoan User; ca hai khong duoc phep xem dashboard.
4. Tao/cap nhat application hoac vacancy status, bam `Lam moi` va kiem tra metrics.
5. Neu DB khong ket noi, API tra loi loi theo error middleware; khong thay bang metrics hardcode.

Hien tai unit test/build/lint co the kiem tra ma nguon, nhung integration voi SQL Server va browser manual test can DB va moi truong dang chay.
