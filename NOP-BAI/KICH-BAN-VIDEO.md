# Kịch bản video demo 3–5 phút

Quay màn hình, nói ngắn gọn và dùng dữ liệu hiện có. Không quay `.env`, mật khẩu, mã xác thực, thông tin cá nhân thật hoặc màn hình quản lý thông tin đăng nhập.

## Gợi ý nội dung

1. **0:00–0:25 — Giới thiệu:** tên đồ án, mục tiêu MVP tuyển dụng và bộ công nghệ Express/Sequelize/SQL Server cùng React/Vite.
2. **0:25–1:05 — Ứng viên:** xem danh sách vị trí, tìm kiếm/lọc theo khu vực hoặc trạng thái, mở biểu mẫu ứng tuyển và giải thích dữ liệu đầu vào.
3. **1:05–1:40 — Xác thực:** trình bày cách đăng ký User hoặc giải thích luồng đăng nhập. Không công khai mật khẩu trong video; nếu Admin chưa đăng nhập được thì nói rõ và minh họa tuyến API/quyền trong mã nguồn thay vì giả vờ thành công.
4. **1:40–2:35 — Quản trị:** nếu đăng nhập được, trình bày bảng điều khiển, quản lý công ty/vị trí và xử lý hồ sơ. Chỉ trình diễn những gì đã xác nhận hoạt động.
5. **2:35–3:25 — API/cơ sở dữ liệu:** mở Swagger, cho thấy một tuyến API; chỉ ra hai quan hệ `Company → Vacancy` và `Vacancy → Application` trong tập lệnh SQL.
6. **3:25–4:10 — Mã nguồn:** lần theo một yêu cầu từ tuyến API → lớp trung gian → bộ điều khiển → lớp dịch vụ → mô hình; giải thích backend kiểm tra vai trò và dữ liệu đầu vào.
7. **4:10–4:35 — Kiểm thử/giới hạn:** cho thấy `npm test` (19/19), build/lint; nói rõ những ca kiểm thử tích hợp đã chạy và phần Admin/giao diện nào chưa được xác nhận.

Nếu giới hạn 3 phút, rút ngắn phần 2–4 và giữ lại đoạn giải thích code cùng kết quả kiểm thử.

## Trước khi quay

- Chạy `npm run dev`; kiểm tra trang web và `http://localhost:4000/health`.
- Dùng dữ liệu đã có hoặc do chính bạn nhập; không tự tạo dữ liệu giả.
- Tắt thông báo desktop, không mở `.env` hay password manager.
- Xem lại video để chắc chắn không lộ thông tin đăng nhập; tải lên Drive dưới tên `VIDEO-DEMO.mp4`.
