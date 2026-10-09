-- ============================================
-- visitor_logs - Log login pengunjung buku kenangan
-- Jalankan di Supabase SQL Editor (sekali saja)
-- ============================================

create table if not exists visitor_logs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age text,
  previous_school text,
  current_school text,
  logged_in_at timestamp with time zone default now()
);

alter table visitor_logs enable row level security;

drop policy if exists "Public can read visitor_logs" on visitor_logs;
create policy "Public can read visitor_logs" on visitor_logs for select using (true);

drop policy if exists "Allow anon insert visitor_logs" on visitor_logs;
create policy "Allow anon insert visitor_logs" on visitor_logs for insert with check (true);

drop policy if exists "Allow anon delete visitor_logs" on visitor_logs;
create policy "Allow anon delete visitor_logs" on visitor_logs for delete using (true);
