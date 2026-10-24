-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- -----------------------------
-- Table: public.profiles
-- -----------------------------
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'staff' check (role in ('admin', 'manager', 'staff')),
  department text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security and add restrictive policies for profiles
alter table public.profiles enable row level security;
-- Profiles: conservative RLS — block direct client access by default.
-- All policies are explicit and idempotent (DROP POLICY IF EXISTS before CREATE).

drop policy if exists profiles_select_none on public.profiles;
create policy profiles_select_none on public.profiles
  for select using (false);

drop policy if exists profiles_insert_none on public.profiles;
create policy profiles_insert_none on public.profiles
  for insert with check (false);

drop policy if exists profiles_update_none on public.profiles;
create policy profiles_update_none on public.profiles
  for update using (false) with check (false);

drop policy if exists profiles_delete_none on public.profiles;
create policy profiles_delete_none on public.profiles
  for delete using (false);

-- Note: The application uses a server-side service-role client which bypasses RLS.
-- Authorization decisions must be enforced in the Next.js API layer. These policies
-- intentionally deny direct client access to profile rows (prevents accidental exposure
-- of password_hash). If you later configure Supabase Auth and want clients to read their
-- own profile rows directly, replace the above with an authenticated SELECT policy.

-- -----------------------------
-- Table: public.departments
-- -----------------------------
create table if not exists public.departments (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.departments enable row level security;

-- Departments are non-sensitive; allow read access to anonymous and authenticated clients.
-- This makes it easy for public UI to fetch department lists without exposing user data.
-- Departments: conservative deny-all policies to avoid relying on Supabase JWT configuration.
drop policy if exists departments_select_none on public.departments;
create policy departments_select_none on public.departments
  for select using (false);

drop policy if exists departments_insert_none on public.departments;
create policy departments_insert_none on public.departments
  for insert with check (false);

drop policy if exists departments_update_none on public.departments;
create policy departments_update_none on public.departments
  for update using (false) with check (false);

drop policy if exists departments_delete_none on public.departments;
create policy departments_delete_none on public.departments
  for delete using (false);

-- -----------------------------
-- Table: public.workers
-- -----------------------------
-- Represents workforce records used in the application UI.
create table if not exists public.workers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  status text not null default 'active' check (status in ('active', 'idle', 'on-leave')),
  shift text not null,
  department text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workers enable row level security;

drop policy if exists workers_select_authenticated on public.workers;
create policy workers_select_none on public.workers
  for select using (false);

drop policy if exists workers_insert_admin_manager on public.workers;
create policy workers_insert_none on public.workers
  for insert with check (false);

drop policy if exists workers_update_admin_manager on public.workers;
create policy workers_update_none on public.workers
  for update using (false) with check (false);

drop policy if exists workers_delete_admin_manager on public.workers;
create policy workers_delete_none on public.workers
  for delete using (false);

-- Useful indexes for worker queries
create index if not exists idx_workers_department on public.workers (department);
create index if not exists idx_workers_status on public.workers (status);
create index if not exists idx_workers_created_at on public.workers (created_at desc);

-- -----------------------------
-- Table: public.jobs
-- -----------------------------
create table if not exists public.jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'done', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.jobs enable row level security;

drop policy if exists jobs_select_authenticated on public.jobs;
create policy jobs_select_none on public.jobs
  for select using (false);

drop policy if exists jobs_insert_admin_manager on public.jobs;
create policy jobs_insert_none on public.jobs
  for insert with check (false);

drop policy if exists jobs_update_admin_manager on public.jobs;
create policy jobs_update_none on public.jobs
  for update using (false) with check (false);

drop policy if exists jobs_delete_admin_manager on public.jobs;
create policy jobs_delete_none on public.jobs
  for delete using (false);

-- Indexes for jobs
create index if not exists idx_jobs_status on public.jobs (status);
create index if not exists idx_jobs_created_at on public.jobs (created_at desc);

-- -----------------------------
-- Table: public.worker_jobs
-- -----------------------------
create table if not exists public.worker_jobs (
  id uuid primary key default uuid_generate_v4(),
  worker_id uuid not null references public.workers(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  assigned_by uuid references public.profiles(id),
  status text not null default 'assigned' check (status in ('assigned', 'in_progress', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (worker_id, job_id)
);

alter table public.worker_jobs enable row level security;

drop policy if exists worker_jobs_select_authenticated on public.worker_jobs;
create policy worker_jobs_select_none on public.worker_jobs
  for select using (false);

drop policy if exists worker_jobs_insert_admin_manager_or_owner on public.worker_jobs;
create policy worker_jobs_insert_none on public.worker_jobs
  for insert with check (false);

drop policy if exists worker_jobs_update_admin_manager on public.worker_jobs;
create policy worker_jobs_update_none on public.worker_jobs
  for update using (false) with check (false);

drop policy if exists worker_jobs_delete_admin_manager on public.worker_jobs;
create policy worker_jobs_delete_none on public.worker_jobs
  for delete using (false);

-- Indexes for worker_jobs
create index if not exists idx_worker_jobs_worker_id on public.worker_jobs (worker_id);
create index if not exists idx_worker_jobs_job_id on public.worker_jobs (job_id);
create index if not exists idx_worker_jobs_assigned_by on public.worker_jobs (assigned_by);

-- -----------------------------
-- Table: public.attachments
-- -----------------------------
create table if not exists public.attachments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  worker_id uuid references public.workers(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  content_type text not null,
  file_size bigint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.attachments enable row level security;

drop policy if exists attachments_select_authenticated on public.attachments;
create policy attachments_select_none on public.attachments
  for select using (false);

drop policy if exists attachments_insert_owner_or_admin on public.attachments;
create policy attachments_insert_none on public.attachments
  for insert with check (false);

drop policy if exists attachments_update_owner_admin on public.attachments;
create policy attachments_update_none on public.attachments
  for update using (false) with check (false);

drop policy if exists attachments_delete_owner_admin on public.attachments;
create policy attachments_delete_none on public.attachments
  for delete using (false);

-- Indexes for attachments
create index if not exists idx_attachments_user_id on public.attachments (user_id);
create index if not exists idx_attachments_worker_id on public.attachments (worker_id);

-- End of schema
