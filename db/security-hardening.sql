-- Tabel rate limit bersama untuk endpoint publik.
-- Additive: tidak mengubah tabel yang sudah ada.
create table if not exists rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count integer not null default 0
);

create index if not exists rate_limits_window_idx on rate_limits (window_start);
