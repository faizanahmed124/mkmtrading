-- ============================================================
-- Car Dealership — Supabase schema
-- Run this in your Supabase project's SQL editor (Database > SQL Editor)
-- ============================================================

-- 1. CARS TABLE ------------------------------------------------
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  brand text not null,
  model text not null,
  year int not null,
  price numeric not null,
  mileage int,
  fuel_type text,
  transmission text,
  color text,
  condition text not null default 'Used',
  description text,
  images text[] default '{}',
  featured boolean not null default false
);

alter table public.cars enable row level security;

-- Anyone (including anonymous website visitors) can view cars.
create policy "Public can view cars"
  on public.cars for select
  to anon, authenticated
  using (true);

-- Only logged-in admins can add, edit or delete cars.
create policy "Authenticated users can insert cars"
  on public.cars for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update cars"
  on public.cars for update
  to authenticated
  using (true);

create policy "Authenticated users can delete cars"
  on public.cars for delete
  to authenticated
  using (true);

-- 2. SITE SETTINGS (shop name / address / phone / map) ---------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  shop_name text not null default 'My Motors',
  address text not null default 'Your shop address here',
  phone text,
  whatsapp text,
  map_url text,
  latitude double precision,
  longitude double precision
);

alter table public.site_settings enable row level security;

create policy "Public can view settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can update settings"
  on public.site_settings for update
  to authenticated
  using (true);

create policy "Authenticated users can insert settings"
  on public.site_settings for insert
  to authenticated
  with check (true);

-- seed one settings row if the table is empty
insert into public.site_settings (shop_name, address, phone, whatsapp, map_url)
select 'My Motors', 'Shop #12, Main Boulevard, Lahore', '+92 300 0000000', '+92 300 0000000',
       'https://www.google.com/maps?q=31.5204,74.3587'
where not exists (select 1 from public.site_settings);

-- 3. STORAGE BUCKET FOR CAR IMAGES ------------------------------
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

create policy "Public can view car images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'car-images');

create policy "Authenticated users can upload car images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'car-images');

create policy "Authenticated users can update car images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'car-images');

create policy "Authenticated users can delete car images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'car-images');

-- ============================================================
-- IMPORTANT: create your admin login manually in
-- Supabase Dashboard > Authentication > Users > Add user
-- (there is no public sign-up form on this site — by design).
-- ============================================================
