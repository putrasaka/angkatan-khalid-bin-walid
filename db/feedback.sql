-- Tabel masukan pengunjung (fitur "Kirim Masukan").
-- Aman dijalankan berulang: tidak ada DROP/DELETE.
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  visitor_name text not null,
  phone text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx
  on feedback (created_at desc);
