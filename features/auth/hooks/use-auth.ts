"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { checkSession } from "../services/auth-service";

export function useAuth() {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function validateSession() {
      try {
        await checkSession();
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
  };
}