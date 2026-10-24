# BÁO CÁO ĐỒ ÁN CUỐI KHÓA

## Xây dựng hệ thống Backend Worker Management

**Sinh viên:** [Điền họ tên]<br>
**Lớp:** [Điền lớp]<br>
**Giảng viên:** [Điền tên giảng viên nếu cần]<br>
**Ngày nộp:** 24/10/2026

## 1. Giới thiệu đề tài

Worker Management là ứng dụng MVP hỗ trợ quản lý thông tin công ty tuyển dụng, vị trí đang tuyển và hồ sơ ứng tuyển. Ứng viên có thể xem/tìm vị trí và gửi hồ sơ; tài khoản quản trị quản lý dữ liệu tuyển dụng và theo dõi thống kê.

Tên repository vẫn là Worker Management, nhưng phạm vi đang chạy là **MVP tuyển dụng** theo quan hệ `Company → Vacancy → Application`. Các nội dung chấm công, tính lương, hồ sơ nhân sự dài hạn và bán thiết bị không phải tính năng của bản này.

AI được dùng để hỗ trợ quá trình đọc yêu cầu, lập trình, giải thích và kiểm thử; sản phẩm không tích hợp chatbot trí tuệ nhân tạo.

## 2. Công nghệ sử dụng

- Backend: Node.js, TypeScript, Express.js.
- Cấu trúc backend: Layered Architecture với routes, middleware, controllers, services và Sequelize models.
- Cơ sở dữ liệu theo rubric: Microsoft SQL Server, truy cập qua Sequelize ORM.
- Frontend demo: React, Vite và Axios.
- Xác thực và kiểm tra dữ liệu: JWT, bcryptjs và Zod.
- Tài liệu API: Swagger UI tại `/api-docs`.

Kho mã nguồn có chế độ PostgreSQL tùy chọn để chuẩn bị bản trình diễn trực tuyến; chế độ đó chưa thay thế yêu cầu SQL Server của đồ án. Môi trường phát triển và kiểm thử tại máy này dùng SQL Server cục bộ.

## 3. Chức năng chính

1. **Tài khoản:** đăng ký User, đăng nhập JWT, xem tài khoản hiện tại; Admin được tạo riêng bằng script seed.
2. **Công ty:** xem, tìm kiếm, lọc, sắp xếp và phân trang; Admin có thể thêm/sửa/xóa theo các ràng buộc liên kết.
3. **Vị trí tuyển dụng:** xem/tìm/lọc/phân trang công khai; Admin quản lý vị trí và trạng thái tuyển dụng.
4. **Ứng tuyển:** ứng viên gửi hồ sơ vào vị trí đang mở; backend kiểm tra dữ liệu, tuổi/giới tính và chống nộp trùng số điện thoại vào cùng vị trí.
5. **Xử lý hồ sơ:** Admin xem hồ sơ và cập nhật trạng thái.
6. **Dashboard Admin:** tổng hợp số công ty, vị trí và hồ sơ theo trạng thái; API được bảo vệ theo vai trò.

## 4. Kiến trúc và luồng dữ liệu

```text
Biểu mẫu/giao diện React
  → Bộ gọi API Axios
  → Ứng dụng Express và tuyến API
  → Lớp trung gian xác thực / phân quyền / kiểm tra dữ liệu
  → Bộ điều khiển
  → Lớp dịch vụ (quy tắc nghiệp vụ và truy vấn)
  → Mô hình Sequelize
  → Microsoft SQL Server
```

Frontend không kết nối trực tiếp database. Backend kiểm tra quyền ở server cho từng API quản trị; việc ẩn nút trên giao diện không được coi là cơ chế bảo mật.

## 5. Cơ sở dữ liệu

Các bảng chính:

- `users`: tài khoản, email duy nhất, mật khẩu đã băm, vai trò `admin`/`user`.
- `companies`: công ty và thông tin khu vực/liên hệ.
- `vacancies`: vị trí tuyển dụng, thuộc một công ty.
- `applications`: hồ sơ ứng tuyển, thuộc một vị trí.

Quan hệ:

- Một `Company` có nhiều `Vacancy`.
- Một `Vacancy` có nhiều `Application`.
- Khóa ngoại, unique/check constraints và index được khai báo trong `database/worker_management.sql`.

Script SQL có dữ liệu mẫu tổng hợp để thử nghiệm. Không dùng dữ liệu cá nhân thật.

## 6. Bảo mật và validation

- Mật khẩu người dùng được băm bằng bcrypt; không trả password hash trong response đăng ký/đăng nhập.
- Đăng ký công khai luôn tạo role `user`; người dùng không thể tự gửi role Admin.
- JWT được ký HS256, có issuer, audience và thời hạn; backend tải role hiện tại từ database khi xác thực.
- API quản trị yêu cầu JWT và role Admin ở backend.
- Body/query được kiểm tra bằng Zod; API có rate limit, Helmet và CORS allowlist.
- Thông báo lỗi API cho người dùng bằng tiếng Việt; lỗi nội bộ không trả stack trace/chi tiết database.

## 7. Kiểm thử và kết quả

Đã chạy tại workspace:

| Kiểm tra | Kết quả |
|---|---|
| `npm test` | Đạt 19/19 unit tests |
| `npm run build` | Đạt backend TypeScript và frontend production build |
| `npm run lint` | Đạt backend và frontend |
| Kiểm thử tích hợp SQL Server | 8 ca tập trung đã đạt: đăng ký/persist/hash, validation, giới hạn password, email trùng, đăng nhập User, `/auth/me`, quyền User và rate limit |

**Giới hạn kiểm thử:** lượt tích hợp hoàn chỉnh chưa xác nhận đăng nhập Admin và bảng điều khiển thành công. Tài khoản Admin cục bộ có mật khẩu cấu hình chưa đáp ứng độ dài tối thiểu để đặt lại bằng tập lệnh khởi tạo. Chưa khẳng định đã kiểm thử toàn bộ chức năng tạo, đọc, sửa, xóa qua trình duyệt hoặc mọi tính năng của MVP. Cần trình bày đúng giới hạn này khi vấn đáp.

## 8. Cách chạy và tài liệu

Từ thư mục repository:

```powershell
npm install
npm test
npm run build
npm run lint
npm run dev
```

Để chạy API đầy đủ cần cài SQL Server, chạy `database/worker_management.sql`, cấu hình `.env` từ `.env.example` và seed Admin. Không đưa `.env` vào gói nộp.

- Mã nguồn: https://github.com/lns0946378752-dotcom/worker-management
- Tập lệnh SQL Server: `database/worker_management.sql`
- Nhật ký yêu cầu dành cho AI: `docs/PROMPT-LOG.md`
- Hướng dẫn trình diễn/vấn đáp: `docs/PROJECT_VIVA_GUIDE.md`
- Bản đồ chức năng và mã nguồn: `PROJECT-TRACKING/SYSTEM-FUNCTION-MAP.md`

## 9. Hạn chế và hướng phát triển

- JWT ở giao diện hiện được giữ trong bộ nhớ; tải lại trang cần đăng nhập lại.
- Chưa có xác minh email, OTP, quên mật khẩu hoặc refresh token.
- Chấm công, tính lương và các tính năng quản lý lao động dài hạn nằm ngoài MVP.
- Chưa xác nhận việc triển khai trực tuyến hoạt động; SQL Server cục bộ chỉ dùng được khi dịch vụ cơ sở dữ liệu đang chạy và có kết nối.
- Các bước tiếp theo có thể gồm hoàn thiện kiểm thử UI/CRUD, kiểm tra Admin login với credential đã được cấu hình an toàn, và triển khai theo hạ tầng phù hợp yêu cầu môn học.
