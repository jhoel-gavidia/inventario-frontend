"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "../services/auth-service";

export function useAuth() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function validateSession() {
      try {
        await checkSession();
        setIsAuthenticated(true);
      } catch {
        router.replace("/auth/login");
      } finally {
        setIsChecking(false);
      }
    }

    validateSession();
  }, [router]);

  return {
    isAuthenticated,
    isChecking,
  };
}