"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "../types/user";
import { deleteUser, getUsers } from "../services/user-service";
import { getApiErrorMessage } from "@/lib/api/errors";

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  removeUser: (id: number) => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setError(null);

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "No se pudieron cargar los usuarios."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError(null);

        const data = await getUsers();

        if (!cancelled) {
          setUsers(data);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            getApiErrorMessage(
              error,
              "No se pudieron cargar los usuarios."
            )
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshUsers = useCallback(async () => {
    setIsLoading(true);
    await loadUsers();
  }, [loadUsers]);

  const removeUser = useCallback(
    async (id: number) => {
      try {
        setError(null);

        await deleteUser(id);

        await loadUsers();
      } catch (error) {
        setError(
          getApiErrorMessage(
            error,
            "No se pudo desactivar el usuario."
          )
        );

        throw error;
      }
    },
    [loadUsers]
  );

  return {
    users,
    isLoading,
    error,
    refreshUsers,
    removeUser,
  };
}