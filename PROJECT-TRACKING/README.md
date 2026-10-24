# Theo dõi tiến độ và điểm quan trọng

Đây là sổ tay trạng thái/lịch sử, **không phải** tài liệu hướng dẫn code hay bằng chứng rằng mọi chức năng đã được kiểm thử. Đọc theo mục tiêu:

## Muốn biết chức năng và code nằm ở đâu

- [`SYSTEM-FUNCTION-MAP.md`](./SYSTEM-FUNCTION-MAP.md): bảng tra cứu màn hình, endpoint, controller/service, quyền và dữ liệu.
- [`feature-impact.md`](./feature-impact.md): các luồng nghiệp vụ và những điểm cần test khi sửa từng nhóm chức năng.
- Giải thích kiến trúc cho người mới: [`../SKILL/Codebase-Explanation.md`](../SKILL/Codebase-Explanation.md).

## Muốn biết trạng thái dự án

- [`ROADMAP.md`](./ROADMAP.md): phân biệt MVP tuyển dụng, dashboard tuyển dụng và vision quản lý lao động dài hạn.
- [`SIX-STEP-CHECKLIST.md`](./SIX-STEP-CHECKLIST.md): đối chiếu tiến độ với tài liệu 6 bước của giảng viên.
- [`system-impact.md`](./system-impact.md): quyết định và rủi ro ảnh hưởng nhiều phần hệ thống.

## Muốn xem lịch sử

- [`PROMPT-AND-RESPONSE-LOG.md`](./PROMPT-AND-RESPONSE-LOG.md): các yêu cầu/quyết định và kết quả đã ghi nhận; không phải toàn bộ chat nguyên văn.
- `../CHANGE-HISTORY/major-changes.md` và `../CHANGE-HISTORY/minor-changes.md`: những thay đổi code/tài liệu theo từng đợt.
- Lịch sử là thông tin theo thời điểm; để biết trạng thái mới nhất, đối chiếu code, Git và lệnh test.

## Quy tắc cập nhật

Khi sửa code, chỉ cập nhật các trang bị ảnh hưởng và ghi rõ ngày giờ, máy/môi trường, commit/branch, kiểm tra thực sự đã chạy và phần còn chưa kiểm chứng. Không ghi secret hoặc dữ liệu người dùng thật.
