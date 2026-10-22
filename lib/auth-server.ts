import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  isSessionValid,
  readSessionToken,
  type SessionUser,
} from "@/lib/auth";

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const session = readSessionToken(store.get(SESSION_COOKIE)?.value);
  return isSessionValid(session) ? session : null;
}
