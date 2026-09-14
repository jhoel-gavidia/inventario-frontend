"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "../services/auth-service";
import type { SessionUser } from "../types/auth";

export function useAuth() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    async function validateSession() {
      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);
      } catch {
        router.replace("/auth/login");
      } finally {
        setIsChecking(false);
      }
    }

    validateSession();
  }, [router]);

  return {
    isChecking,
    user,
    isAdmin: user?.rol === "ADMIN",
  };
}