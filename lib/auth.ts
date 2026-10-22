export const SESSION_COOKIE = "omnistock_session";
export const SESSION_MAX_AGE = 60 * 60 * 8;

export type SessionUser = {
  email: string;
  name: string;
  role: string;
  facility: string;
  expiresAt: number;
};

export type SessionDraft = Omit<SessionUser, "expiresAt">;

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function createSessionToken(draft: SessionDraft) {
  const session: SessionUser = {
    ...draft,
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
  };
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function readSessionToken(token?: string | null): SessionUser | null {
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded) as Partial<SessionUser>;

    if (
      typeof parsed.email !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }

    return {
      email: parsed.email,
      name: parsed.name,
      role: parsed.role ?? "Store Staff",
      facility: parsed.facility ?? "#104 Flagship",
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

export function isSessionValid(session: SessionUser | null) {
  return !!session && session.expiresAt > Date.now();
}
