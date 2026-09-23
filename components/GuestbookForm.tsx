"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveEditToken } from "@/lib/edit-token-store";
import { toPublicEntry } from "@/lib/guestbook-utils";
import { GUESTBOOK_LIMITS, type GuestbookEntry } from "@/lib/types";

type GuestbookFormProps = {
  onCreated: (entry: GuestbookEntry) => void;
};

export function GuestbookForm({ onCreated }: GuestbookFormProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) {
      setError("이름과 메시지를 모두 입력해 주세요.");
      setIsSubmitting(false);
      return;
    }

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("guestbook_entries")
      .insert({ name: trimmedName, message: trimmedMessage })
      .select("id, name, message, edit_token, created_at, updated_at")
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? "방명록 작성에 실패했습니다.");
      setIsSubmitting(false);
      return;
    }

    if (data.edit_token) {
      saveEditToken(data.id, data.edit_token);
    }

    onCreated(toPublicEntry(data));
    setName("");
    setMessage("");
    setIsSubmitting(false);
  }

  return (
    <section
      aria-labelledby="guestbook-form-title"
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <h2
        id="guestbook-form-title"
        className="text-lg font-semibold text-zinc-900"
      >
        방명록 남기기
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        이름과 메시지를 입력하면 실시간으로 목록에 반영됩니다.
      </p>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="guestbook-name" className="sr-only">이름</label>
          <input
            id="guestbook-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="이름"
            required
            maxLength={GUESTBOOK_LIMITS.nameMax}
            aria-label="이름"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-50"
          />
        </div>

        <div>
          <label htmlFor="guestbook-message" className="sr-only">메시지</label>
          <textarea
            id="guestbook-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="메시지를 남겨 주세요"
            required
            rows={4}
            maxLength={GUESTBOOK_LIMITS.messageMax}
            aria-label="메시지"
            disabled={isSubmitting}
            className="w-full resize-y rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-50"
          />
          <p className="mt-1 text-right text-xs text-zinc-400">
            {message.length}/{GUESTBOOK_LIMITS.messageMax}
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isSubmitting ? "등록 중..." : "등록하기"}
        </button>
      </form>
    </section>
  );
}
