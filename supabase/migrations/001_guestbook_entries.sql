-- guestbook_entries table
create table public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 50),
  message text not null check (char_length(message) between 1 and 500),
  edit_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index guestbook_entries_created_at_idx
  on public.guestbook_entries (created_at desc);

-- RLS
alter table public.guestbook_entries enable row level security;

create policy "anon_select" on public.guestbook_entries
  for select to anon using (true);

create policy "anon_insert" on public.guestbook_entries
  for insert to anon
  with check (char_length(name) <= 50 and char_length(message) <= 500);

revoke update, delete on public.guestbook_entries from anon;

-- RPC: update with edit_token verification
create or replace function public.update_guestbook_entry(
  entry_id uuid,
  token uuid,
  new_name text,
  new_message text
)
returns public.guestbook_entries
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.guestbook_entries;
begin
  if char_length(new_name) < 1 or char_length(new_name) > 50 then
    raise exception 'invalid_name';
  end if;
  if char_length(new_message) < 1 or char_length(new_message) > 500 then
    raise exception 'invalid_message';
  end if;

  update public.guestbook_entries
  set name = new_name, message = new_message, updated_at = now()
  where id = entry_id and edit_token = token
  returning * into result;

  if result is null then
    raise exception 'not_found_or_forbidden';
  end if;

  return result;
end;
$$;

-- RPC: delete with edit_token verification
create or replace function public.delete_guestbook_entry(
  entry_id uuid,
  token uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.guestbook_entries
  where id = entry_id and edit_token = token;

  if not found then
    raise exception 'not_found_or_forbidden';
  end if;
end;
$$;

grant execute on function public.update_guestbook_entry to anon;
grant execute on function public.delete_guestbook_entry to anon;

-- Realtime
alter publication supabase_realtime add table public.guestbook_entries;
