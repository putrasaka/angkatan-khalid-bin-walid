-- ============================================
-- SUPABASE SCHEMA - Kenangan Angkatan Khalid Bin Walid
-- Jalankan di Supabase SQL Editor (sekali saja)
-- ============================================

-- 1. Drop if exists (untuk setup ulang)
drop table if exists graduation_gallery cascade;
drop table if exists graduates cascade;
drop table if exists graduation_info cascade;
drop table if exists video_moments cascade;
drop table if exists moments cascade;
drop table if exists students cascade;

-- 2. Students
create table students (
  id text primary key,
  name text not null,
  nickname text,
  role text,
  photo text,
  photo_large text,
  photo_sd text,
  photo_smp text,
  previous_school text,
  current_school text,
  birth_place_date text,
  address text,
  hobby text,
  dream text,
  message text,
  impression text,
  instagram text,
  created_at timestamp with time zone default now()
);

-- 3. Moments
create table moments (
  id text primary key,
  title text not null,
  image text not null,
  date text,
  tag text,
  story text,
  created_at timestamp with time zone default now()
);

-- 4. Graduation Info (hanya 1 row, id=1)
create table graduation_info (
  id int primary key,
  main_banner text,
  title text,
  cohort_name text,
  date text,
  location text,
  description text,
  constraint single_row check (id = 1)
);

-- 5. Graduates (daftar nama wisudawan)
create table graduates (
  id serial primary key,
  name text not null,
  position int not null
);

-- 6. Graduation Gallery
create table graduation_gallery (
  id text primary key,
  image text not null,
  caption text,
  created_at timestamp with time zone default now()
);

-- 7. Video Moments
create table video_moments (
  id text primary key,
  title text not null,
  description text,
  video_url text not null,
  poster_url text,
  duration text,
  date text,
  created_at timestamp with time zone default now()
);

-- 8. Enable RLS (keamanan)
alter table students enable row level security;
alter table moments enable row level security;
alter table graduation_info enable row level security;
alter table graduates enable row level security;
alter table graduation_gallery enable row level security;
alter table video_moments enable row level security;

-- 9. Policies: Public bisa baca (anon)
create policy "Public can read students" on students for select using (true);
create policy "Public can read moments" on moments for select using (true);
create policy "Public can read graduation_info" on graduation_info for select using (true);
create policy "Public can read graduates" on graduates for select using (true);
create policy "Public can read graduation_gallery" on graduation_gallery for select using (true);
create policy "Public can read video_moments" on video_moments for select using (true);

-- 10. Policies: Service role bisa tulis (untuk Admin via server)
-- Catatan: Jika pakai anon key langsung dari browser, ganti dengan "allow anon write" untuk development
-- Untuk production via Vercel Function, service_role otomatis bypass RLS jadi tidak perlu policy tambahan.
-- Untuk development langsung, uncomment di bawah:

create policy "Allow anon insert students" on students for insert with check (true);
create policy "Allow anon update students" on students for update using (true);
create policy "Allow anon delete students" on students for delete using (true);

create policy "Allow anon insert moments" on moments for insert with check (true);
create policy "Allow anon update moments" on moments for update using (true);
create policy "Allow anon delete moments" on moments for delete using (true);

create policy "Allow anon insert graduation_info" on graduation_info for insert with check (true);
create policy "Allow anon update graduation_info" on graduation_info for update using (true);

create policy "Allow anon insert graduates" on graduates for insert with check (true);
create policy "Allow anon delete graduates" on graduates for delete using (true);

create policy "Allow anon insert graduation_gallery" on graduation_gallery for insert with check (true);
create policy "Allow anon update graduation_gallery" on graduation_gallery for update using (true);
create policy "Allow anon delete graduation_gallery" on graduation_gallery for delete using (true);

create policy "Allow anon insert video_moments" on video_moments for insert with check (true);
create policy "Allow anon update video_moments" on video_moments for update using (true);
create policy "Allow anon delete video_moments" on video_moments for delete using (true);

-- 11. Storage bucket 'media' harus dibuat manual di Dashboard Storage > New Bucket (Public)
-- Policies storage:
-- - SELECT: allow anon (public read)
-- - INSERT/UPDATE/DELETE: allow authenticated atau anon (untuk dev), production batasi service_role
