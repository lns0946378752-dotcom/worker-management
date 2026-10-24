# Prompt bàn giao cho AI tiếp theo

Sao chép toàn bộ prompt trong khung bên dưới vào AI tiếp theo. Làm việc trực tiếp trên workspace/repository hiện tại, không chỉ trả lời lý thuyết.

---

Bạn đang tiếp tục đồ án trong repository:

- Thư mục: `D:\project\worker-management`
- GitHub: `https://github.com/lns0946378752-dotcom/worker-management`
- Nhánh chính: `main`
- Commit đã push gần nhất: `a3f6754` (`test: verify auth flows and prepare submission docs`)
- Ứng dụng đang làm: MVP tuyển dụng Worker Management, không phải hệ thống quản lý Studio trong thư mục mẫu.
- Người dùng là người mới, cần hướng dẫn ngắn, từng bước, bằng **tiếng Việt có dấu**. Khi có thao tác trên trang web/cloud, nói rõ bấm ở đâu và dừng để người dùng xác nhận khi cần.

## Quy tắc làm việc bắt buộc

1. Trước tiên kiểm tra `git status`, branch, commit mới nhất và đọc README, rubric, tracking/auth flow liên quan. Bảo toàn thay đổi người dùng chưa commit; không reset, checkout đè, hoặc xóa file không thuộc phạm vi.
2. Cập nhật các tài liệu liên quan sau mỗi đợt thực hiện: `CHANGE-HISTORY/major-changes.md` hoặc `minor-changes.md`, `PROJECT-TRACKING/PROMPT-AND-RESPONSE-LOG.md`, `PROJECT-TRACKING/feature-impact.md`, `PROJECT-TRACKING/system-impact.md`, `PROJECT-TRACKING/SYSTEM-FUNCTION-MAP.md` và hướng dẫn tương ứng trong `SKILL/`. Ghi đúng ngày giờ, máy/môi trường, lệnh chạy, kết quả, giới hạn; **không ghi prompt cũ là nguyên văn nếu chỉ là tóm tắt**.
3. Tuyệt đối không đọc/in/commit/chia sẻ `.env`, mật khẩu, hash, token, connection string hoặc thông tin đăng nhập. Không yêu cầu người dùng gửi secret trong chat/screenshot. Nếu phải kiểm tra credential, chỉ báo đúng/sai hoặc đã cấu hình hay chưa.
4. Không sử dụng/copypaste code, báo cáo, SQL, tên hoặc dữ liệu từ `Mẫu từ người khác/`; đó là đồ án quản lý Studio riêng. Không chỉnh sửa các ảnh đính kèm read-only.
5. Người dùng yêu cầu **không tự tạo dữ liệu nghiệp vụ mẫu giả**. Không tự thêm company/vacancy/applicant/user records vào SQL hay database. Dữ liệu demo do chính người dùng nhập. AI được hướng dẫn và hỗ trợ họ nhập dữ liệu, không tự bịa dữ liệu. Nếu SQL hiện tại có seed records, giải thích rõ và hỏi trước khi xóa/thay đổi; không xóa dữ liệu đang dùng khi chưa sao lưu và được xác nhận.
6. Thay đổi schema hồ sơ phải giữ tương thích SQL Server rubric, tạo hướng dẫn cập nhật DB an toàn/không phá hủy dữ liệu; không tự chuyển database hay chạy migration phá hủy.
7. Không tuyên bố đã test/deploy thành công khi chưa thực sự làm và kiểm tra. Không commit hoặc push trước khi tests qua và người dùng được thông báo; nếu repo đã thay đổi sau commit `a3f6754`, chỉ push các thay đổi phù hợp sau khi kiểm tra, loại trừ toàn bộ thư mục mẫu và tài liệu tham khảo.
8. Chia công việc thành các phần nhỏ, trước mắt ưu tiên đăng nhập Admin để người dùng vào được, luồng đăng ký/đăng nhập, giao diện điện thoại; sau đó deploy. Không sa đà sửa những chức năng không liên quan trước khi demo chạy được.

## Bối cảnh đã kiểm tra — phân biệt rõ với lỗi người dùng báo

- Stack: React/Vite frontend; Express/TypeScript backend; Sequelize; local SQL Server; JWT/bcrypt/Zod. API health và UI local đã từng chạy.
- Có quan hệ `Company 1-n Vacancy`, `Vacancy 1-n Application`; chức năng app hiện tại gồm auth, duyệt việc, company, vacancy, application, admin dashboard.
- Trong lượt gần nhất, `npm test` đạt **19/19**; `npm run build` đạt; `npm run lint` đạt.
- Đã chạy 8 ca integration tests với SQL Server local và tất cả đạt: đăng ký User lưu trong DB + bcrypt hash; validation; password bcrypt quá 72 byte; email trùng/case-insensitive; đăng nhập User đúng/sai/email không tồn tại; `/auth/me` token hợp lệ/thiếu/sai; User bị cấm gọi API Admin; rate limit và thông báo tiếng Việt.
- Điều đó **không** chứng minh đăng nhập Admin hoạt động: integration test/Admin UI chưa hoàn tất. DB có account role Admin, nhưng password hash không khớp password cấu hình local. Script reset đã từ chối vì password hiện cấu hình ngắn hơn chính sách tối thiểu 12 ký tự. Không lộ giá trị password. Cần hướng dẫn chủ máy tự đặt password riêng đủ mạnh trong `.env` local (không gửi cho AI), rồi chạy script reset an toàn; xác minh API `/auth/login` + `/api/dashboard` và UI `/admin`.
- UI đăng ký/đăng nhập chưa được xác minh end-to-end qua browser. Người dùng báo “đăng ký rồi nhưng không đăng nhập/dữ liệu đăng nhập chưa lưu”; cần tái hiện bằng browser/API, ghi rõ phân biệt dữ liệu tài khoản đã persist vào DB với JWT frontend hiện chỉ giữ trong memory (refresh trang thì đăng xuất), rồi sửa đúng nguyên nhân.
- Có dữ liệu mẫu cũ trong local DB/SQL script. Không xóa/chèn thêm cho tới khi người dùng xác nhận; hiện người dùng muốn tự thêm dữ liệu.
- Commit `a3f6754` đã push. Các tệp `NOP-BAI/` được tạo sau đó có thể chưa nằm trong GitHub. Người dùng chuẩn bị nộp Drive và cần các hướng dẫn được cập nhật.

## Yêu cầu UI dựa trên ảnh người dùng gửi

Người dùng gọi chúng là image 4, 5, 6; kiểm tra ảnh đính kèm thực tế trong cuộc hội thoại:

1. **Giữ trang `/admin` của image 4:** trang đăng nhập riêng Admin với card/logo/heading/form email-password/nút đăng nhập/link quay về trang tuyển dụng. Được phép chỉnh responsive/validate nhưng giữ nguyên ý tưởng và bố cục nhận diện.
2. **Image 5 (trang tuyển dụng ở màn hình hẹp):** bỏ link/menu “Đăng nhập Admin” trên trang công khai. Admin chỉ dùng URL `/admin`; không có link public tới đó.
3. **Image 6 (sidebar desktop tràn ngang trên điện thoại):** tạo menu mobile đóng/mở (hamburger/nút menu có `aria-expanded`, overlay/drawer accessible). Tự đóng sau khi chọn trang; không để body/page tràn ngang. Test tối thiểu viewport 320px, 375px, tablet và desktop.
4. **Đăng ký không còn là form nhỏ nhét trong header:** tạo trang/form đăng ký riêng, có thông tin cơ bản theo yêu cầu: số điện thoại, họ tên, năm sinh, giới tính; cùng email và mật khẩu để tài khoản đăng nhập được. Có thể làm trang đăng nhập riêng/điều hướng rõ ràng để giao diện mobile dùng được. Giữ tiếng Việt có dấu, validation/error toast tiếng Việt.
5. Trước khi thay schema/model, kiểm tra form ứng tuyển và vai trò của `users`; số điện thoại/năm sinh/giới tính cho profile User cần thiết kế hợp lý, không tái sử dụng applicant PII sai mục đích. Cập nhật SQL Server schema an toàn. Không đưa role Admin vào form công khai.
6. Nếu người dùng muốn “chỉ một mình tôi biết được vào Admin”, giải thích ngắn: giấu link là UX chứ không phải bảo mật; bảo mật thật là tài khoản admin riêng, mật khẩu mạnh, server-side role enforcement, rate limit. Không dựa vào URL bí mật hoặc chỉ ẩn nút. Vẫn giữ đường dẫn `/admin` như họ yêu cầu.

## Các việc phải thực hiện theo thứ tự

### A. Kiểm tra lỗi auth/Admin trước

- Kiểm tra an toàn trạng thái `.env` mà không hiển thị giá trị; hỏi người dùng tự đặt password Admin mới (>=12 ký tự và không quá 72 byte UTF-8), giữ bí mật ở máy họ.
- Đảm bảo lệnh `npm run seed:admin -- --reset-password` truyền tham số đúng; script chỉ cập nhật password hash khi email tồn tại và role đã là `admin`, không nâng role User. Không tự đổi hoặc in password.
- Chạy test auth Admin integration bằng local SQL Server; xác minh đăng nhập Admin sai/đúng và quyền dashboard. Nếu không thể vì môi trường, nói chính xác vì sao và hướng dẫn người dùng bước cần làm.
- Browser test: `/admin` Admin thành công; User bị chặn và token không bị giữ; sai password hiện toast tiếng Việt; refresh/session behavior được giải thích.

### B. Sửa đăng ký và responsive

- Reproduce vấn đề đăng ký và đăng nhập qua browser/API, kiểm tra Network response và DB mà không log dữ liệu nhạy cảm.
- Tạo route/trang đăng ký riêng với họ tên, email, password, phone, năm sinh, giới tính theo nghiệp vụ được chấp nhận. User mới luôn role `user`.
- Kiểm tra DB persist đầy đủ; API login dùng đúng email/password, trim/lowercase email nhất quán. Nêu rõ JWT memory-only có nghĩa refresh đăng xuất, không phải record tài khoản bị mất.
- Bỏ link Admin khỏi navigation trang công khai theo ảnh 5, vẫn giữ trang `/admin`.
- Làm sidebar/nav mobile đóng mở accessible, kiểm tra không tràn ngang và tất cả tác vụ user/admin vẫn truy cập được theo role.
- Cập nhật form validation, schema, model, SQL script/upgrade instruction, API docs và tests. Không đổi/xóa dữ liệu hiện có tùy tiện.

### C. Chỉ dữ liệu do chủ dự án nhập

- Tìm các seed/sample inserts đang có trong `database/worker_management.sql`/online schema. Không tự phát minh bộ data mới.
- Hỏi trước khi loại bỏ dữ liệu sample cũ nếu việc đó ảnh hưởng báo cáo/DB local.
- Thêm hướng dẫn rõ để người dùng tự tạo công ty/vị trí/hồ sơ bằng giao diện Admin/public, và chỉ đưa dữ liệu do người dùng cung cấp vào demo.

### D. Hướng dẫn deploy thật, bước một

Người dùng muốn được hướng dẫn deploy Vercel và backend/database; backend + database có thể chạy trên máy ở nhà nếu đó là phương án khả thi.

- Giải thích kiến trúc hiện có: Vercel chỉ host frontend; Express cần Node host; local SQL Server không tự public cho cloud host.
- Trình bày trade-off: nếu API chạy ở máy nhà và máy/tuyến mạng tắt thì app ngừng; **không mở public port SQL Server 1433**. Ưu tiên API host + managed PostgreSQL cho demo nếu phù hợp rubric; nếu giữ SQL Server tại nhà, chỉ đề xuất API chạy cùng máy và public API qua HTTPS tunnel/VPN/private network có kiểm soát, tuyệt đối không expose SQL port. Nêu chi phí/free-tier, uptime và khác biệt DBMS theo rubric.
- Hướng dẫn từng bước trên giao diện Vercel/API host/DB theo cấu hình user đã chọn; không tạo tài khoản thay họ, không mua gói, không yêu cầu gửi secret. Dừng hỏi user chọn phương án trước khi đụng migration/chuyển DB.
- Kiểm tra SPA rewrite `/admin`, `VITE_API_URL`, API CORS, health endpoint, DB connection và smoke-test sau deploy. Không tuyên bố deploy xong trước khi có URL hoạt động.

### E. Cập nhật tài liệu và gói nộp

- Cập nhật README, `NOP-BAI/BAO-CAO-DO-AN.md`, `NOP-BAI/README-TAI-LEN-DRIVE.md`, `NOP-BAI/KICH-BAN-VIDEO.md`, prompt log và tracking/history cho tất cả chức năng/test/deploy vừa làm.
- Không đưa `.env`, credential, token, SQL Server `.mdf/.ldf`, tài liệu/SQL/prompt-log của `Mẫu từ người khác/` vào ZIP/Drive.
- Source archive phải được tạo lại sau code changes và kiểm tra danh sách entry không chứa secret, `node_modules`, `.git`, tài liệu người khác hoặc build output.
- Video demo vẫn do người dùng tự quay; không bịa video hoặc ghi nội dung chưa chạy vào báo cáo.

## Tiêu chí hoàn thành

- Có test tự động/DB integration cho auth và trường profile mới; `npm test`, `npm run test:integration`, `npm run build`, `npm run lint` chạy được. Nêu rõ test nào cần user credential cục bộ.
- Browser xác minh các viewport và từng luồng signup, user login, Admin `/admin`, role rejection, menu mở/đóng và Vietnamese toast.
- Có chỉ dẫn deploy từng bước theo lựa chọn người dùng; URL deployment chỉ báo thành công sau smoke test.
- Tài liệu/handover phản ánh đúng trạng thái. Bảo toàn dữ liệu người dùng và sample folder.

---

## Việc người dùng có thể cần tự làm

- Đặt password Admin mới an toàn trong `.env` local; không gửi password/`.env` cho AI.
- Nếu muốn dùng dữ liệu do mình nhập, cung cấp qua giao diện app; không paste dữ liệu thật nhạy cảm vào chat.
- Tự đăng nhập/đồng ý các điều khoản tài khoản hosting và chọn phương án DB/hosting trước khi tạo cloud resource.
- Tự quay video demo, tải lên Drive và gửi link Drive trên LMS.
