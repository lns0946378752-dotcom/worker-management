# Đặc tả Backend --- Hệ thống quản lý người lao động, công ty và tuyển dụng

> Tài liệu bàn giao cho Antigravity để triển khai phần Backend.\
> Nguồn yêu cầu: nội dung người dùng đã cung cấp trong cuộc trò chuyện
> và file ghi chú.\
> Nguyên tắc: không tạo dữ liệu giả; không tự quyết định các nghiệp vụ
> chưa được xác nhận. Nếu còn thiếu thông tin, đánh dấu
> `TODO / CẦN XÁC NHẬN`.

## 1. Mục tiêu và phạm vi

Xây dựng backend phục vụ hệ thống tuyển dụng và quản lý lao động của
trung tâm. Ba phân hệ liên quan chặt chẽ trong phạm vi tài liệu này:

1.  **Hồ sơ người lao động**: lưu thông tin gốc của từng người, liên hệ,
    tài khoản ngân hàng, bảo hiểm và sale phụ trách.
2.  **Công ty và thông tin tuyển dụng**: quản lý thông tin công ty, bộ
    phận tuyển, nhu cầu tuyển và điều kiện làm việc.
3.  **Bảng công và trạng thái làm việc**: nhập/ghi nhận bảng công theo
    công ty, bộ phận và kỳ công; hỗ trợ cập nhật trạng thái làm việc và
    lưu lịch sử.

Website và Excel cần có thể phối hợp. Backend nên là nguồn dữ liệu
chính; Excel được nhập/xuất qua quy trình có kiểm tra, tránh chỉnh sửa
hai nguồn độc lập mà không đồng bộ.

## 2. Nguyên tắc bắt buộc

-   Không tạo dữ liệu mẫu, dữ liệu demo hoặc bản ghi giả.
-   Không tự điền dữ liệu còn thiếu bằng suy đoán.
-   Mỗi người lao động có một hồ sơ gốc và một ID nội bộ ổn định.
-   Không dùng số CCCD hoặc số điện thoại làm khóa chính.
-   Thông tin hồ sơ cá nhân không được sao chép lặp lại vào bảng công
    hoặc lịch sử làm việc; các bảng nghiệp vụ liên kết bằng ID.
-   Giữ lịch sử làm việc cũ khi người lao động chuyển công ty; không xóa
    hồ sơ cá nhân.
-   Theo quy tắc hiện tại, một người lao động chỉ được xuất hiện trong
    danh sách **đang làm** của một công ty tại cùng một thời điểm.
-   Không tự kết luận người lao động đã nghỉ chỉ vì không xuất hiện
    trong bảng công mới.
-   Không cộng trùng bảng công khi công ty gửi bản sửa đổi.
-   Quyền truy cập phải được kiểm tra ở backend, không chỉ ẩn nút trên
    giao diện.
-   Dữ liệu CCCD, ngân hàng và thông tin cá nhân cần được bảo vệ và giới
    hạn theo quyền.
-   Các nghiệp vụ chưa chốt phải được ghi rõ là chưa chốt, không tự
    triển khai theo giả định.

## 3. Phân hệ A --- Hồ sơ người lao động

### 3.1. Các trường thông tin đã xác định

  -----------------------------------------------------------------------
  Trường                              Yêu cầu
  ----------------------------------- -----------------------------------
  `worker_id`                         ID nội bộ ổn định của hồ sơ người
                                      lao động

  `full_name`                         Họ và tên lấy theo CCCD

  `identity_number`                   Số CCCD hiện tại

  `date_of_birth`                     Ngày sinh lấy theo CCCD

  `gender`                            Giới tính lấy theo CCCD

  `identity_address`                  Địa chỉ theo CCCD; hiện không cần
                                      lưu địa chỉ cư trú hiện tại riêng

  `phone`                             Số điện thoại liên hệ

  `zalo`                              Thông tin Zalo dùng để liên hệ
                                      tuyển dụng

  `bank_name`                         Tên ngân hàng

  `bank_account_number`               Số tài khoản

  `bank_account_holder`               Chủ tài khoản

  `bank_account_status`               Tình trạng tài khoản, cần phân biệt
                                      tài khoản chính chủ và tài khoản
                                      mượn của người khác

  `insurance_status`                  Lựa chọn đóng hoặc không đóng bảo
                                      hiểm theo nghiệp vụ trung tâm

  `sale_owner_id` hoặc trường liên    Sale phụ trách/nguồn giới thiệu;
  kết tương đương                     nếu là nguồn của trung tâm thì có
                                      lựa chọn TT

  `created_at`                        Thời điểm tạo hồ sơ

  `created_by`                        Người tạo hồ sơ

  `updated_at`                        Thời điểm cập nhật gần nhất

  `updated_by`                        Người cập nhật gần nhất
  -----------------------------------------------------------------------

Tên kỹ thuật có thể điều chỉnh theo quy ước của dự án, nhưng không được
làm mất ý nghĩa nghiệp vụ.

### 3.2. CCCD cấp lại hoặc thay đổi

-   Cho phép cập nhật số CCCD và thông tin định danh sau khi xác minh
    đúng người.
-   Giữ nguyên `worker_id` và toàn bộ liên kết đến bảng công, công ty,
    sale và lịch sử làm việc.
-   Nên có lịch sử thay đổi thông tin định danh: thông tin trước/sau,
    thời điểm, người cập nhật và lý do.
-   Không tự ghép hai hồ sơ chỉ dựa vào tên hoặc ngày sinh.
-   Chưa có xác nhận về khả năng kết nối trực tiếp dữ liệu của cơ quan
    nhà nước. Không giả định backend có API tra cứu CCCD của cơ quan
    công an.

### 3.3. Thông tin chưa triển khai ở giai đoạn đầu

-   Quản lý hợp đồng lao động: để ngoài phạm vi vì boss quản lý.
-   Quản lý bảng lương và thanh toán lương: để ngoài phạm vi.
-   Hồ sơ xin việc: chưa cần.
-   Danh sách giấy tờ bổ sung và trạng thái hoàn thiện thông tin: người
    dùng muốn để sau vì khó kiểm soát lúc đầu. Hiện chỉ ghi nhận giấy tờ
    cam kết nếu quy trình thực tế yêu cầu; chưa thiết kế luồng quản lý
    tài liệu mở rộng.
-   Địa chỉ hiện tại riêng: chưa cần; chỉ lấy địa chỉ từ CCCD theo yêu
    cầu hiện tại.

## 4. Phân hệ B --- Công ty và thông tin tuyển dụng

Hai phần nằm chung trong khu vực/menu "Công ty" trên giao diện, nhưng dữ
liệu công ty và dữ liệu tuyển dụng phải tách riêng ở backend.

### 4.1. Thông tin công ty

  -----------------------------------------------------------------------
  Trường                              Yêu cầu
  ----------------------------------- -----------------------------------
  `company_id`                        ID nội bộ công ty

  `company_name`                      Tên công ty

  `company_address`                   Địa chỉ công ty

  `area_or_industrial_zone`           Khu vực/khu công nghiệp để lọc và
                                      gợi ý việc làm trên trang công khai

  `contact_name`                      Nhân sự/người liên hệ của công ty

  `contact_phone`                     Số điện thoại người liên hệ
  -----------------------------------------------------------------------

Mã công ty nội bộ và trạng thái hợp tác chưa cần triển khai ở giai đoạn
hiện tại. Không tách địa chỉ văn phòng chính và địa chỉ nơi làm việc
riêng ở giai đoạn này theo yêu cầu hiện tại.

### 4.2. Thông tin tuyển dụng theo công ty và bộ phận

Mỗi công ty có thể có nhiều bộ phận tuyển dụng. Thông tin tuyển dụng cần
có các trường:

-   Công ty liên quan.
-   Bộ phận.
-   Giới tính theo yêu cầu tuyển dụng.
-   Ca làm/giờ làm việc.
-   Thông tin tăng ca.
-   Lương.
-   Lương tăng ca.
-   Phụ cấp.
-   Thời gian nghỉ giải lao.
-   Thời gian nghỉ trưa.
-   Thông tin cơm/nước: tự túc hay công ty cung cấp.
-   Số lượng cần tuyển hiện tại.
-   Trạng thái tuyển dụng.

Không tự tạo giá trị cho các trường trên. Giá trị phải được nhập từ
thông tin do người phụ trách cung cấp.

### 4.3. Lịch sử nhu cầu tuyển dụng

Nhu cầu tuyển có thể thay đổi hàng ngày, tăng, giảm, tạm ngưng hoặc mở
lại. Vì vậy:

-   Không chỉ ghi đè số lượng cũ.
-   Mỗi lần cập nhật cần lưu công ty, bộ phận, số lượng mới, trạng thái,
    thời điểm cập nhật, người cập nhật và ghi chú nếu có.
-   Giá trị hiện tại được xác định từ lần cập nhật mới nhất phù hợp.
-   Lịch sử cũ phải có thể tra cứu.
-   Không đồng nhất số lượng cần tuyển với số đã nhận việc hoặc số còn
    thiếu.
-   Trạng thái "tạm ngưng" không được tự suy ra chỉ vì số lượng bằng 0;
    cần theo thông tin được xác nhận.

## 5. Phân hệ C --- Bảng công và trạng thái làm việc

### 5.1. Quy trình nghiệp vụ

1.  Nhân sự công ty gửi bảng công của các bộ phận.
2.  Người phụ trách/quản lý dự án tổng hợp bảng công và gửi về văn
    phòng.
3.  Người được phép cập nhật nhập bảng công vào hệ thống và đối chiếu
    tên người lao động với hồ sơ tại công ty tương ứng.
4.  Backend ghi nhận kỳ công, công ty, bộ phận và dữ liệu công của từng
    người.
5.  Dữ liệu công hỗ trợ việc cập nhật trạng thái làm việc, nhưng không
    tự kết luận nghỉ việc chỉ vì thiếu tên trong bảng công.
6.  Khi có thông tin mới về nghỉ việc, người có quyền có thể cập nhật
    ngoài lịch định kỳ.
7.  Lịch sử thay đổi cần được lưu.

### 5.2. Thông tin cấp bảng công

Mỗi đợt nhận/import bảng công cần lưu:

-   Công ty.
-   Bộ phận.
-   Khoảng thời gian tính công (từ ngày/đến ngày).
-   Ngày nhận bảng công từ công ty.
-   Người phụ trách tổng hợp/nhập.
-   Ngày cập nhật lên hệ thống.
-   Tệp bảng công gốc.
-   Trạng thái xử lý: mới nhận, đang kiểm tra, đã cập nhật, cần sửa.
-   Lịch sử chỉnh sửa và lý do điều chỉnh.

### 5.3. Dữ liệu công từng người

Mỗi dòng công phải liên kết tới: - Hồ sơ người lao động (`worker_id`). -
Công ty. - Bộ phận. - Kỳ công hoặc đợt bảng công. - Số công/thông tin
công theo dữ liệu công ty gửi. - Thông tin cần thiết để phân biệt công
hành chính và công tăng ca nếu bảng công nguồn có dữ liệu đó.

Không tự định nghĩa công thức tính công, quy tắc ca làm, cách làm tròn
giờ hoặc công thức lương khi chưa được cung cấp. Lương và tính lương
không thuộc phạm vi hiện tại.

### 5.4. Quy tắc cập nhật trạng thái làm việc

-   Có tên/công trong bảng công mới: ghi nhận công theo kỳ tương ứng.
-   Không có tên trong bảng công mới: đánh dấu cần kiểm tra; không tự
    chuyển sang "đã nghỉ".
-   Có thông tin báo nghỉ: tạo yêu cầu/ghi nhận báo nghỉ để người có
    quyền xử lý.
-   Khi nghỉ việc được xác minh: lưu ngày nghỉ thực tế, ngày cập nhật,
    người báo, người xác minh/chốt và bằng chứng hoặc ghi chú.
-   Bảng công gửi bổ sung hoặc sửa đổi phải được xử lý để tránh cộng
    trùng; giữ lịch sử phiên bản/chỉnh sửa.
-   Phân biệt ngày sự việc xảy ra với ngày thông tin được báo và ngày
    cập nhật hệ thống.

### 5.5. Các loại nghỉ cần phân biệt

Theo yêu cầu hiện tại, cần phân biệt: - Nghỉ phép có báo trước. - Nghỉ
phép không báo trước. - Nghỉ việc có báo trước. - Bị công ty cho nghỉ. -
Nghỉ ngang không báo trước. - Chưa xác định/đang xác minh.

Nghỉ phép không đồng nghĩa với nghỉ việc. Không kết thúc đợt làm việc
chỉ vì người lao động nghỉ phép.

### 5.6. Chuyển công ty

-   Một người lao động chỉ được nằm trong danh sách đang làm của một
    công ty tại cùng một thời điểm theo quy tắc hiện tại.
-   Khi chuyển công ty, kết thúc đợt làm việc cũ và tạo đợt làm việc
    mới.
-   Giữ nguyên hồ sơ người lao động.
-   Không xóa lịch sử công và công ty cũ.
-   Backend cần kiểm tra ràng buộc để ngăn tạo hai đợt làm việc đang
    hoạt động chồng lấn, trừ khi sau này người dùng thay đổi quy tắc
    này.

### 5.7. Quyền thao tác bảng công

Quy tắc đã xác định: - Admin được quản lý bảng công. - Người phụ trách
quản lý/quản lý dự án được phân công được thao tác trong phạm vi phụ
trách. - Sale không được sửa bảng công; có thể gửi thông tin báo nghỉ. -
Nhân viên văn phòng không mặc định được sửa bảng công. - Kế toán không
được sửa bảng công theo yêu cầu người dùng. - Người lao động không được
truy cập bảng công nội bộ.

Cần thực thi quyền ở backend/API, không chỉ ở giao diện. Quyền sửa bảng
công sau khi đã chốt và quy trình duyệt bản sửa cần được xác nhận trước
khi triển khai chi tiết.

## 6. Liên kết dữ liệu và ràng buộc

Mối quan hệ logic tối thiểu:

-   Một hồ sơ người lao động có thể có nhiều đợt làm việc theo thời
    gian.
-   Một công ty có nhiều bộ phận/thông tin tuyển dụng.
-   Một công ty có nhiều đợt bảng công.
-   Một đợt bảng công có nhiều dòng công.
-   Dòng công liên kết người lao động, công ty, bộ phận và kỳ công.
-   Lịch sử làm việc liên kết hồ sơ người lao động với công ty và thời
    gian làm.
-   Sale phụ trách được liên kết với hồ sơ người lao động để hỗ trợ tra
    cứu/thống kê.

Ràng buộc: - ID nội bộ ổn định; không dùng CCCD làm khóa chính. - Kiểm
tra trùng hồ sơ và CCCD theo quy tắc xác minh. - Không cho phép một
người có hai đợt làm việc đang hoạt động chồng lấn theo quy tắc hiện
tại. - Không xóa lịch sử cũ khi cập nhật thông tin mới. - Không cộng
trùng bảng công khi nhập lại. - Mọi thay đổi trạng thái làm việc cần ghi
người thao tác và thời điểm.

## 7. Vai trò và quyền liên quan

Các vai trò được đề cập trong yêu cầu tổng thể: - Người lao động/public
visitor. - Sale. - Nhân viên văn phòng. - Quản lý dự án/người phụ
trách. - Admin. - Kế toán (không được sửa bảng công).

Người dùng đăng nhập bằng Google; người đăng ký yêu cầu quyền truy cập
và admin duyệt. Người quản lý dự án chỉ được quản lý công ty đã được
admin xác nhận/phân công. Admin có trang quản lý tài khoản, vai trò và
quyền trên website.

Chi tiết phân quyền ngoài bảng công chưa được chốt hoàn toàn. Không tự
cấp thêm quyền ngoài những gì được xác nhận.

## 8. API/Backend cần hỗ trợ

Đây là nhóm chức năng cần có, không phải yêu cầu dùng một framework cụ
thể:

-   Tạo, xem, cập nhật hồ sơ người lao động.
-   Tìm kiếm/đối chiếu hồ sơ và xử lý thay đổi CCCD có xác minh.
-   Quản lý công ty và thông tin liên hệ.
-   Quản lý thông tin tuyển dụng theo bộ phận.
-   Lưu lịch sử thay đổi nhu cầu tuyển.
-   Nhận/import bảng công, lưu tệp gốc, kiểm tra dữ liệu và báo lỗi dòng
    không đối chiếu được.
-   Ghi nhận công theo kỳ, công ty, bộ phận và người lao động.
-   Gửi/duyệt/cập nhật yêu cầu báo nghỉ theo quyền.
-   Lưu lịch sử làm việc và trạng thái.
-   Phân quyền backend theo vai trò và phạm vi công ty.
-   Nhập/xuất Excel có kiểm tra dữ liệu và phân quyền.
-   Lưu nhật ký thao tác quan trọng.

## 9. Các điểm chưa được quyết định --- không tự giả định

-   Công thức tính công, quy đổi công và cách xử lý các loại ca.
-   Có cho quản lý dự án sửa bảng công sau khi chốt hay không; quy trình
    duyệt bản sửa.
-   Tiêu chuẩn/bằng chứng bắt buộc cho từng loại nghỉ việc.
-   Quy tắc chính xác để chuyển một yêu cầu báo nghỉ thành trạng thái
    "đã nghỉ".
-   Cấu trúc chi tiết bảng dữ liệu và framework backend.
-   Các quyền chi tiết ngoài quyền bảng công.
-   Cơ chế kết nối nguồn dữ liệu CCCD của cơ quan nhà nước (chưa có xác
    nhận tích hợp).
-   Quy tắc chi tiết cho các trường dữ liệu bổ sung đang để sau.

Khi gặp các điểm này, hãy đánh dấu `TODO / CẦN XÁC NHẬN`, không tạo dữ
liệu mẫu và không tự suy diễn nghiệp vụ.

## 10. Yêu cầu khi triển khai

1.  Đọc đặc tả này trước khi viết code.
2.  Không tạo seed/demo/mock data.
3.  Không tự thêm nghiệp vụ chưa được chốt.
4.  Tạo validation cho các ràng buộc dữ liệu quan trọng.
5.  Bảo vệ dữ liệu cá nhân và kiểm tra quyền ở backend.
6.  Khi không đủ thông tin, ghi lại câu hỏi cần xác nhận thay vì đoán.
7.  Sau khi triển khai, cung cấp danh sách model/bảng, endpoint, quyền
    truy cập và các điểm còn TODO để người dùng duyệt.
