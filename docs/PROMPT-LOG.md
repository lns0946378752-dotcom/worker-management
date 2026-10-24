# Nhật ký Prompt AI — Worker Management

> Nhật ký tóm lược các yêu cầu và chỉ dẫn thực tế đã dùng trong cuộc hội thoại để phân tích và xây dựng repo. Các mục dưới đây được diễn đạt lại theo cấu trúc Context–Task–Constraint; không phải bản ghi nguyên văn mọi tin nhắn. Khi tiếp tục dùng AI, bổ sung prompt thực tế, câu trả lời đã áp dụng và kết quả kiểm chứng.

## 1. Đọc bối cảnh dự án

**Context:** Workspace có ghi chú ý tưởng, tài liệu môn học và bài tập.

**Task:** Đọc tài liệu để nắm hệ thống trước khi hỗ trợ làm project.

**Constraint:** Phân biệt ghi chú dự án với tài liệu học; nêu rõ phần nào không trích xuất được.

**Kết quả áp dụng:** Xác định ý tưởng quản lý lao động/tuyển dụng và các stack đã được ghi ở tài liệu.

## 2. Đọc yêu cầu cuối khóa từ ảnh

**Context:** Giảng viên gửi ảnh yêu cầu bài và rubric chấm điểm.

**Task:** Trích xuất stack, chức năng bắt buộc, sản phẩm phải nộp và tiêu chí chấm.

**Constraint:** Lấy yêu cầu trong ảnh làm nguồn chính, không nhầm stack trong tài liệu tham khảo với stack đồ án.

**Kết quả áp dụng:** Ghi nhận Node.js/Express, SQL Server/Sequelize, Vite/Axios, JWT, hai chức năng nghiệp vụ trở lên, tìm kiếm/lọc/phân trang, Swagger, SQL script, prompt log và video demo.

## 3. Lưu yêu cầu thành Markdown

**Context:** Yêu cầu và rubric đang được chia sẻ dưới dạng ảnh.

**Task:** Tạo file Markdown để tra cứu khi làm bài ở máy khác.

**Constraint:** Lưu cả rubric, deliverables, checklist và khác biệt stack với ghi chú cũ.

**Kết quả áp dụng:** Tạo file yêu cầu đồ án trong workspace tài liệu.

## 4. Chọn phạm vi MVP

**Context:** Đề tài là hệ thống quản lý lao động và tuyển dụng.

**Task:** Chọn một lát cắt đủ nhỏ nhưng đáp ứng ít nhất hai chức năng nghiệp vụ.

**Constraint:** Ưu tiên quan hệ công ty–vị trí tuyển dụng và vị trí–hồ sơ ứng tuyển; để chấm công, lương, bán áo và báo cáo nâng cao ngoài MVP.

**Kết quả áp dụng:** Mô hình Company 1-n Vacancy và Vacancy 1-n Application.

## 5. Khảo sát repo GitHub

**Context:** Repo được cung cấp tại `lns0946378752-dotcom/worker-management`.

**Task:** Kiểm tra nhánh chính, manifest, source, data layer và docs trước khi thay đổi.

**Constraint:** Bảo toàn source hiện có; không giả định công nghệ trong ghi chú cũ đang trùng với repo.

**Kết quả áp dụng:** Phát hiện repo hiện dùng Next.js, JSON/Supabase, không khớp stack bài cuối khóa.

## 6. Chốt cách chuyển stack

**Context:** Repo hiện tại là Next.js nhưng rubric yêu cầu Express, SQL Server/Sequelize và Vite/Axios.

**Task:** Chọn hướng xử lý trước khi sửa kiến trúc lớn.

**Constraint:** Tuân thủ rubric và không âm thầm giữ frontend/database lệch yêu cầu.

**Kết quả áp dụng:** Người dùng chọn chuyển sang Express + Sequelize + SQL Server và Vite + Axios.

## 7. Thiết kế schema quan hệ

**Context:** Cần có ít nhất hai nghiệp vụ liên kết và rubric đánh giá 3NF, khóa ngoại, index, kiểu dữ liệu.

**Task:** Thiết kế Users, Companies, Vacancies và Applications.

**Constraint:** Dùng UUID, FK, unique constraint, check constraint và dữ liệu mẫu giả.

**Kết quả áp dụng:** Tạo script SQL Server có bảng, quan hệ, index và seed records.

## 8. Xây dựng xác thực và phân quyền

**Context:** Rubric yêu cầu đăng ký, đăng nhập JWT, hash mật khẩu và quyền Admin/User.

**Task:** Xây API register/login/me, role middleware và seed Admin.

**Constraint:** Mọi tài khoản tự đăng ký mặc định User; không cho client tự gửi role Admin; dùng bcrypt và secret từ `.env`.

**Kết quả áp dụng:** Thêm auth service, bearer JWT middleware, role guard và lệnh tạo admin riêng.

## 9. Xây chức năng CRUD và ứng tuyển

**Context:** MVP quản lý công ty, vị trí tuyển và hồ sơ ứng tuyển.

**Task:** Tạo routes/controllers/services cho CRUD công ty/vị trí, gửi đơn và admin xử lý trạng thái.

**Constraint:** Kiểm tra công ty tồn tại, chỉ tuyển vị trí đang mở, kiểm tra giới tính/tuổi và chống nộp trùng cùng vị trí bằng số điện thoại.

**Kết quả áp dụng:** Thêm các lớp xử lý và API tương ứng, không dùng dữ liệu giả làm fallback.

## 10. Tìm kiếm, lọc và phân trang

**Context:** Danh sách tuyển dụng/công ty/hồ sơ cần truy vấn dữ liệu lớn đúng cách.

**Task:** Thực hiện search, district, department, status, sort và pagination phía server.

**Constraint:** Parameterized ORM query; giới hạn page size; chỉ cho sort trên danh sách trường cho phép.

**Kết quả áp dụng:** Sequelize `findAndCountAll`, tiện ích pagination và response metadata.

## 11. Bảo vệ API và tài liệu

**Context:** Rubric yêu cầu validation, middleware kiểm tra quyền và Swagger UI.

**Task:** Thêm Zod validation, JWT authorization, rate limit, Helmet, CORS giới hạn origin và Swagger.

**Constraint:** Không trả hash mật khẩu; không trả stack trace nội bộ cho client; báo lỗi rõ ràng.

**Kết quả áp dụng:** Thêm các middleware và trang `/api-docs`.

## 12. Giao diện demo bằng Vite/Axios

**Context:** Rubric yêu cầu giao diện cơ bản gọi API, dùng Vite và Axios.

**Task:** Xây giao diện tiếng Việt để duyệt tuyển dụng, tìm/lọc, xem công ty, đăng ký/đăng nhập, ứng tuyển và xem hồ sơ cho Admin.

**Constraint:** Gọi backend thật; không dùng mock data thay cho SQL Server.

**Kết quả áp dụng:** Tạo app React + Vite; backend phải kết nối SQL Server để cung cấp dữ liệu.

## 13. Kiểm thử, build và hướng dẫn demo

**Context:** Cần có bằng chứng chất lượng và chuẩn bị cho vấn đáp.

**Task:** Viết unit test cho validation/pagination; chạy build/test và ghi kết quả thực tế.

**Constraint:** Chỉ báo PASS cho checks đã chạy; integration test cần SQL Server thật.

**Kết quả áp dụng:** Bổ sung test hẹp và cập nhật kết quả sau mỗi lượt validation.

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
| 3. Lưu yêu cầu | Giúp giữ rubric/stack nhất quán khi chuyển máy hoặc tiếp tục ở phiên khác. |
| 4. Chọn phạm vi MVP | Giới hạn phạm vi vào các nghiệp vụ có quan hệ dữ liệu, phù hợp thời gian và rubric. |
| 5. Khảo sát repository | Xác định công nghệ và trạng thái thật trước khi thay đổi, tránh ghi đè code có sẵn. |
| 6. Chốt cách chuyển stack | Có quyết định rõ ràng trước một thay đổi kiến trúc lớn để khớp yêu cầu giảng viên. |
| 7. Thiết kế schema | Bảo đảm các nghiệp vụ có khóa ngoại/ràng buộc và dữ liệu quan hệ thay vì lưu rời rạc. |
| 8. Xây dựng auth | Đáp ứng yêu cầu JWT/Admin/User, đồng thời tránh người dùng tự cấp role Admin. |
| 9. Xây CRUD và ứng tuyển | Hoàn thiện vòng nghiệp vụ chính thay vì chỉ dựng giao diện trình diễn. |
| 10. Tìm kiếm và phân trang | Đáp ứng yêu cầu truy vấn server-side, đồng thời hạn chế tải dữ liệu không giới hạn. |
| 11. Bảo vệ API và tài liệu | Thêm validation, giới hạn request và Swagger để API dễ kiểm tra/vấn đáp hơn. |
| 12. Giao diện demo | Cung cấp giao diện gọi backend thật để có thể trình diễn luồng end-to-end. |
| 13. Kiểm thử và hướng dẫn | Phân biệt phần đã kiểm chứng với phần còn cần database/manual test, tránh báo cáo PASS không có căn cứ. |

Không sử dụng hoặc nộp prompt log của dự án khác làm lịch sử AI của Worker Management. Thư mục mẫu tham khảo không thuộc source/deliverables của dự án này.

## Cập nhật kiểm thử trước khi chuẩn bị nộp — 24/10/2026

- Unit tests: 19/19 đạt; build backend/frontend và lint đạt.
- Tám ca kiểm thử tích hợp với SQL Server local đã đạt: đăng ký và lưu hash, validation, giới hạn password bcrypt, email trùng, đăng nhập User, `/auth/me`, role User và rate limit.
- Đăng nhập Admin/dashboard chưa được xác nhận: mật khẩu trong database không khớp cấu hình; tùy chọn reset không chạy do mật khẩu cấu hình ngắn hơn mức seed tối thiểu 12 ký tự. Không sửa database Admin và không đưa mật khẩu vào nhật ký.
- Chưa khẳng định đã kiểm thử toàn bộ giao diện/CRUD. Video demo cần quay các luồng đã xác minh, không giả lập kết quả.
