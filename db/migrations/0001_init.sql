-- 0001_init — bảng lời chúc (sổ lưu bút) + xác nhận tham dự (RSVP).
-- gen_random_uuid() có sẵn trong Postgres core từ v13 (không cần extension).

create table if not exists wishes (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  message    text        not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_wishes_created_at on wishes (created_at desc);

create table if not exists rsvps (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  attendance text        not null check (attendance in ('yes', 'no')),
  guests     integer     not null default 1 check (guests >= 1),
  side       text        check (side in ('groom', 'bride', 'both')),
  message    text,
  created_at timestamptz not null default now()
);

create index if not exists idx_rsvps_created_at on rsvps (created_at desc);
