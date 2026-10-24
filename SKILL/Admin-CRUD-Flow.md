# Huong dan them/sua/xoa chuc nang Admin

## 1. Kiem tra truoc khi code

1. Doc route, controller, service, model va schema SQL cua entity.
2. Xac nhan role duoc phep va rang buoc lien ket truoc khi xoa.
3. Dung API backend lam nguon kiem soat quyen va business rule; UI chi la lop tuong tac.
4. Tai repo hien tai, company co the xoa khi khong con vacancy; vacancy co application khong duoc xoa.

## 2. Backend

1. Route write phai co `authenticate` va `requireRole("admin")`.
2. Kiem tra input qua Zod truoc khi vao controller.
3. Controller chi chuyen request sang service va tao HTTP response.
4. Service kiem tra entity ton tai va quan he du lieu; tra loi loi nghiep vu ro rang thay vi bo qua.
5. Khong xoa cascade ho so/du lieu quan trong neu chua co quyet dinh nghiep vu ro rang.

## 3. Frontend

1. Chi render thao tac quan tri khi account role la admin, nhung khong coi viec an UI la bao mat.
2. Dung form dung lai cho create/update; hien thi ro dang them hay dang sua va co thao tac huy sua.
3. Xac nhan truoc khi delete; neu server tu choi do rang buoc lien ket thi hien dung thong diep loi.
4. Reload danh sach sau khi mutation thanh cong va xu ly trang rong sau khi xoa ban ghi cuoi trang.
5. Disable thao tac trong luc request dang xu ly de tranh gui lap.

## 4. Kiem tra

1. Chay `npm test`, `npm run build`, `npm run lint`.
2. Manual test voi admin: create/update/delete entity khong co lien ket.
3. Manual test ràng buoc: thu xoa company co vacancy va vacancy co application.
4. Goi write API voi user token/khong token va xac nhan backend tra 403/401.
5. Neu khong co SQL Server, ghi ro integration/manual backend test chua chay; khong suy dien tu build.
