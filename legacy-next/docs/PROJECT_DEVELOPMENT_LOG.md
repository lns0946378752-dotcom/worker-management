# PROJECT DEVELOPMENT LOG

## Tổng quan

Project hiện có là một ứng dụng Next.js + TypeScript theo mô hình App Router, tập trung vào hệ thống quản lý người lao động. Ở trạng thái hiện tại, project đã triển khai phần nền tảng chính của mô hình rubric: custom component library riêng, Zustand state management, JWT-auth flow, role-based access, worker management APIs và server-side file upload storage.

## Giai đoạn 1: Nền tảng UI + custom component library

### Đã làm
- Replaced default starter page with worker dashboard UI.
- Built reusable components: Button, Card, Input, Badge, Avatar, Modal, Table.
- Added Zustand store for auth and view state.

### File chính
- src/app/page.tsx
- src/app/globals.css
- src/components/ui/Button.tsx
- src/components/ui/Card.tsx
- src/components/ui/Input.tsx
- src/components/ui/Badge.tsx
- src/components/ui/Avatar.tsx
- src/components/ui/Modal.tsx
- src/components/ui/Table.tsx
- src/components/ui/index.ts
- src/store/useAppStore.ts

### Vì sao làm
- Mong muốn project phải có custom component library riêng, dễ demo và phù hợp rubric.
- UI cần có mặt bằng rõ ràng cho dashboard, quản lý worker và auth flow.

## Giai đoạn 2: Authentication + JWT

### Đã làm
- Installed jsonwebtoken and @types/jsonwebtoken.
- Added JWT signing/verification utility.
- Added demo users and a mock server data layer.
- Added login/logout/me APIs.
- Added RequireAuth guard and login page.

### File chính
- src/lib/auth.ts
- src/lib/mockUsers.ts
- src/lib/types.ts
- src/lib/session.ts
- src/lib/server-store.ts
- src/data/users.json
- src/app/api/auth/login/route.ts
- src/app/api/auth/logout/route.ts
- src/app/api/auth/me/route.ts
- src/components/auth/RequireAuth.tsx
- src/app/login/page.tsx

### Vì sao làm
- Rubric yêu cầu auth/JWT và route protection.
- Cookie-based JWT storage is a simple but valid flow for demo purposes.

### Cách hoạt động
- User login -> API validates credentials -> token signed with user claims -> cookie wm_token set.
- Next page loads session via /api/auth/me -> RequireAuth decides whether to allow access.

## Giai đoạn 3: Worker management + authorization

### Đã làm
- Added server-side workers JSON persistence.
- Added API for list and create worker.
- Added page /workers with search and status display.
- Added RoleGate preventing unauthorized actions.

### File chính
- src/app/api/workers/route.ts
- src/app/workers/page.tsx
- src/components/auth/RoleGate.tsx

### Vì sao làm
- Worker management là mục tiêu trọng tâm của project.
- Authorization và role-based action là phần bắt buộc để dễ giảng viên hỏi.

## Giai đoạn 4: Persistent file upload storage

### Đã làm
- Added upload API route and storage helper.
- Files are saved to server filesystem under src/data/uploads.
- Metadata is saved in JSON for later fetch and reference.
- Added download endpoint /api/uploads/[storageKey].

### File chính
- src/lib/storage.ts
- src/app/api/uploads/route.ts
- src/app/api/uploads/[storageKey]/route.ts

### Vì sao làm
- Requirement bắt buộc không lưu file trong localStorage/sessionStorage/IndexedDB của browser.
- Cách này phù hợp deadline nhưng vẫn hướng tới storage cloud sau này.

### Lưu ý kiến trúc
- Browser -> Next.js API -> server storage -> metadata reference -> frontend render.
- Không lưu file trên client-only storage.

## Package/dependency đã cài
- zustand
- jsonwebtoken
- @types/jsonwebtoken

## Cấu hình đã thay đổi
- Không cần thay đổi config lớn; chỉ bổ sung logic app-level và file storage.

## Zustand state management
- currentUser
- token
- selectedView
- filterStatus

## Authentication / JWT / authorization
- JWT được ký ở src/lib/auth.ts
- Cookie wm_token được set khi login
- /api/auth/me validate token
- /workers page và add-worker action được bảo vệ bằng RoleGate

## API và data flow
- /api/auth/login
- /api/auth/logout
- /api/auth/me
- /api/workers
- /api/uploads
- /api/uploads/[storageKey]

## Database / persistence
- Hiện tại dùng JSON file trên server như layer lưu dữ liệu nhẹ.
- Dễ thay bằng SQL Server / Supabase / cloud storage trong tương lai.

## Lỗi gặp phải và cách xử lý
- npm path issue -> fixed using full path to npm.cmd.
- upload route naming issue -> corrected to [storageKey]/route.ts.
- TypeScript error due to null token state -> fixed by changing store signatures and login(null, null).

## Cách chạy
1. npm install
2. npm run dev
3. Login using demo credentials:
   - admin@worker-management.vn / admin123
   - manager@worker-management.vn / manager123
   - staff@worker-management.vn / staff123

## Cách test
- Build: checked via npm run build
- Lint: checked via npm run lint
- Auth flow: login + session validation
- Worker management: search + add worker
- Storage: upload + metadata + fetch file route

## Kiến thức cần nhớ để vấn đáp
- Project is designed around server-side persistence and JWT auth.
- Custom UI library is intentionally independent from external UI dependency.
- Role gating is implemented at UI and API flow level.
- File upload uses server filesystem, not browser storage.
- Current implementation is lightweight but architecture-ready for real database/storage migration.

## Trạng thái hiện tại
Project đang ở trạng thái implement core required features for rubric and demo. Các phần chính đã được hoàn thành và build/lint đã được kiểm tra với kết quả thành công trong giai đoạn mới nhất.
