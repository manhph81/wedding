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

> Khi chạy bằng Docker, cổng host là **8090** (xem mục Docker), nên dùng `http://localhost:8090/` và `http://localhost:8090/classic`.

## Chạy bằng Docker (không cần cài Node trên máy)

```bash
docker compose up -d        # build + chạy client + mock API trong container
docker compose logs -f web  # xem log
docker compose down         # dừng
```

- App: **http://localhost:8090/** (modern) · **http://localhost:8090/classic** (classic)
- Cổng host: client **8090**, mock API **8010** (cổng nội bộ container vẫn 8081/8000 nên proxy `/api` chạy bình thường). Đổi tại [`docker-compose.yml`](./docker-compose.yml).
- Chạy lệnh trong container: `docker compose exec -T web pnpm <typecheck|build|test>`.

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
