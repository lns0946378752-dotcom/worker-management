# Hướng dẫn demo và vấn đáp

## Kịch bản demo 3–5 phút

1. **Giới thiệu đề tài (20–30 giây):** Worker Management hỗ trợ trung tâm xem thông tin công ty, vị trí đang tuyển và nhận hồ sơ ứng tuyển.
2. **Duyệt việc làm (30–45 giây):** Mở giao diện Vite, tìm vị trí, lọc theo khu vực/trạng thái và chuyển trang.
3. **Ứng tuyển (30–45 giây):** Mở một vị trí đang tuyển, nhập họ tên, điện thoại, năm sinh, giới tính; gửi và chỉ ra hồ sơ trùng bị từ chối.
4. **Đăng nhập quản trị (30–45 giây):** Dùng tài khoản admin tạo từ `.env` và `npm run seed:admin`.
5. **Quản lý dữ liệu (45–60 giây):** Thêm công ty, tạo vị trí tuyển dụng, xem hồ sơ và cập nhật trạng thái.
6. **API và database (30–45 giây):** Mở Swagger UI, chỉ ra response phân trang và quan hệ Company–Vacancy–Application trong script SQL.
7. **Kiểm thử (20–30 giây):** Chạy `npm test` và trình bày một test validation/pagination.

## Luồng dữ liệu cần giải thích

```text
React form / filter
    ↓ Axios HTTP request
Express route → authentication/role/validation middleware
    ↓
Controller → Service → Sequelize model
    ↓
SQL Server tables, constraints and indexes
    ↓
JSON response + pagination metadata
    ↓
React renders result
```

- **Controller:** Chuyển yêu cầu HTTP thành lời gọi service và chọn status/response.
- **Service:** Chứa nghiệp vụ, điều kiện ứng tuyển và truy vấn.
- **Model:** Ánh xạ entity/quan hệ sang SQL Server bằng Sequelize.
- **JWT middleware:** Xác minh chữ ký, hết hạn và tải role hiện hành từ database.
- **Zod middleware:** Kiểm tra body/query trước khi chạy nghiệp vụ.

## Câu hỏi vấn đáp gợi ý

**Tại sao có Company, Vacancy, Application riêng?**

Mỗi bảng biểu diễn một thực thể nghiệp vụ. Một công ty có nhiều vị trí, một vị trí nhận nhiều hồ sơ; khóa ngoại thể hiện quan hệ và tránh lặp thông tin công ty trong từng hồ sơ.

**Mật khẩu lưu thế nào?**

Lưu bcrypt hash với cost factor 12; không lưu mật khẩu dạng rõ. Đăng nhập dùng `bcrypt.compare`.

**JWT có chứa mật khẩu không?**

Không. JWT chứa danh tính/claims và được ký; token không phải nơi chứa bí mật. API xác minh token và lấy role hiện tại từ database.

**Vì sao page size có giới hạn?**

Để tránh trả một lượng dữ liệu quá lớn. Truy vấn có `limit`/`offset`, sort allowlist và trả tổng số bản ghi/trang.

**Phân quyền có chỉ ở giao diện không?**

Không. Giao diện có thể ẩn chức năng nhưng backend vẫn bắt buộc `authenticate` và `requireRole("admin")` ở các API quản trị.

**Làm sao chống đơn trùng?**

Service kiểm tra đơn đã có cùng vacancy/phone và SQL Server còn có unique constraint trên cặp `(vacancy_id, phone)`, phòng trường hợp hai request đua nhau.

**Làm sao chạy lại trên máy khác?**

Chạy script SQL, tạo `.env` từ `.env.example`, cài package bằng `npm install`, seed Admin rồi chạy `npm run dev`.

## Những giới hạn cần nói trung thực

- Cần SQL Server đã cài và cấu hình mới demo được API có database; dự án không tự đổi sang dữ liệu giả khi DB lỗi.
- Unit tests không thay thế integration test chạy trên SQL Server.
- MVP chưa triển khai chấm công, lương, bán áo, Google sign-in hay phân quyền nhiều vai trò.
- JWT demo nằm trong state bộ nhớ của frontend, đăng nhập lại sau khi tải mới trang.
- Hồ sơ demo dùng dữ liệu giả; không dùng CCCD hay thông tin ngân hàng thật.
