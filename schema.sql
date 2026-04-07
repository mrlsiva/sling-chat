-- Run this in your Supabase SQL editor

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  situation_type text,
  key_problem text,
  urgency_level text,
  user_intent text,
  additional_notes text,
  created_at timestamp with time zone default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  messages jsonb not null default '[]',
  extracted_data jsonb not null default '{}',
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (optional but recommended)
alter table leads enable row level security;
alter table conversations enable row level security;

-- Allow anonymous inserts (for the chat app)
create policy "Allow anon insert leads" on leads
  for insert to anon with check (true);

create policy "Allow anon insert conversations" on conversations
  for insert to anon with check (true);

-- Allow service role to read all (for admin page)
create policy "Allow service read leads" on leads
  for select using (true);

create policy "Allow service read conversations" on conversations
  for select using (true);
