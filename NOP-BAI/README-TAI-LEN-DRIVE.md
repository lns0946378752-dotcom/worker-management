# Bộ nộp đồ án Worker Management

Tài liệu này hướng dẫn chuẩn bị thư mục Google Drive và gửi link lên LMS. Kiểm tra trạng thái từng mục trước khi nộp; không ghi thông tin đăng nhập vào bất kỳ file nào.

## Những tệp cần đặt trong thư mục Drive

1. **`worker-management-source.zip`** — bản nén mã nguồn hiện tại; không kèm `.env`, `.git`, `node_modules`, thư mục kết quả biên dịch hoặc tài liệu của dự án khác.
2. **`worker_management.sql`** — tập lệnh SQL Server tạo cơ sở dữ liệu, bảng, ràng buộc, chỉ mục và dữ liệu mẫu tổng hợp.
3. **`PROMPT-LOG.md`** — nhật ký yêu cầu dành cho AI của chính dự án này, có bối cảnh, nhiệm vụ, ràng buộc, kết quả và lý do sử dụng yêu cầu.
4. **`BAO-CAO-DO-AN.md`** — báo cáo Markdown về đề tài, kiến trúc, chức năng, kiểm thử và giới hạn. Rubric đang lưu trong dự án không ghi bắt buộc báo cáo riêng; nếu LMS/giảng viên yêu cầu PDF, đưa nội dung báo cáo vào Google Docs rồi xuất PDF.
5. **`VIDEO-DEMO.mp4`** — bạn tự quay video 3–5 phút theo `KICH-BAN-VIDEO.md`. Đây là phần cần thao tác trên máy của bạn; hiện chưa có video.
6. **`LINK-NGUON.md`** — đường dẫn mã nguồn GitHub.
7. **`PROMPT-TIEP-TUC.md`** — tùy chọn; dùng để bàn giao các lỗi và công việc còn lại cho AI khác, không phải sản phẩm bắt buộc theo rubric.

Nếu kho mã nguồn đang để riêng tư, hãy cấp quyền xem cho giảng viên trước khi nộp hoặc hỏi xem thầy/cô có chấp nhận bản nén mã nguồn không.

## Cách nộp bằng Google Drive

1. Mở Google Drive bằng tài khoản của bạn và tạo thư mục `Worker Management - [Họ tên]`.
2. Tải các tệp ở danh sách trên lên thư mục. Có thể kéo thả tệp từ File Explorer.
3. Nhấp phải thư mục → **Chia sẻ** → **Quyền truy cập chung** → đổi từ **Bị hạn chế** sang **Bất kỳ ai có đường liên kết**.
4. Chọn vai trò **Người xem** (không cấp quyền chỉnh sửa), nhấn **Sao chép đường liên kết** → **Xong**.
5. Mở cửa sổ ẩn danh và thử đường liên kết; kiểm tra người chưa đăng nhập vẫn mở/tải được các tệp.
6. Dán đường liên kết thư mục Drive vào đúng bài tập trên LMS và xác nhận LMS đã lưu/gửi bài. Không chỉ dán liên kết kho mã nguồn nếu yêu cầu là liên kết Drive.

## Không đưa lên Drive

- `.env`, mật khẩu, khóa bí mật JWT, mật khẩu cơ sở dữ liệu, mã xác thực.
- Tệp cơ sở dữ liệu vật lý `.mdf`/`.ldf`, dữ liệu ứng viên thật.
- `node_modules`, `dist`, `.git`.
- Thư mục `Mẫu từ người khác` hoặc bất kỳ tài liệu/SQL/prompt log nào của dự án Studio đó.

## Việc bạn cần tự hoàn tất

- Điền họ tên/lớp vào báo cáo.
- Quay video 3–5 phút và xem lại trước khi tải lên.
- Đăng nhập Google Drive, tạo thư mục, đặt quyền người xem và gửi liên kết lên LMS.
- Nếu yêu cầu của thầy có thêm báo cáo PDF/định dạng khác, ưu tiên yêu cầu trên LMS. Báo cáo hiện soạn bằng Markdown để có thể mở trong Google Docs/VS Code và xuất PDF khi cần.

## Trạng thái kiểm thử cần báo trung thực

- Kiểm thử đơn vị: đạt 19/19.
- Biên dịch bản phát hành backend/frontend: đạt.
- Kiểm tra quy tắc mã nguồn backend/frontend: đạt.
- Kiểm thử tích hợp SQL Server đã đạt 8 ca về đăng ký, kiểm tra dữ liệu, lưu mã băm mật khẩu, email trùng, đăng nhập User, `/auth/me`, quyền User và giới hạn đăng nhập.
- **Chưa xác nhận đăng nhập Admin thành công trong lượt tích hợp cuối.** Mật khẩu trong `.env` cục bộ chưa đạt độ dài tối thiểu 12 ký tự nên không thể dùng lệnh đặt lại an toàn; không ghi mật khẩu vào Drive. Không tuyên bố video/giao diện hay mọi chức năng tạo, đọc, sửa, xóa đã được kiểm thử đầy đủ.

Yêu cầu bàn giao để AI tiếp tục sửa lỗi: [PROMPT-TIEP-TUC.md](./PROMPT-TIEP-TUC.md). Tải kèm yêu cầu này lên Drive nếu muốn lưu kế hoạch bàn giao; đây không phải sản phẩm bắt buộc theo rubric.
