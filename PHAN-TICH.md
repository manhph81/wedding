# PHÂN TÍCH 2 WEBSITE THIỆP CƯỚI (Phase 1)

> Mục tiêu: phân tích UI & UX của 2 trang để làm cơ sở clone.
> Ngày phân tích: 14/06/2026

## Đối tượng

| Ký hiệu | URL | Nền tảng | Cặp đôi |
|---|---|---|---|
| **Site A** | https://chau-chinh.iwedding.info/ | iWedding | Xuân Châu & Phương Chinh |
| **Site B** | https://quangvan.mehappy.info/ | MeHappy (mehappy.info / api.mehappy.vn) | Xuân Quang & Hồng Vân |

Cả hai đều là **thiệp cưới online dạng one-page** do nền tảng SaaS tạo ra (người dùng tự điền nội dung qua trình tạo thiệp). Đây là điểm cốt lõi: ta không clone một trang tĩnh, mà clone **một template + cơ chế đổ dữ liệu động**.

---

## 1. TỔNG QUAN KỸ THUẬT (nền tảng)

| Tiêu chí | Site A — iWedding | Site B — MeHappy |
|---|---|---|
| Công nghệ FE | Trang tĩnh kiểu cổ điển, **jQuery** (dùng plugin `slicknav` cho menu mobile) | **Next.js** (App Router, RSC), render động |
| Cách đổ nội dung | HTML render sẵn trong trang | Gọi **API** `api.mehappy.vn/api/pages/lookup?domain=<subdomain>` trả về JSON; nội dung là **Craft.js page-builder** (block JSON mã hoá base64) |
| Phân giải trang | Theo **subdomain** (`chau-chinh.`) | Theo **subdomain** map vào `domain` trong DB (`quangvan.mehappy.info`) |
| Định hướng thiết bị | **Responsive** (desktop + mobile), `width=device-width` | **Mobile-first / mobile-only** (`mobileOnly: true`, `mobileWidth: 380px`, `desktopWidth: 960px`) |
| Map | Google Maps (link) | **Goong Maps** (`rsapi.goong.io` – map của VN) + autocomplete địa chỉ |
| Mừng cưới | Modal hiển thị STK ngân hàng | STK + **QR code** sinh động (`api.qrserver.com`) |
| Analytics | — | Google Analytics (`G-2SH8LMQ0ZD`) + **Meta Pixel** |
| Lưu trữ media | Trên hệ thống iWedding | Cloudflare R2 (`s3-hcm-r2.s3cloud.vn/thiepcuoi-mehappy/...`) |

**Kết luận kỹ thuật:** Site A là template "đời cũ" (server render + jQuery), dễ clone thành trang tĩnh. Site B là kiến trúc hiện đại (Next.js + page-builder + backend API), nhiều hiệu ứng và cấu hình hơn — nếu clone đầy đủ phải tự dựng cả phần config động.

> **Lưu ý về stack clone:** Đây là công nghệ **gốc** của 2 site (để hiểu cách chúng hoạt động). **Khi clone, ta KHÔNG sao chép stack này** mà dùng stack chuẩn của dự án `gladia-clone-react` (Vite + React + `vite-react-ssg`) — xem **§4.3**.

---

## 2. PHÂN TÍCH UI

### 2.1. Bố cục & cấu trúc section

**Site A — iWedding** (multi-section có thanh nav cố định trên cùng)

Thứ tự section (theo id thực tế trong HTML):
1. `navbar` / `inner-navigation` — Thanh điều hướng cố định, logo **"XCPC"**, menu: Home · Cặp đôi · Chuyện tình yêu · Sự kiện cưới · Album · Sổ Lưu Bút · RSVP. Mobile dùng menu hamburger (slicknav).
2. `wd-banner` — **Hero**: "We're Getting Married!" + tên cặp đôi + "SAVE THE DATE 28-12-2025".
3. `about-us` — **Giới thiệu cặp đôi**: 2 card (chú rể / cô dâu) có ảnh, mô tả ngắn, nút "Xem thêm". 3 nút CTA: Gửi lời chúc · Xác nhận tham dự · Mừng cưới.
4. `our-story` — **Chuyện tình yêu**: timeline dạng card mở rộng (gặp gỡ → tỏ tình → cầu hôn → dạm ngõ), mỗi mốc có ảnh + lời kể.
5. `wedding-event` — **Sự kiện cưới**: 4 sự kiện (nhà gái 27/12, nhà trai 28/12) có giờ, địa điểm, link Google Maps, nút **"Thêm vào lịch"** (Apple/Google/Outlook).
6. `the-quote` — Câu trích dẫn lãng mạn căn giữa.
7. `the-gallery` — **Album ảnh cưới**: lưới thumbnail, click phóng to (modal), nút "Tất cả hình ảnh".
8. `the-countdown` / `clock` — **Đồng hồ đếm ngược** tới ngày cưới.
9. `rsvp` / `wish-form` / `wishSuggestions` — **RSVP + Sổ lưu bút**: form (tên/email), gợi ý lời chúc, danh sách lời chúc của khách.
10. `donate-modal` — **Hộp mừng cưới**: STK Techcombank (chú rể) + TPBank (cô dâu).
11. `footer`.

**Site B — MeHappy** (one-page cuộn dọc, không có nav bar cố định kiểu desktop — tối ưu lướt trên điện thoại)

Khối nội dung phát hiện được (từ JSON page-builder):
1. **Màn mở thiệp / bìa (cover)** — ảnh bìa lớn, tên cặp đôi bằng **font thư pháp**.
2. **"TRÂN TRỌNG KÍNH MỜI"** + **tên khách được cá nhân hoá** ("Quý Khách" / `guestInfoField`) — xem mục UX.
3. **Giới thiệu cặp đôi** (married / chú rể – cô dâu).
4. **Save the date / Countdown**.
5. **Timeline chuyện tình** (`timeline`).
6. **Album** (`album`).
7. **Sự kiện cưới** — "BUỔI LỄ THÀNH HÔN CÙNG GIA ĐÌNH CHÚNG TÔI", có ngày **dương + âm lịch** (`solarDate`/lunar), giờ, địa điểm (Goong Map).
8. **Xác nhận tham dự (XNTD/RSVP)** + lời chúc.
9. **Mừng cưới** — STK + **QR code**.

### 2.2. Màu sắc

- **Site A:** tông pastel nhẹ, nhấn **vàng / rose-gold** (chuẩn thiệp cưới VN). Có các đường phân cách trang trí (`layer-3.png`, `layer-5.png`).
- **Site B:** nền trắng (`#ffffff`), nhấn **hồng nâu / rosy `#965D5D`** (màu của hiệu ứng tim rơi). Tông sạch, tối giản, để ảnh và font thư pháp làm chủ đạo.

### 2.3. Typography

- **Site A:** `Dosis` (sans-serif, cho heading/UI) + `Great Vibes` (script, cho tên & tiêu đề lãng mạn). Body có dùng serif.
- **Site B:** kho **font thư pháp/script phong phú** nạp riêng: `Great Vibes`, `Allura`, `Mrs Saint Delafield`, `Scarlet Bradley`, `1FTV-VIP-Fairyland`, `UTM Wedding K&T`, `VNI-Shishoni Brush`, `VNI-University`, `Fz-Photograph`, kết hợp `Philosopher` / `Playfair Display` cho phần chữ trang trọng. → cảm giác "viết tay", cá nhân hoá cao.

### 2.4. Hình ảnh

Cả hai dùng **ảnh cưới chụp chuyên nghiệp** (portrait cặp đôi, ảnh đời thường, ảnh phóng sự). Site B lưu ảnh đã tối ưu định dạng **.webp** trên CDN R2.

---

## 3. PHÂN TÍCH UX

### 3.1. Luồng trải nghiệm chính

**Site A (iWedding):** trải nghiệm kiểu **website** — vào trang thấy hero, dùng nav bar nhảy nhanh tới từng mục; phù hợp cả desktop lẫn mobile; người xem chủ động cuộn/điều hướng.

**Site B (MeHappy):** trải nghiệm kiểu **thiệp điện thoại** — thiết kế cho màn ~380px, **tự động hoá cao**, dẫn dắt người xem theo mạch cảm xúc từ trên xuống. Các điểm UX nổi bật:

| Tính năng UX | Site A | Site B | Ghi chú |
|---|---|---|---|
| **Mở thiệp (opening effect)** | — | Có cấu hình (template "mở 2 cánh thiệp" left/right) | Hiệu ứng "mở phong bì" trước khi vào nội dung |
| **Nhạc nền tự phát** | Có (`.mp3`, autoplay) | **Có** (`autoPlay: true`, nút bật/tắt nổi) | Site B có cả icon play/pause tuỳ biến |
| **Đồng hồ đếm ngược** | Có (`the-countdown`) | Có ("Save the date") | |
| **Hiệu ứng rơi (petals/hearts)** | — | **Có**: tim `#965D5D` + chấm trắng, kiểu rơi "wobble" | Phủ ~25% màn |
| **Tự động cuộn (auto-scroll)** | — | **Có** (`autoScroll.enabled: true`) | Trang tự lướt qua các section |
| **Popup thông báo** | — | **Có** (notification, 5s/lần) | Hiển thị lời chúc khách / thông báo nhỏ |
| **Cá nhân hoá tên khách** | — | **Có** (`guestInfoField` → "Kính mời Quý Khách: [Tên]") | Link riêng cho từng khách qua param |
| **Ngày âm + dương lịch** | Dương | **Cả âm & dương** | Phù hợp văn hoá cưới VN |
| **Thêm vào lịch** | Có (Apple/Google/Outlook) | (theo template) | |
| **Bản đồ chỉ đường** | Google Maps | Goong Maps + autocomplete | |
| **QR mừng cưới** | STK trong modal | **STK + QR** quét chuyển khoản | Site B tiện hơn |

### 3.2. Tương tác chính (giống nhau ở cả hai)

- **RSVP / Xác nhận tham dự:** form nhập tên, số người, lựa chọn tham dự.
- **Sổ lưu bút / Lời chúc:** khách để lại lời chúc, hiển thị công khai; Site A có gợi ý lời chúc sẵn (`wishSuggestions`).
- **Mừng cưới:** xem STK 2 bên (nhà trai/nhà gái); Site B thêm QR.
- **Gọi điện / liên hệ** & **chia sẻ** (thường có ở nền tảng này).

### 3.3. Đánh giá UX so sánh

- **Site A** mạnh ở **chiều sâu nội dung** và điều hướng rõ ràng (nav bar, nhiều section, gợi ý lời chúc). Hợp người xem trên desktop, muốn đọc kỹ.
- **Site B** mạnh ở **cảm xúc & cá nhân hoá**: mở thiệp, nhạc, hiệu ứng rơi, auto-scroll, cá nhân hoá tên khách, QR — tối ưu cho việc **gửi link qua Zalo/Messenger và mở trên điện thoại**. Đây là xu hướng thiệp cưới VN hiện tại.

---

## 4. ĐỀ XUẤT CHO VIỆC CLONE

### 4.1. Khung tính năng chung cần có (giao của 2 site)
Hero/bìa · Giới thiệu cô dâu–chú rể · Chuyện tình (timeline) · Sự kiện cưới (giờ + địa điểm + map + add-to-calendar) · Đếm ngược · Album ảnh (lightbox) · RSVP · Sổ lưu bút · Mừng cưới (STK/QR) · Footer · Nhạc nền · Đa ngôn ngữ (VN chính, EN cho heading).

### 4.2. Tính năng "nâng cao" nên lấy từ Site B
1. **Mobile-first 380px** + container desktop căn giữa.
2. **Hiệu ứng mở thiệp** (2 cánh) khi vào trang.
3. **Nhạc nền autoplay** + nút bật/tắt nổi.
4. **Hiệu ứng rơi** (tim/cánh hoa/chấm sáng) cấu hình được màu, mật độ, tốc độ.
5. **Cá nhân hoá tên khách** qua query param (`?guest=...` hoặc slug khách).
6. **Lịch âm + dương**.
7. **QR chuyển khoản** sinh tự động từ STK.
8. **Auto-scroll** tuỳ chọn + **popup thông báo** lời chúc.

### 4.3. Kiến trúc clone — DÙNG STACK CỦA `gladia-clone-react`

> Yêu cầu: clone 2 web trên bằng **đúng công nghệ** của dự án `ai-workspace/projects/gladia-clone-react` (PIXA fusion-starter). **Không dùng Next.js** — dùng **Vite + React SPA + `vite-react-ssg`** (pre-render tĩnh cho SEO, vẫn giữ được hiệu ứng client).

**Stack bắt buộc (lấy từ `AI_CONTEXT/GLADIA` + `package.json` của gladia-clone-react):**

| Hạng mục | Công nghệ | Phiên bản |
|---|---|---|
| UI Framework | React | 18.3.1 |
| Ngôn ngữ | TypeScript | 5.9.2 |
| Bundler / Dev server | **Vite** (port 8081) | 7.1.2 |
| SSR/SSG (SEO) | **vite-react-ssg** | 0.8.7 |
| Routing | React Router | 6.30.1 |
| Styling | Tailwind CSS + shadcn/ui (Radix) | 3.4.17 |
| Animation / hiệu ứng | **Framer Motion** | 12.23.12 |
| Icons | Lucide React | 0.539.0 |
| Toast / thông báo | Sonner | 1.7.4 |
| Form (RSVP, lời chúc) | React Hook Form + Zod | 7.62 / 3.25 |
| Server state | TanStack React Query | 5.84 |
| Client state | Zustand | 5.0 |
| Ngày/giờ | date-fns | 4.3 |
| Mock API (RSVP/wishes) | Express | 5.1 |
| Test | Vitest + Testing Library + jsdom | 3.2 / 16 |
| QA | pa11y-ci (WCAG 2.1 AA) + Lighthouse CI (SEO/a11y ≥ 95) | — |

**Path aliases:** `@/` = `client/`, `@shared/` = `shared/`, `@aiw/design-system` = `packages/design-system`.

**Folder layout (giữ nguyên quy ước fusion-starter):**
```
client/
  pages/            # WeddingA.tsx (iWedding), WeddingB.tsx (MeHappy), hoặc 1 template + data
  components/
    ui/             # shadcn primitives + UI dùng chung (kebab-case)
    wedding/        # Section components: hero, couple, story-timeline,
                    #   events, countdown, gallery, rsvp, wishes, gift-qr, music-player...
  hooks/            # useWishes / useRsvp (React Query), useCountdown, useAutoScroll
  stores/           # Zustand: musicStore (play/pause), envelopeStore (đã mở thiệp?)
  lib/              # api.ts (typed fetch + ApiError), utils.ts (cn())
  constants/        # apiPaths.ts, weddingConfig.ts
shared/             # types dùng chung client + server (Rsvp, Wish, WeddingConfig)
server/             # Express mock: POST /api/v1/rsvp, GET/POST /api/v1/wishes
packages/design-system/
```

**Ánh xạ tính năng → thư viện trong stack:**

| Tính năng (từ Phase 1) | Triển khai bằng stack gladia |
|---|---|
| Mở thiệp 2 cánh / phong bì | **Framer Motion** (`AnimatePresence`, variants) + Zustand `envelopeStore` |
| Nhạc nền autoplay + nút bật/tắt | `<audio>` + Zustand `musicStore`; nút nổi từ `components/ui` + Lucide icon |
| Hiệu ứng rơi (tim/cánh hoa) | Component canvas/DOM + Framer Motion; cấu hình màu/mật độ/tốc độ qua props |
| Đếm ngược | hook `useCountdown` + **date-fns** |
| Auto-scroll | hook `useAutoScroll` (requestAnimationFrame) |
| Album lightbox | shadcn `Dialog` + Framer Motion |
| RSVP / Sổ lưu bút | **React Hook Form + Zod** → `api.post` → **Express mock** (`/api/v1/rsvp`, `/api/v1/wishes`); list qua **React Query** |
| Popup thông báo lời chúc | **Sonner** toasts (hoặc component notification) |
| Cá nhân hoá tên khách | React Router `useSearchParams` (`?guest=...`) đọc từ `weddingConfig` |
| Lịch âm + dương | util chuyển đổi âm lịch (lunar) + date-fns format |
| QR chuyển khoản | sinh URL QR (VietQR / api.qrserver.com) — render `<img>` |
| Map chỉ đường | Goong Maps embed / Google Maps embed |
| SEO + chia sẻ Zalo/FB | **vite-react-ssg** pre-render + meta OG tags |

### 4.4. Dữ liệu thiệp — tách config khỏi code
- Tách **cấu hình thiệp** thành JSON/TS (`constants/weddingConfig.ts` hoặc `shared/`): thông tin cặp đôi, sự kiện, ảnh, STK, settings hiệu ứng (nhạc/rơi/auto-scroll) — **một template, nhiều thiệp** (tinh thần `pages/lookup` của MeHappy nhưng tĩnh, build-time).
- Mỗi site (A/B) = một bộ config + (nếu cần) một biến thể layout. Section dạng **block bật/tắt & sắp xếp** được qua config.
- Quy trình build có sẵn của starter: `aiw design-system` → `aiw landing` → `aiw polish`, rồi `pnpm typecheck && pnpm build`, QA bằng `pnpm a11y` / `pnpm seo`.

### 4.5. Lưu ý
- Toàn bộ **nội dung, ảnh, STK, tên** của 2 site là dữ liệu thật của khách → khi clone phải thay bằng **dữ liệu mẫu/placeholder**, không tái sử dụng.
- Font thư pháp của Site B là tài sản license → cần dùng font có bản quyền hợp lệ tương đương.

---

## 5. TÓM TẮT
- **Site A (iWedding):** website cưới cổ điển, đa section, responsive, điều hướng rõ — hợp đọc kỹ trên desktop.
- **Site B (MeHappy):** thiệp cưới điện thoại hiện đại (Next.js + page-builder), giàu hiệu ứng & cá nhân hoá — chuẩn xu hướng hiện tại; **nên lấy làm chuẩn chính để clone**, bổ sung các điểm mạnh nội dung của Site A.
- **Stack clone (chốt):** dùng đúng công nghệ `gladia-clone-react` — **Vite + React 18 + TypeScript + vite-react-ssg**, Tailwind + shadcn/ui, Framer Motion, RHF + Zod, React Query, Zustand, Express mock, Vitest + pa11y/Lighthouse (§4.3). Tách config thiệp khỏi code để "một template, nhiều thiệp" (§4.4).
