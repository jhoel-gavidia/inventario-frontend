import { getCurrentUser } from "./services/auth-service";
import type { SessionUser } from "./types/auth";

let currentUserPromise: Promise<SessionUser | null> | null = null;

export function getSessionUser(): Promise<SessionUser | null> {
  if (!currentUserPromise) {
    currentUserPromise = getCurrentUser()
      .then((user) => user)
      .catch(() => null);
  }

  return currentUserPromise;
}

export function resetSessionCache(): void {
  currentUserPromise = null;
}