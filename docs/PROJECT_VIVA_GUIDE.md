# Project Viva Guide

## 1. Kiến trúc tổng thể
- Frontend: Next.js App Router + React + TypeScript
- State: Zustand
- UI: custom component library inside src/components/ui
- Auth: JWT + HTTP-only cookie
- Data: JSON file layer on the server for demo/grade-friendly persistence
- File upload: server-side storage under src/data/uploads

## 2. Luồng hoạt động chính
### Login flow
1. User enters email/password.
2. /api/auth/login validates the credentials.
3. Server signs JWT with user claims.
4. JWT is stored in an HTTP-only cookie.
5. Frontend calls /api/auth/me to restore session.

### Worker flow
1. /workers page loads data from /api/workers.
2. Users can search/filter workers.
3. Admin/manager can add new workers through a modal and POST request.
4. Data is persisted on the server.

### Upload flow
1. Browser submits FormData to /api/uploads.
2. API validates session.
3. File is saved into server storage folder.
4. Metadata is saved to JSON.
5. Frontend uses metadata/reference to show or fetch the file.

## 3. Giải thích công nghệ
### Next.js
- Good for App Router, route-based structure, and API routes.
- Easy to demo and explain in viva.

### Zustand
- Simple global state for auth and selected UI state.
- Avoids heavy state management setup while still meeting rubric needs.

### JWT
- Gives the project a realistic auth structure.
- Role information can be encoded in the token and checked at the frontend or backend boundary.

### Custom component library
- Components are built inside the project so the app is not dependent only on external UI libraries.
- This is directly useful for rubric evaluation.

## 4. Component library chi tiết
- Button: variant, size, loading, fullWidth
- Card: title/subtitle/action layout
- Input: label, hint, validation support
- Badge: colored status tag
- Avatar: user image or initials
- Modal: accessible dialog for forms
- Table: simple generic table for rows and columns

## 5. Zustand và state management
- currentUser: active user
- token: JWT token in app state
- selectedView: active sidebar route
- filterStatus: current worker filter status

Why: it keeps the project simple while still offering a real global state architecture.

## 6. JWT + authorization
- Admin and manager roles can see add-worker actions.
- RoleGate protects UI elements.
- This demonstrates authorization in a simple but clear way.

## 7. API and data flow
- /api/auth/login
- /api/auth/logout
- /api/auth/me
- /api/workers
- /api/uploads
- /api/uploads/[storageKey]

This structure is clean enough to explain in viva and is also easy to replace with a real database later.

## 8. Database and storage strategy
- Current implementation uses JSON persistence in src/data.
- File upload uses server filesystem under src/data/uploads.
- Metadata is stored in JSON to act as a structured reference layer.

Why this is acceptable:
- It satisfies the requirement of not storing in browser storage.
- It keeps the project fast and simple.
- It is easy to migrate to SQL Server / Supabase / S3 later.

## 9. Câu hỏi giảng viên thường gặp
### 1. Tại sao không dùng localStorage cho avatar?
Because browser storage is not persistent in the intended architecture and does not satisfy the requirement for server-side uploaded files. We save uploaded files on the server and keep metadata for retrieval.

### 2. Tại sao lại dùng JWT?
It provides a realistic authentication flow, is easy to explain, and allows role claims to be embedded in the token.

### 3. Tại sao lại dùng Zustand thay vì Redux?
Zustand is lighter, faster to set up, and adequate for the rubric and project size.

### 4. Tại sao không dùng full backend database ngay từ đầu?
To keep this project within a realistic deadline while preserving a correct architecture. The current data layer is lightweight but easy to upgrade later.

### 5. File upload được lưu ở đâu?
On the server filesystem under the app’s data directory, not in browser storage.

### 6. Có thể thay bằng cloud storage không?
Yes. The design already separates file content from metadata, so a later migration to Supabase Storage or S3 would be straightforward.

## 10. Câu trả lời ngắn gọn dễ nhớ
- Custom library: built in-house, not copied from a third-party UI kit.
- Auth: JWT via cookie.
- Roles: admin/manager/staff.
- State: Zustand.
- Files: saved to server, not browser storage.
- Worker data: API-backed JSON layer.
- Architecture: easy to evolve to real database and cloud storage.

## 11. Final briefing
The project demonstrates a practical and explainable workforce management app: strong frontend architecture, auth flow, role checks, worker management, and persistent server-side file handling. It is simple enough to explain in viva and structured enough to satisfy rubric expectations.
