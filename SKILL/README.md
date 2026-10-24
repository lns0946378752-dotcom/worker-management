# Hướng dẫn đọc thư mục SKILL

Thư mục này đang chứa nhiều loại tài liệu khác nhau, không phải tất cả đều là "skill" hay chỉ dẫn bắt buộc cho code. Dùng trang này để phân biệt nguồn gốc và chọn đúng tài liệu.

## 1. Quy tắc cho AI khi làm việc với repository

- [`skill.md`](./skill.md): quy tắc kỹ thuật, phạm vi dự án và quy trình làm việc. Đọc khi bắt đầu thay đổi code; nếu mâu thuẫn, yêu cầu cụ thể mới nhất của người dùng được ưu tiên.

## 2. Hướng dẫn và giải thích do dự án bổ sung

| Tài liệu | Dùng khi |
|---|---|
| [`Codebase-Explanation.md`](./Codebase-Explanation.md) | Muốn hiểu cấu trúc repo và lần theo request giữa giao diện, API và database. |
| [`JWT-Authentication-Flow.md`](./JWT-Authentication-Flow.md) | Muốn hiểu đăng ký, đăng nhập, JWT và phân quyền. |
| [`Admin-CRUD-Flow.md`](./Admin-CRUD-Flow.md) | Muốn theo dõi cách Admin quản lý công ty/vị trí. |
| [`Recruitment-Dashboard.md`](./Recruitment-Dashboard.md) | Muốn hiểu dashboard tuyển dụng và dữ liệu thống kê. |
| [`SQL-Server-Remote-Setup.md`](./SQL-Server-Remote-Setup.md) | Cấu hình máy phát triển kết nối SQL Server ở máy khác trong mạng. |
| [`Online-Demo-Deployment.md`](./Online-Demo-Deployment.md) | Tạo Supabase, tìm SQL Editor, cấu hình API host và deploy Vercel. |
| [`Architechture.md`](./Architechture.md) | Tài liệu tham khảo kiến trúc; đối chiếu code hiện tại trước khi áp dụng vì nội dung có thể không hoàn toàn khớp MVP. |

## 3. Tài liệu tham khảo/đầu vào đồ án

Các tệp dưới đây được giữ làm nguồn tham khảo, không phải code hay hướng dẫn vận hành app:

- [`Hướng dẫn Dự Án Web-APP.md`](./Hướng%20dẫn%20Dự%20Án%20Web-APP.md): hướng dẫn tham khảo của giảng viên.
- [`skill.md`](./skill.md): quy tắc AI do dự án duy trì, không phải tài liệu giảng viên.
- [`yeu_cau_backend_quan_ly_lao_dong.md`](./yeu_cau_backend_quan_ly_lao_dong.md): vision quản lý lao động dài hạn, không đồng nghĩa tất cả chức năng đã có trong MVP tuyển dụng.
- Các tệp PDF/JPG về rubric và quy trình 6 bước: tài liệu nguồn; giữ nguyên để tra cứu.

## 4. Nơi xem trạng thái hiện tại và lịch sử

- Chức năng đã có và vị trí code: [`../PROJECT-TRACKING/SYSTEM-FUNCTION-MAP.md`](../PROJECT-TRACKING/SYSTEM-FUNCTION-MAP.md).
- Trạng thái và điểm cần kiểm tra khi sửa: [`../PROJECT-TRACKING/README.md`](../PROJECT-TRACKING/README.md).
- Lịch sử thay đổi lớn/nhỏ và prompt nằm trong `CHANGE-HISTORY/` và `PROJECT-TRACKING/`; chúng là ghi chép lịch sử, không phải danh sách việc đã kiểm thử đầy đủ.

## 5. Kiểm thử xác thực

Các unit test chạy không cần database:

```powershell
npm test
```

Kiểm thử tích hợp đăng ký/đăng nhập/Admin thật cần SQL Server local đang chạy, schema đã cài và Admin đã seed trong `.env`:

```powershell
npm run test:integration
```

Test tích hợp tạo một tài khoản synthetic có email duy nhất, kiểm tra luồng auth và xóa đúng tài khoản đó khi kết thúc. Không dùng dữ liệu người dùng thật và không in thông tin đăng nhập hay hash mật khẩu ra log. Lệnh tích hợp có thể mất vài giây vì bcrypt; không chạy lặp khi đang chờ rate limit 15 phút.

Nếu Admin local không còn nhớ mật khẩu, hãy đặt `ADMIN_PASSWORD` trong `.env` thành mật khẩu riêng dài từ 12 ký tự (tối đa 72 byte), xác nhận `ADMIN_EMAIL` trỏ đúng tài khoản, sau đó chạy `npm run seed:admin -- --reset-password`. Không gửi/ghi mật khẩu vào chat hay Git. Lệnh chỉ đặt lại hash của tài khoản đã tồn tại khi tài khoản đó đã có role `admin`; nó không tạo tài khoản mới, không nâng role User và không in mật khẩu. Với npm workspaces, dấu `--` ở script gốc chuyển tùy chọn này tiếp tới script backend.
