# Nhật ký Prompt AI — Worker Management

> Nhật ký tóm lược các yêu cầu và chỉ dẫn thực tế đã dùng trong cuộc hội thoại để phân tích và xây dựng kho mã nguồn. Các mục dưới đây được diễn đạt lại theo cấu trúc Bối cảnh–Nhiệm vụ–Ràng buộc; không phải bản ghi nguyên văn mọi tin nhắn. Khi tiếp tục dùng AI, hãy bổ sung yêu cầu thực tế, câu trả lời đã áp dụng và kết quả kiểm chứng.

## 1. Đọc bối cảnh dự án

**Bối cảnh:** Không gian làm việc có ghi chú ý tưởng, tài liệu môn học và bài tập.

**Nhiệm vụ:** Đọc tài liệu để nắm hệ thống trước khi hỗ trợ làm dự án.

**Ràng buộc:** Phân biệt ghi chú dự án với tài liệu học; nêu rõ phần nào không trích xuất được.

**Kết quả áp dụng:** Xác định ý tưởng quản lý lao động/tuyển dụng và các bộ công nghệ đã được ghi ở tài liệu.

## 2. Đọc yêu cầu cuối khóa từ ảnh

**Bối cảnh:** Giảng viên gửi ảnh yêu cầu bài và tiêu chí chấm điểm.

**Nhiệm vụ:** Trích xuất bộ công nghệ, chức năng bắt buộc, sản phẩm phải nộp và tiêu chí chấm.

**Ràng buộc:** Lấy yêu cầu trong ảnh làm nguồn chính, không nhầm bộ công nghệ trong tài liệu tham khảo với bộ công nghệ của đồ án.

**Kết quả áp dụng:** Ghi nhận Node.js/Express, SQL Server/Sequelize, Vite/Axios, JWT, hai chức năng nghiệp vụ trở lên, tìm kiếm/lọc/phân trang, Swagger, SQL script, prompt log và video demo.

## 3. Lưu yêu cầu thành Markdown

**Bối cảnh:** Yêu cầu và tiêu chí chấm đang được chia sẻ dưới dạng ảnh.

**Nhiệm vụ:** Tạo tệp Markdown để tra cứu khi làm bài ở máy khác.

**Ràng buộc:** Lưu tiêu chí chấm, sản phẩm cần nộp, danh sách kiểm tra và khác biệt công nghệ với ghi chú cũ.

**Kết quả áp dụng:** Tạo file yêu cầu đồ án trong workspace tài liệu.

## 4. Chọn phạm vi MVP

**Bối cảnh:** Đề tài là hệ thống quản lý lao động và tuyển dụng.

**Nhiệm vụ:** Chọn phạm vi đủ nhỏ nhưng đáp ứng ít nhất hai chức năng nghiệp vụ.

**Ràng buộc:** Ưu tiên quan hệ công ty–vị trí tuyển dụng và vị trí–hồ sơ ứng tuyển; để chấm công, lương, bán áo và báo cáo nâng cao ngoài phạm vi MVP.

**Kết quả áp dụng:** Mô hình Công ty 1-n Vị trí tuyển dụng và Vị trí tuyển dụng 1-n Hồ sơ ứng tuyển.

## 5. Khảo sát kho mã nguồn GitHub

**Bối cảnh:** Kho mã nguồn được cung cấp tại `lns0946378752-dotcom/worker-management`.

**Nhiệm vụ:** Kiểm tra nhánh chính, tệp khai báo, mã nguồn, lớp dữ liệu và tài liệu trước khi thay đổi.

**Ràng buộc:** Bảo toàn mã nguồn hiện có; không giả định công nghệ trong ghi chú cũ trùng với kho mã nguồn.

**Kết quả áp dụng:** Phát hiện kho mã nguồn hiện dùng Next.js, JSON/Supabase, không khớp bộ công nghệ của bài cuối khóa.

## 6. Chốt cách chuyển bộ công nghệ

**Bối cảnh:** Kho mã nguồn ban đầu dùng Next.js nhưng tiêu chí yêu cầu Express, SQL Server/Sequelize và Vite/Axios.

**Nhiệm vụ:** Chọn hướng xử lý trước khi sửa đổi kiến trúc lớn.

**Ràng buộc:** Tuân thủ tiêu chí chấm và không âm thầm giữ giao diện/cơ sở dữ liệu lệch yêu cầu.

**Kết quả áp dụng:** Người dùng chọn chuyển sang Express + Sequelize + SQL Server và Vite + Axios.

## 7. Thiết kế schema quan hệ

**Bối cảnh:** Cần có ít nhất hai nghiệp vụ liên kết; tiêu chí chấm đánh giá chuẩn hóa 3NF, khóa ngoại, chỉ mục và kiểu dữ liệu.

**Nhiệm vụ:** Thiết kế các bảng Users, Companies, Vacancies và Applications.

**Ràng buộc:** Dùng UUID, khóa ngoại, ràng buộc duy nhất, ràng buộc kiểm tra và dữ liệu mẫu tổng hợp.

**Kết quả áp dụng:** Tạo script SQL Server có bảng, quan hệ, index và seed records.

## 8. Xây dựng xác thực và phân quyền

**Bối cảnh:** Tiêu chí chấm yêu cầu đăng ký, đăng nhập JWT, băm mật khẩu và quyền Admin/User.

**Nhiệm vụ:** Xây API register/login/me, lớp trung gian phân quyền và lệnh khởi tạo Admin.

**Ràng buộc:** Mọi tài khoản tự đăng ký mặc định là User; không cho phía máy khách tự gửi role Admin; dùng bcrypt và khóa bí mật từ `.env`.

**Kết quả áp dụng:** Thêm dịch vụ xác thực, lớp trung gian JWT bearer, kiểm soát vai trò và lệnh tạo Admin riêng.

## 9. Xây chức năng CRUD và ứng tuyển

**Bối cảnh:** MVP quản lý công ty, vị trí tuyển dụng và hồ sơ ứng tuyển.

**Nhiệm vụ:** Tạo tuyến API/bộ điều khiển/lớp dịch vụ cho chức năng tạo, đọc, sửa, xóa công ty/vị trí, gửi đơn và để Admin xử lý trạng thái.

**Ràng buộc:** Kiểm tra công ty tồn tại, chỉ nhận hồ sơ cho vị trí đang mở, kiểm tra giới tính/tuổi và chống nộp trùng vào cùng vị trí bằng số điện thoại.

**Kết quả áp dụng:** Thêm các lớp xử lý và API tương ứng, không dùng dữ liệu giả làm fallback.

## 10. Tìm kiếm, lọc và phân trang

**Bối cảnh:** Danh sách tuyển dụng/công ty/hồ sơ cần truy vấn dữ liệu với giới hạn phù hợp.

**Nhiệm vụ:** Thực hiện tìm kiếm, lọc khu vực/bộ phận/trạng thái, sắp xếp và phân trang ở máy chủ.

**Ràng buộc:** Dùng truy vấn ORM có tham số; giới hạn kích thước trang; chỉ cho sắp xếp theo danh sách trường cho phép.

**Kết quả áp dụng:** Sequelize `findAndCountAll`, tiện ích phân trang và thông tin phân trang trong phản hồi.

## 11. Bảo vệ API và tài liệu

**Bối cảnh:** Tiêu chí chấm yêu cầu kiểm tra dữ liệu, lớp trung gian kiểm tra quyền và Swagger UI.

**Nhiệm vụ:** Thêm kiểm tra dữ liệu bằng Zod, phân quyền JWT, giới hạn tốc độ, Helmet, CORS giới hạn nguồn truy cập và Swagger.

**Ràng buộc:** Không trả mã băm mật khẩu; không trả dấu vết lỗi nội bộ cho phía máy khách; thông báo lỗi rõ ràng.

**Kết quả áp dụng:** Thêm các lớp trung gian và trang `/api-docs`.

## 12. Giao diện demo bằng Vite/Axios

**Bối cảnh:** Tiêu chí chấm yêu cầu giao diện cơ bản gọi API, dùng Vite và Axios.

**Nhiệm vụ:** Xây giao diện tiếng Việt để duyệt tuyển dụng, tìm kiếm/lọc, xem công ty, đăng ký/đăng nhập, ứng tuyển và để Admin xem hồ sơ.

**Ràng buộc:** Gọi backend thật; không dùng dữ liệu mô phỏng thay cho SQL Server.

**Kết quả áp dụng:** Tạo ứng dụng React + Vite; backend phải kết nối SQL Server để cung cấp dữ liệu.

## 13. Kiểm thử, build và hướng dẫn demo

**Bối cảnh:** Cần có bằng chứng chất lượng và chuẩn bị cho phần vấn đáp.

**Nhiệm vụ:** Viết kiểm thử đơn vị cho kiểm tra dữ liệu/phân trang; chạy biên dịch/kiểm thử và ghi kết quả thực tế.

**Ràng buộc:** Chỉ báo đạt cho các bước kiểm tra đã chạy; kiểm thử tích hợp cần SQL Server thật.

**Kết quả áp dụng:** Bổ sung kiểm thử tập trung và cập nhật kết quả sau mỗi lượt xác minh.

## Bằng chứng triển khai

| Mốc | Lệnh/check | Kết quả |
| --- | --- | --- |
| Khảo sát nguồn | `git ls-remote` và đọc file trên nhánh `main` | Repo truy cập được; source ban đầu dùng Next.js |
| Unit test | `npm test` | PASS — 11 tests |
| Build | `npm run build` | PASS — TypeScript backend và production bundle Vite |
| Lint | `npm run lint` | PASS — backend và frontend |
| SQL Server integration | Kiểm tra dịch vụ local và `sqlcmd` | NOT_RUN — môi trường hiện tại không có SQL Server/`sqlcmd`; cần kiểm tra trên máy có database |
| Dependency audit | `npm audit --omit=dev` | Không còn High sau khi nâng Zod; còn 4 Moderate cảnh báo UUID gián tiếp qua Sequelize/Tedious, cần theo dõi bản vá tương thích |

## Lý do sử dụng các nhóm prompt

Các prompt trong nhật ký là bản tóm lược trung thực theo yêu cầu và công việc đã thực hiện, không phải nguyên văn. Lý do chính của từng prompt:

| Mục | Lý do cần prompt |
| --- | --- |
| 1. Đọc bối cảnh dự án | Tránh nhầm ứng dụng tuyển dụng hiện tại với vision quản lý lao động hoặc tài liệu tham khảo. |
| 2. Đọc rubric | Chốt deliverables và tiêu chí chấm trước khi triển khai, tránh làm thiếu sản phẩm phải nộp. |
| 3. Lưu yêu cầu | Giúp giữ tiêu chí chấm và bộ công nghệ nhất quán khi chuyển máy hoặc tiếp tục ở phiên khác. |
| 4. Chọn phạm vi MVP | Giới hạn phạm vi vào các nghiệp vụ có quan hệ dữ liệu, phù hợp thời gian và rubric. |
| 5. Khảo sát repository | Xác định công nghệ và trạng thái thật trước khi thay đổi, tránh ghi đè code có sẵn. |
| 6. Chốt cách chuyển bộ công nghệ | Có quyết định rõ ràng trước một thay đổi kiến trúc lớn để khớp yêu cầu giảng viên. |
| 7. Thiết kế schema | Bảo đảm các nghiệp vụ có khóa ngoại/ràng buộc và dữ liệu quan hệ thay vì lưu rời rạc. |
| 8. Xây dựng auth | Đáp ứng yêu cầu JWT/Admin/User, đồng thời tránh người dùng tự cấp role Admin. |
| 9. Xây chức năng tạo, đọc, sửa, xóa (CRUD) và ứng tuyển | Hoàn thiện vòng nghiệp vụ chính thay vì chỉ dựng giao diện trình diễn. |
| 10. Tìm kiếm và phân trang | Đáp ứng yêu cầu truy vấn server-side, đồng thời hạn chế tải dữ liệu không giới hạn. |
| 11. Bảo vệ API và tài liệu | Thêm validation, giới hạn request và Swagger để API dễ kiểm tra/vấn đáp hơn. |
| 12. Giao diện demo | Cung cấp giao diện gọi backend thật để có thể trình diễn luồng end-to-end. |
| 13. Kiểm thử và hướng dẫn | Phân biệt phần đã kiểm chứng với phần còn cần database/manual test, tránh báo cáo PASS không có căn cứ. |

Không sử dụng hoặc nộp prompt log của dự án khác làm lịch sử AI của Worker Management. Thư mục mẫu tham khảo không thuộc source/deliverables của dự án này.

## Cập nhật kiểm thử trước khi chuẩn bị nộp — 24/10/2026

- Unit tests: 19/19 đạt; build backend/frontend và lint đạt.
- Tám ca kiểm thử tích hợp với SQL Server local đã đạt: đăng ký và lưu hash, validation, giới hạn password bcrypt, email trùng, đăng nhập User, `/auth/me`, role User và rate limit.
- Đăng nhập Admin/dashboard chưa được xác nhận: mật khẩu trong database không khớp cấu hình; tùy chọn reset không chạy do mật khẩu cấu hình ngắn hơn mức seed tối thiểu 12 ký tự. Không sửa database Admin và không đưa mật khẩu vào nhật ký.
- Chưa khẳng định đã kiểm thử toàn bộ giao diện/chức năng tạo, đọc, sửa, xóa (CRUD). Video demo cần quay các luồng đã xác minh, không giả lập kết quả.
