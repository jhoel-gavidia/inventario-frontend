"use client";

import { useEffect, useState } from "react";

import { getSessionUser } from "../session-cache";
import type { SessionUser } from "../types/auth";

interface UseSessionReturn {
  isChecking: boolean;
  user: SessionUser | null;
}

export function useSession(): UseSessionReturn {
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let active = true;

    getSessionUser().then((sessionUser) => {
      if (!active) {
        return;
      }

      setUser(sessionUser);
      setIsChecking(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return {
    isChecking,
    user,
  };
}