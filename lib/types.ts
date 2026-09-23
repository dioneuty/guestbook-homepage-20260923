export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
  updated_at: string;
};

export type GuestbookEntryWithToken = GuestbookEntry & {
  edit_token: string;
};

export const GUESTBOOK_LIMITS = {
  nameMax: 50,
  messageMax: 500,
} as const;
