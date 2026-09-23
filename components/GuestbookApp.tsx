"use client";

import { useEffect, useState } from "react";
import { GuestbookForm } from "@/components/GuestbookForm";
import { GuestbookList } from "@/components/GuestbookList";
import { createClient } from "@/lib/supabase/client";
import {
  mergeEntry,
  removeEntry,
  replaceEntry,
  toPublicEntry,
} from "@/lib/guestbook-utils";
import type { GuestbookEntry } from "@/lib/types";

type GuestbookAppProps = {
  initialEntries: GuestbookEntry[];
};

export function GuestbookApp({ initialEntries }: GuestbookAppProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [realtimeError, setRealtimeError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("guestbook")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guestbook_entries" },
        (payload) => {
          if (payload.eventType === "INSERT" && payload.new) {
            setEntries((current) =>
              mergeEntry(current, toPublicEntry(payload.new as Record<string, unknown>)),
            );
            return;
          }

          if (payload.eventType === "UPDATE" && payload.new) {
            setEntries((current) =>
              replaceEntry(
                current,
                toPublicEntry(payload.new as Record<string, unknown>),
              ),
            );
            return;
          }

          if (payload.eventType === "DELETE" && payload.old) {
            const deletedId = String((payload.old as { id: string }).id);
            setEntries((current) => removeEntry(current, deletedId));
          }
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          setRealtimeError("실시간 연결에 실패했습니다. 페이지를 새로고침해 주세요.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-8">
      <GuestbookForm
        onCreated={(entry) => {
          setEntries((current) => mergeEntry(current, entry));
        }}
      />

      {realtimeError && (
        <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {realtimeError}
        </p>
      )}

      <GuestbookList
        entries={entries}
        onUpdated={(entry) => {
          setEntries((current) => replaceEntry(current, entry));
        }}
        onDeleted={(id) => {
          setEntries((current) => removeEntry(current, id));
        }}
      />
    </div>
  );
}
