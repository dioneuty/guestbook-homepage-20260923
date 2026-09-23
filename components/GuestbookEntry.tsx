"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getEditToken,
  removeEditToken,
} from "@/lib/edit-token-store";
import { formatDateTime } from "@/lib/format";
import { toPublicEntry } from "@/lib/guestbook-utils";
import { GUESTBOOK_LIMITS, type GuestbookEntry } from "@/lib/types";

type GuestbookEntryProps = {
  entry: GuestbookEntry;
  onUpdated: (entry: GuestbookEntry) => void;
  onDeleted: (id: string) => void;
};

export function GuestbookEntryItem({
  entry,
  onUpdated,
  onDeleted,
}: GuestbookEntryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(entry.name);
  const [message, setMessage] = useState(entry.message);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = Boolean(getEditToken(entry.id));

  async function handleUpdate() {
    const token = getEditToken(entry.id);
    if (!token) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) {
      setError("이름과 메시지를 모두 입력해 주세요.");
      return;
    }

    setError(null);
    setIsSaving(true);

    const supabase = createClient();
    const { data, error: updateError } = await supabase.rpc(
      "update_guestbook_entry",
      {
        entry_id: entry.id,
        token,
        new_name: trimmedName,
        new_message: trimmedMessage,
      },
    );

    if (updateError || !data) {
      setError(updateError?.message ?? "수정에 실패했습니다.");
      setIsSaving(false);
      return;
    }

    onUpdated(toPublicEntry(data as Record<string, unknown>));
    setIsEditing(false);
    setIsSaving(false);
  }

  async function handleDelete() {
    const token = getEditToken(entry.id);
    if (!token) {
      return;
    }

    if (!window.confirm("이 방명록을 삭제할까요?")) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    const supabase = createClient();
    const { error: deleteError } = await supabase.rpc("delete_guestbook_entry", {
      entry_id: entry.id,
      token,
    });

    if (deleteError) {
      setError(deleteError.message ?? "삭제에 실패했습니다.");
      setIsDeleting(false);
      return;
    }

    removeEditToken(entry.id);
    onDeleted(entry.id);
    setIsDeleting(false);
  }

  function handleCancel() {
    setName(entry.name);
    setMessage(entry.message);
    setError(null);
    setIsEditing(false);
  }

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={GUESTBOOK_LIMITS.nameMax}
            aria-label="이름 수정"
            disabled={isSaving}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          />
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            maxLength={GUESTBOOK_LIMITS.messageMax}
            aria-label="메시지 수정"
            disabled={isSaving}
            className="w-full resize-y rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={isSaving}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:bg-zinc-400"
            >
              {isSaving ? "저장 중..." : "저장"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-zinc-900">
                {entry.name}
              </h3>
              <time
                dateTime={entry.created_at}
                className="mt-1 block text-xs text-zinc-500"
              >
                {formatDateTime(entry.created_at)}
                {entry.updated_at !== entry.created_at && " · 수정됨"}
              </time>
            </div>

            {canEdit && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  disabled={isDeleting}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  {isDeleting ? "삭제 중..." : "삭제"}
                </button>
              </div>
            )}
          </header>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
            {entry.message}
          </p>
        </>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </article>
  );
}
