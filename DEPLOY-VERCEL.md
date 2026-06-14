# Plan deploy web-wedding lên Vercel

> Mục tiêu: đưa web lên Vercel chạy ổn định — cả trang thiệp (modern/classic),
> RSVP + lời chúc, và admin dashboard.

## 0. Trạng thái (đã thực hiện ✅)

Repo **đã sẵn sàng deploy** — phần code + DB đã làm xong:

- ✅ `api/[...path].ts` — bọc Express thành serverless function.
- ✅ `vercel.json` — buildCommand + outputDirectory + cleanUrls.
- ✅ `server/db/pool.ts` — tự bật SSL khi gặp Neon/`sslmode=require`, pool nhỏ trên serverless.
- ✅ `server/index.ts` — body-parser có điều kiện (chạy đúng cả local lẫn Vercel).
- ✅ `@vercel/node` + `engines.node=22.x` + `pnpm-lock.yaml` (Vercel cài ổn định).
- ✅ **Migration đã chạy trên Neon** — bảng `wishes`, `rsvps`, `schema_migrations` + seed.
- ✅ Verify local: typecheck client/server sạch, API POST/GET hoạt động.

**Việc còn lại (cần tài khoản của bạn):** push GitHub → import vào Vercel → set env vars (mục 5) → Deploy. Xem mục 6.

## 1. Vấn đề kiến trúc cần giải quyết

Hiện tại app gồm **3 phần** chạy bằng Docker:

| Phần | Local (Docker) | Trên Vercel |
|---|---|---|
| Frontend | Vite + `vite-react-ssg` → `dist/spa` | ✅ Host tĩnh (Vercel làm tốt) |
| API | Express thường trú (:8000) | ⚠️ Phải đổi sang **Serverless Functions** (`/api`) |
| Database | Postgres trong container | ⚠️ Vercel **không có DB thường trú** → dùng **Managed Postgres** (Neon) |

→ Cần 3 thay đổi: (A) bọc Express thành serverless function, (B) dùng Neon Postgres + bật SSL, (C) thêm `vercel.json`.

## 2. Chuẩn bị dịch vụ ngoài

1. **Tài khoản Vercel** (free) + cài Vercel CLI: `npm i -g vercel` (hoặc deploy qua GitHub).
2. **Neon Postgres** (free, serverless — https://neon.tech):
   - Tạo project → lấy **connection string dạng pooled** (host có hậu tố `-pooler`), ví dụ:
     `postgresql://<user>:<password>@ep-xxxx.<region>.aws.neon.tech/<db>?sslmode=require`
   - ⚠️ Connection string thật (kèm mật khẩu) để trong file `.env` (đã gitignore) và Vercel env — KHÔNG ghi vào tài liệu commit lên git.
   - Dùng bản *pooled* để tránh cạn connection khi nhiều function chạy song song.

## 3. Chạy migration cho Neon (một lần) — ✅ ĐÃ CHẠY

Đã apply `0001_init` + `0002_seed` lên Neon (bảng `wishes`, `rsvps`, `schema_migrations` + seed).

Khi **thêm file `db/migrations/*.sql` mới**, chạy lại (idempotent):
```bash
docker compose exec -T -e DATABASE_URL="postgresql://neondb_owner:...@ep-blue-darkness-aoocsdzr.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" web pnpm migrate
```

## 4. Biến môi trường trên Vercel

Vercel → Project → Settings → Environment Variables (scope: Production + Preview):

| Key | Value |
|---|---|
| `DATABASE_URL` | connection string **pooled** của Neon (kèm `?sslmode=require`) |
| `ADMIN_USER` | `toibingu` (nên đổi mạnh hơn khi public) |
| `ADMIN_PASS` | `toibingu` (nên đổi) |

`VITE_API_BASE` không cần set (mặc định `/api/v1`).

## 5. Deploy

**Cách 1 — qua GitHub (khuyến nghị):**
1. `git init` + push repo lên GitHub.
2. Vercel → New Project → import repo → nó tự đọc `vercel.json`.
3. Set env vars (mục 5) → Deploy. Mỗi push sau tự deploy.

**Cách 2 — Vercel CLI:**
```bash
vercel            # preview
vercel --prod     # production
```

## 6. Kiểm thử sau deploy (checklist "hoạt động tốt")

- [ ] `/` mở thiệp (phong bì + bàn tay), nhạc Canon in D chạy sau khi chạm.
- [ ] `/classic` hiển thị bản classic, navbar điều hướng.
- [ ] Ảnh Unsplash + QR hiển thị.
- [ ] Gửi **RSVP** + **lời chúc** → `GET /api/v1/health` trả `{ok:true}`; lời chúc mới hiện ra (ghi vào Neon).
- [ ] `/admin` đăng nhập `toibingu/toibingu` → thấy danh sách; sai mật khẩu → chặn.
- [ ] `?guest=Tên+Khách` cá nhân hoá tên.
- [ ] Mobile: layout 380–480px ổn.

## 7. Rủi ro & lưu ý

- **Cold start**: function đầu tiên chậm ~1s — chấp nhận được cho thiệp cưới.
- **Connection pooling**: bắt buộc dùng Neon *pooled* string + `max` nhỏ, tránh lỗi "too many connections".
- **Nhạc/ảnh hotlink**: Unsplash + Wikimedia cho phép hotlink; nếu muốn chắc chắn 100% có thể tải về `public/` và trỏ đường dẫn nội bộ (sẽ được Vercel CDN phục vụ).
- **Bảo mật admin**: token hiện là base64 tài khoản (kiểu Basic Auth). Public thật nên đổi mật khẩu mạnh qua env + cân nhắc token ngẫu nhiên.
- **Docker không dùng trên Vercel**: `docker-compose*.yml` chỉ phục vụ dev local; Vercel bỏ qua chúng.

## 8. Ước lượng công

| Việc | Thời gian |
|---|---|
| Thêm `api/[...path].ts` + `vercel.json` + sửa pool SSL | ~20 phút |
| Tạo Neon + chạy migration | ~10 phút |
| Import Vercel + set env + deploy | ~10 phút |
| Kiểm thử checklist | ~15 phút |

→ Tổng ~1 giờ. Có thể thực hiện ngay khi bạn duyệt plan.

## 9. Check logs

→ Vercel → Deployment → Functions → Logs