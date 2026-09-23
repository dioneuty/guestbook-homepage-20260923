const STORAGE_KEY = "guestbook_edit_tokens";

type TokenMap = Record<string, string>;

function readTokens(): TokenMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as TokenMap;
  } catch {
    return {};
  }
}

function writeTokens(tokens: TokenMap): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function saveEditToken(id: string, token: string): void {
  const tokens = readTokens();
  tokens[id] = token;
  writeTokens(tokens);
}

export function getEditToken(id: string): string | null {
  return readTokens()[id] ?? null;
}

export function removeEditToken(id: string): void {
  const tokens = readTokens();
  delete tokens[id];
  writeTokens(tokens);
}
