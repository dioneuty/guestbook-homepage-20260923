import type { GuestbookEntry } from "@/lib/types";

export function toPublicEntry(row: Record<string, unknown>): GuestbookEntry {
  return {
    id: String(row.id),
    name: String(row.name),
    message: String(row.message),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function mergeEntry(
  entries: GuestbookEntry[],
  entry: GuestbookEntry,
): GuestbookEntry[] {
  if (entries.some((item) => item.id === entry.id)) {
    return entries;
  }
  return [entry, ...entries];
}

export function replaceEntry(
  entries: GuestbookEntry[],
  entry: GuestbookEntry,
): GuestbookEntry[] {
  return entries.map((item) => (item.id === entry.id ? entry : item));
}

export function removeEntry(
  entries: GuestbookEntry[],
  id: string,
): GuestbookEntry[] {
  return entries.filter((item) => item.id !== id);
}
