# Hướng dẫn Git và GitHub cho Worker Management

Tài liệu thực hành Git từ các lệnh cơ bản đến cách xử lý nhánh và xung đột. Các lệnh bên dưới chạy trong PowerShell/terminal VS Code.

## Git và GitHub khác nhau thế nào?

- **Git** lưu lịch sử phiên bản của project trên máy.
- **GitHub** lưu bản repo trực tuyến và giúp đồng bộ giữa nhiều máy.
- **Commit** là một mốc lưu trên máy; **push** gửi commit lên GitHub; **pull** tải commit trên GitHub về máy.
- `node_modules` không nên đưa lên GitHub; mỗi máy cài lại dependencies bằng `npm install`.
- File `.env` có thể chứa mật khẩu/secret; không commit hoặc gửi lên GitHub. Chỉ commit `.env.example` không chứa bí mật.

## Chu trình hằng ngày

Mở terminal VS Code tại thư mục repo `worker-management` (thư mục có `package.json` và `.git`):

```powershell
git status
git pull --ff-only origin main
# Sửa code, chạy test/build khi phù hợp
git status
git add .
git status
git commit -m "feat: mo ta thay doi"
git push origin main
```

Thói quen an toàn:

1. `git pull --ff-only origin main` trước khi bắt đầu làm để lấy thay đổi mới.
2. Sau khi sửa, dùng `git status` xem đúng file nào sẽ được lưu.
3. Stage, kiểm tra lại `git status`, rồi mới commit.
4. Push để máy còn lại có thể pull.
5. Trước khi tắt máy/đổi máy, push các commit muốn đồng bộ.

Nếu `git pull --ff-only` từ chối vì có thay đổi chưa commit, **đừng ép pull**. Xem phần “Máy đang có thay đổi chưa lưu”.

## Các lệnh cần nhớ

### Kiểm tra trạng thái và lịch sử

```powershell
git status                    # trạng thái file/nhánh
git status -sb                # trạng thái gọn
git diff                      # thay đổi chưa stage
git diff --cached             # thay đổi đã stage, chuẩn bị commit
git log --oneline --graph --decorate -10
git remote -v                 # URL GitHub
git branch -vv                # nhánh hiện tại và upstream
```

### Stage và commit

```powershell
git add README.md              # stage một file
git add backend                # stage một thư mục
git add .                      # stage mọi thay đổi trong repo hiện tại
git restore --staged README.md # bỏ stage, không xóa nội dung file
git commit -m "docs: cap nhat huong dan"
git show --stat --oneline HEAD
```

Quy ước tiền tố commit gợi ý:

- `feat:` thêm chức năng
- `fix:` sửa lỗi
- `docs:` cập nhật tài liệu
- `test:` thêm/sửa kiểm thử
- `refactor:` tái cấu trúc mà không đổi hành vi
- `chore:` cấu hình/công việc bảo trì

### Đồng bộ với GitHub

```powershell
git fetch origin               # tải thông tin remote, chưa sửa file
git pull --ff-only origin main # lấy và áp dụng cập nhật an toàn
git push origin main           # đẩy commit main lên GitHub
```

### Nhánh riêng cho một tính năng

```powershell
git switch main
git pull --ff-only origin main
git switch -c feat/ten-tinh-nang
# sửa code, rồi:
git add .
git commit -m "feat: mo ta tinh nang"
git push -u origin feat/ten-tinh-nang
```

Sau đó có thể tạo Pull Request trên GitHub để nhập nhánh vào `main`. Khi đã nhập xong:

```powershell
git switch main
git pull --ff-only origin main
git branch -d feat/ten-tinh-nang
```

## Thiết lập lần đầu trên PC mới

### Trường hợp PC mới chưa có repo

Chọn nơi muốn đặt project rồi clone:

```powershell
Set-Location D:\
git clone https://github.com/lns0946378752-dotcom/worker-management.git
Set-Location D:\worker-management
npm install
```

Sau đó tạo `.env` từ `.env.example`, điền cấu hình SQL Server của PC đó, rồi chạy theo `README.md`. Không dùng chung secret hoặc mật khẩu giữa máy nếu không cần.

### Trường hợp đã có thư mục project và đó là clone của repo này

Trong thư mục chứa `.git`, trước hết kiểm tra:

```powershell
git status -sb
git remote -v
```

Nếu đang ở `main`, remote `origin` trỏ đúng repo này và không có thay đổi cục bộ cần giữ:

```powershell
git pull --ff-only origin main
npm install
```

Nếu có thay đổi cục bộ, commit hoặc sao lưu chúng trước khi pull. Nếu thư mục đó không có `.git` hoặc trỏ tới repo khác, đừng chạy `git pull` tùy tiện; đổi tên thư mục cũ để làm bản sao lưu, rồi clone repo mới vào một thư mục riêng.

## Máy đang có thay đổi chưa lưu

### Giữ thay đổi bằng commit

```powershell
git status
git add .
git diff --cached
git commit -m "feat: mo ta thay doi"
git pull --ff-only origin main
git push origin main
```

Nếu pull báo lịch sử không thể fast-forward, dừng lại và kiểm tra `git status`/`git log`; không dùng `--force`.

### Tạm cất thay đổi chưa hoàn thành bằng stash

```powershell
git stash push -m "cong viec dang lam"
git pull --ff-only origin main
git stash pop
git status
```

Nếu `stash pop` tạo xung đột, xử lý từng file theo phần dưới. Stash chỉ ở máy hiện tại; không thay thế việc commit/push để chuyển công việc sang máy khác.

## Xử lý xung đột

Xung đột xảy ra khi hai thay đổi cùng sửa phần giống nhau. Git thêm các dấu phân cách `<<<<<<< HEAD`, `=======` và `>>>>>>> tên-nhánh` quanh hai phiên bản nội dung trong file.

1. Mở file được báo xung đột và quyết định nội dung đúng; thường cần kết hợp hai bên.
2. Xóa các dòng đánh dấu `<<<<<<<`, `=======`, `>>>>>>>`.
3. Kiểm tra lại nội dung, chạy test/build nếu có.
4. Đánh dấu đã giải quyết và commit:

```powershell
git add duong-dan-file
git status
git commit -m "fix: resolve merge conflict"
git push origin main
```

Nếu đang rebase và muốn hủy thao tác:

```powershell
git rebase --abort
```

Nếu đang merge và muốn hủy thao tác:

```powershell
git merge --abort
```

## Quay lại thay đổi: đọc kỹ trước khi chạy

Các lệnh sau có thể làm mất công việc. Kiểm tra `git status` và sao lưu nội dung quan trọng trước.

```powershell
git restore -- file.ts          # bỏ sửa chưa stage của file; mất phần sửa đó
git restore --staged file.ts    # chỉ bỏ stage, giữ phần sửa trong file
git revert <commit-id>          # tạo commit mới đảo ngược một commit đã chia sẻ
```

Tránh dùng `git reset --hard`, `git clean -fd` và `git push --force` nếu không hiểu rõ hậu quả; chúng có thể xóa thay đổi hoặc ghi đè lịch sử đã chia sẻ.

## Giải đáp nhanh

- **Source Control hiện nhiều dòng R / A / M là gì?** `R` là Git nhận ra file được đổi chỗ/đổi tên, `A` là file mới, `M` là file sửa. Khi chuyển Next.js vào `legacy-next/`, nhiều file cũ hiện `R`; đây thường là thay đổi mong đợi, nhưng hãy kiểm tra `git status` và diff trước khi commit.
- **Staged là gì?** Các file đã chọn cho commit tiếp theo. Chưa có commit cho tới khi chạy `git commit`.
- **Tại sao `node_modules` xuất hiện?** Phải được ignore trong `.gitignore`. Repo này bỏ qua `node_modules` ở mọi workspace con; sau khi cập nhật, kiểm tra `git status` không liệt kê dependencies.
- **Push bị từ chối (rejected)?** Thường remote có commit mới. Chạy `git fetch origin`, xem `git status -sb`, rồi `git pull --ff-only origin main`. Nếu không fast-forward được, dừng để kiểm tra lịch sử và xung đột.
- **Git hỏi đăng nhập?** Dùng VS Code/Git Credential Manager hoặc đăng nhập GitHub theo hướng dẫn chính thức; không dán token vào code, chat, URL remote hay file `.env`.
- **Trước khi commit?** Xác nhận đúng repo/nhánh, xem `git status` và `git diff --cached`, đảm bảo không có `.env`, password, token, dữ liệu cá nhân hay `node_modules`.
