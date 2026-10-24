# Yêu cầu đồ án cuối khóa

> Bản sao để yêu cầu và rubric đi cùng mã nguồn khi mở repository trên máy khác. Nếu giảng viên cập nhật, cập nhật tài liệu này theo yêu cầu mới nhất.

## 1. Đề tài và công nghệ

**Tên đề tài:** Xây dựng hệ thống Back-end cho ứng dụng Web **Worker Management** tích hợp AI.

| Thành phần | Yêu cầu |
| --- | --- |
| Back-end | Node.js, Express.js |
| Database | SQL Server (MSSQL), Sequelize ORM |
| Front-end demo | Vite + Axios; giao diện cơ bản để gọi API |
| Công cụ AI | Cursor, ChatGPT hoặc GitHub Copilot |

## 2. Chức năng bắt buộc

- Quản lý người dùng: đăng ký, đăng nhập JWT và phân quyền Admin/User.
- Có ít nhất hai chức năng nghiệp vụ theo quan hệ 1-n hoặc n-n.
- Tìm kiếm, lọc và phân trang.
- Bảo mật: hash mật khẩu, middleware kiểm tra quyền và validation đầu vào.
- Tự động tạo tài liệu API bằng Swagger UI.

## 3. Sản phẩm phải nộp

- Mã nguồn đẩy lên GitHub, tổ chức theo kiến trúc Layered.
- File `.sql` tạo bảng và dữ liệu mẫu.
- Nhật ký PDF/Markdown có ít nhất 10 prompt quan trọng, kèm giải thích lý do dùng prompt.
- Video demo 3–5 phút: giới thiệu chức năng và giải thích một đoạn code khó do AI viết. Mỗi thành viên phải hiểu phần code phụ trách.

## 4. Tiêu chí chấm điểm

Mỗi tiêu chí chiếm 20%:

| Tiêu chí | Mức xuất sắc (9–10) | Mức đạt (5–7) | Mức kém (0–4) |
| --- | --- | --- | --- |
| Kiến trúc Database | Chuẩn 3NF, khóa ngoại, index tối ưu, kiểu dữ liệu SQL Server chính xác. | Có sơ đồ và chạy được nhưng dư thừa dữ liệu hoặc thiếu ràng buộc. | Thiết kế sơ sài, thiếu khóa ngoại, nhiều dữ liệu rác. |
| Chất lượng API và kiến trúc code | Controller-Service-Model rõ ràng; code AI sạch; sinh viên review và tối ưu. | Chạy đúng chức năng, chia lớp cơ bản nhưng còn copy-paste/code thừa. | Dồn trong một file, lộn xộn hoặc có code không chạy. |
| Bảo mật và Testing | JWT, phân quyền sâu, validation chặt; ít nhất 5 unit test logic quan trọng. | Có đăng nhập/đăng xuất nhưng validation hoặc unit test còn thiếu. | Không có bảo mật, mật khẩu dạng text thuần, không test lỗi. |
| Prompting và Nhật ký AI | Nhật ký prompt theo Context-Task-Constraint; thể hiện điều hướng AI xử lý logic khó. | Có nhật ký nhưng prompt đơn giản, chưa thể hiện tư duy điều phối. | Không có nhật ký hoặc chỉ copy tiêu đề bài tập. |
| Vấn đáp và Code Review | Giải thích code AI viết, chỉ ra điểm yếu và cách khắc phục. | Hiểu luồng cơ bản nhưng lúng túng với logic AI viết. | Không hiểu hoặc không giải thích được code đã nộp. |

## 5. Phạm vi MVP đã chọn

- Đăng ký/đăng nhập JWT, role Admin/User.
- Quản lý công ty và vị trí tuyển dụng.
- Nhận và xử lý hồ sơ ứng tuyển.
- Tìm kiếm, lọc, sắp xếp và phân trang phía server.
- Swagger UI, validation, SQL script và unit test.

Các quan hệ nghiệp vụ: `Company 1-n Vacancy` và `Vacancy 1-n Application`.

## 6. Tài liệu đi kèm project

- [README chạy ứng dụng](../README.md)
- [Nhật ký Prompt AI](./PROMPT-LOG.md)
- [Hướng dẫn demo và vấn đáp](./PROJECT_VIVA_GUIDE.md)
- Bài giảng/bài tập backend gốc nằm trong thư mục `BE_Nhật` ở workspace ban đầu; thư mục đó không thuộc repository này.

## 7. Lưu ý về stack

Một ghi chú kiến trúc trước đây đề xuất NestJS, TypeORM, stored procedure, Clean Architecture và Tailwind CSS. Yêu cầu bài cuối khóa hiện tại ghi Node.js/Express, SQL Server/Sequelize, Vite/Axios và Layered; project này theo yêu cầu cuối khóa trong ảnh của giảng viên.
