# web-wedding

Thiệp cưới online (clone iWedding / MeHappy) — dùng đúng stack của `gladia-clone-react`:
**Vite + React 18 + TypeScript + `vite-react-ssg`**, Tailwind + shadcn-style UI, Framer Motion,
React Hook Form + Zod, TanStack React Query, Zustand, Express mock server.

Phân tích UI/UX 2 site gốc + quyết định kiến trúc: xem [`PHAN-TICH.md`](./PHAN-TICH.md).

## Quick start

```bash
pnpm install
pnpm dev:all      # client (:8081) + mock API (:8000) cùng lúc — KHUYẾN NGHỊ

# hoặc 2 terminal:
pnpm dev          # client :8081
pnpm dev:server   # mock API :8000 (bắt buộc cho /api/* — RSVP, lời chúc)
```

> Quên `dev:server` → gọi `/api/*` trả 502 kèm message nhắc chạy server.

**2 bản clone** (cùng dữ liệu, khác layout — nút nổi góc dưới-trái để chuyển qua lại):
- **Modern** (kiểu MeHappy / Site B, mobile-first, mở thiệp + hiệu ứng): `http://localhost:8081/`
- **Classic** (kiểu iWedding / Site A, website đa-section + navbar): `http://localhost:8081/classic`

Cá nhân hoá tên khách: `http://localhost:8081/?guest=Anh+Minh`.

**Admin dashboard** (xem danh sách RSVP + thống kê): `http://localhost:8081/admin` (Docker: `http://localhost:8090/admin`). Cần đăng nhập — mặc định **`toibingu` / `toibingu`** (đổi qua env `ADMIN_USER` / `ADMIN_PASS`). API `GET /rsvp` yêu cầu Bearer token; trang đặt `noindex`.

> Khi chạy bằng Docker, cổng host là **8090** (xem mục Docker), nên dùng `http://localhost:8090/` và `http://localhost:8090/classic`.

## Chạy bằng Docker (không cần cài Node trên máy)

```bash
docker compose up -d        # chạy db → migrate → web (tự xếp thứ tự)
docker compose logs -f web  # xem log web
docker compose down         # dừng (giữ dữ liệu DB)
docker compose down -v      # dừng + XOÁ dữ liệu DB + node_modules
```

- App: **http://localhost:8090/** (modern) · **http://localhost:8090/classic** (classic)
- Cổng host: client **8090**, API **8010**, Postgres **5433** (cổng nội bộ container vẫn 8081/8000/5432 nên proxy `/api` chạy bình thường). Đổi tại [`docker-compose.yml`](./docker-compose.yml) / [`docker-compose.db.yaml`](./docker-compose.db.yaml).
- Chạy lệnh trong container: `docker compose exec -T web pnpm <typecheck|build|test|migrate>`.

## Database (PostgreSQL) + migration

API lưu **lời chúc** và **RSVP** vào Postgres thật (không còn in-memory).

```
db/migrations/          # các file .sql áp dụng tuần tự
  0001_init.sql         #   tạo bảng wishes + rsvps (id uuid)
  0002_seed.sql         #   chèn 1 lời chúc mẫu nếu trống
server/db/pool.ts       # pg Pool (đọc DATABASE_URL)
server/db/migrate.ts    # runner: track version trong schema_migrations (idempotent)
```

```bash
# Chỉ dựng DB + chạy migration (không web):
docker compose -f docker-compose.db.yaml up

# Thêm migration mới: tạo db/migrations/0003_xxx.sql rồi:
docker compose exec -T web pnpm migrate     # (hoặc up lại — service migrate tự chạy)

# Xem dữ liệu:
docker compose exec db psql -U wedding -d wedding -c "select * from wishes;"
```

`DATABASE_URL` mặc định trong Docker: `postgres://wedding:wedding@db:5432/wedding`
(ngoài Docker dùng `@localhost:5433`). Xem [`.env.example`](./.env.example).

## Scripts

| Lệnh | Việc |
|---|---|
| `pnpm dev` / `pnpm dev:server` / `pnpm dev:all` | dev client / mock API / cả hai |
| `pnpm build` | pre-render tĩnh (vite-react-ssg) → `dist/spa` (SEO) |
| `pnpm preview` | xem bản build tĩnh (:4173) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest |

## Cấu trúc

```
client/
  pages/Wedding.tsx          # trang thiệp (config-driven)
  components/
    ui/                      # button, input, section (shadcn-style, cn())
    wedding/                 # Hero, Invitation, Couple, Countdown, StoryTimeline,
                             #   Events, Gallery, Rsvp, Wishes, GiftQr, Footer,
                             #   Envelope (mở thiệp), MusicPlayer, FallingEffect, GuestNotification
    Seo.tsx                  # <head> per-route (vite-react-ssg Head → SEO tĩnh)
  hooks/                     # useWishes, useRsvp (React Query), useCountdown, useGuestName
  stores/                    # musicStore, envelopeStore (Zustand)
  lib/                       # api.ts (typed fetch + ApiError), utils.ts (cn)
  constants/                 # apiPaths.ts, routes.ts, weddingConfig.ts  ← DỮ LIỆU THIỆP
shared/api.ts                # types dùng chung client + server (Rsvp, Wish)
server/                      # Express mock: /api/v1/{health,rsvp,wishes}
```

Path aliases: `@/` = `client/`, `@shared/` = `shared/`.

## Một template, nhiều thiệp

Toàn bộ nội dung & hiệu ứng nằm trong [`client/constants/weddingConfig.ts`](./client/constants/weddingConfig.ts)
(cặp đôi, sự kiện, album, STK, settings nhạc/rơi/auto-scroll/mở thiệp). Tạo thiệp mới = thay config.
`variant` chọn layout: `"modern"` (MeHappy, mobile-first — mặc định) hoặc `"classic"` (iWedding).

> ⚠️ Dữ liệu trong config hiện là **mẫu/placeholder** — thay bằng dữ liệu thật khi triển khai.
> Ảnh dùng `picsum.photos`, nhạc dùng SoundHelix demo.
