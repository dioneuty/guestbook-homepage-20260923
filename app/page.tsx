import { GuestbookApp } from "@/components/GuestbookApp";
import { createClient } from "@/lib/supabase/server";
import type { GuestbookEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("guestbook_entries")
    .select("id, name, message, created_at, updated_at")
    .order("created_at", { ascending: false });

  const initialEntries = (data ?? []) as GuestbookEntry[];

  return (
    <div className="min-h-full bg-zinc-50">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
        <header className="space-y-2 text-center sm:text-left">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Guestbook
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            실시간 방명록
          </h1>
          <p className="text-sm leading-6 text-zinc-600">
            방문자의 메시지가 Supabase Realtime으로 즉시 반영됩니다.
          </p>
        </header>

        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            방명록을 불러오지 못했습니다. Supabase 테이블과 RLS 설정을 확인해 주세요.
            <p className="mt-2 text-xs text-red-600">{error.message}</p>
          </div>
        ) : (
          <GuestbookApp initialEntries={initialEntries} />
        )}
      </main>
    </div>
  );
}
