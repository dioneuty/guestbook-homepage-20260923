"use client";

import { GuestbookEntryItem } from "@/components/GuestbookEntry";
import type { GuestbookEntry } from "@/lib/types";

type GuestbookListProps = {
  entries: GuestbookEntry[];
  isLoading?: boolean;
  onUpdated: (entry: GuestbookEntry) => void;
  onDeleted: (id: string) => void;
};

export function GuestbookList({
  entries,
  isLoading = false,
  onUpdated,
  onDeleted,
}: GuestbookListProps) {
  if (isLoading) {
    return (
      <section
        aria-labelledby="guestbook-list-title"
        className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h2 id="guestbook-list-title" className="text-lg font-semibold text-zinc-900">
          방명록
        </h2>
        <p className="mt-6 text-center text-sm text-zinc-500">불러오는 중...</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="guestbook-list-title"
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="guestbook-list-title" className="text-lg font-semibold text-zinc-900">
          방명록
        </h2>
        <span className="text-sm text-zinc-500">{entries.length}개</span>
      </div>

      {entries.length === 0 ? (
        <p className="mt-6 rounded-xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
          아직 방명록이 없습니다. 첫 메시지를 남겨 보세요.
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {entries.map((entry) => (
            <li key={entry.id}>
              <GuestbookEntryItem
                entry={entry}
                onUpdated={onUpdated}
                onDeleted={onDeleted}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
