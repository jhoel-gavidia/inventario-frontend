"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createUser,
  updateUser,
} from "../services/user-service";
import { usersQueryKey } from "./use-users";
import type {
  User,
  UserRequest,
  UserUpdateRequest,
} from "../types/user";

interface SaveUserInput {
  user: User | null;
  data: UserRequest | UserUpdateRequest;
}

export function useSaveUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ user, data }: SaveUserInput) =>
      user
        ? updateUser(user.id, data as UserUpdateRequest)
        : createUser(data as UserRequest),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: usersQueryKey,
      }),
  });

  return {
    saveUser: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}