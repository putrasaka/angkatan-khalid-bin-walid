-- ============================================
-- SCHEMA - Kenangan Angkatan Khalid Bin Walid
-- Target: Neon Postgres
-- Jalankan di Neon SQL Editor (sekali saja)
-- Catatan: RLS tidak dipakai karena akses DB hanya dari server (Vercel Function)
-- ============================================

-- 1. Drop if exists (untuk setup ulang)
drop table if exists visitor_logs cascade;
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

-- 8. Visitor Logs (login pengunjung)
create table visitor_logs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age text,
  previous_school text,
  current_school text,
  logged_in_at timestamp with time zone default now()
);

-- 9. Index untuk urutan tampil
create index students_created_at_idx on students (created_at);
create index moments_created_at_idx on moments (created_at);
create index graduation_gallery_created_at_idx on graduation_gallery (created_at);
create index video_moments_created_at_idx on video_moments (created_at);
create index graduates_position_idx on graduates (position);
create index visitor_logs_name_idx on visitor_logs (lower(name));
