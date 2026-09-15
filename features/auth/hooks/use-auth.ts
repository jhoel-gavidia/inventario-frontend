"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "./use-session";

export function useAuth() {
  const router = useRouter();
  const { isChecking, user } = useSession();

  useEffect(() => {
    if (!isChecking && !user) {
      router.replace("/auth/login");
    }
  }, [isChecking, user, router]);

  return {
    isChecking,
    user,
    isAdmin: user?.rol === "ADMIN",
  };
}