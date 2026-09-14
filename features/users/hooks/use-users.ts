"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/user-service";
import type { User } from "../types/user";

export const usersQueryKey = ["usuarios"] as const;

function getQueryError(error: unknown): string | null {
  if (!error) {
    return null;
  }

  return "No se pudieron cargar los usuarios.";
}

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const query = useQuery({
    queryKey: usersQueryKey,
    queryFn: getUsers,
    retry: false,
  });

  return {
    users: query.data ?? [],
    isLoading: query.isLoading,
    error: getQueryError(query.error),
    refreshUsers: async () => {
      await query.refetch();
    },
  };
}