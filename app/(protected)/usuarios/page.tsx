"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { getApiErrorMessage } from "@/lib/api/errors";

import { UserForm } from "@/features/users/components/UserForm";
import { UserRolesSummary } from "@/features/users/components/UserRolesSummary";
import { UserStats } from "@/features/users/components/UserStats";
import { UserTable } from "@/features/users/components/UserTable";

import { useUsers } from "@/features/users/hooks/use-users";

import { useSaveUser } from "@/features/users/hooks/use-save-user";

import type {
  User,
  UserRequest,
  UserUpdateRequest,
} from "@/features/users/types/user";

export default function UsuariosPage() {
  const {
    users,
    isLoading,
    error,
    refreshUsers,
  } = useUsers();

  const { saveUser } = useSaveUser();

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  function handleNewUser() {
    setSelectedUser(null);
    setIsFormOpen(true);
  }

  function handleEditUser(user: User) {
    setSelectedUser(user);
    setIsFormOpen(true);
  }

  function handleCancel() {
    setSelectedUser(null);
    setIsFormOpen(false);
  }

  async function handleSaveUser(
    data: UserRequest | UserUpdateRequest,
  ) {
    try {
      await saveUser({
        user: selectedUser,
        data,
      });

      setSelectedUser(null);
      setIsFormOpen(false);
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          selectedUser
            ? "No se pudo actualizar el usuario."
            : "No se pudo crear el usuario.",
        ),
      );
    }
  }

  async function handleToggleStatus(
    user: User,
  ): Promise<void> {
    try {
      await saveUser({
        user,
        data: {
          username: user.username,
          rol: user.rol,
          estado: !user.estado,
        },
      });
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          user.estado
            ? "No se pudo desactivar el usuario."
            : "No se pudo activar el usuario.",
        ),
      );
    }
  }

  return (
    <main className="min-h-full bg-background px-4 py-6 text-on-surface sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Usuarios
            </h1>

            <p className="mt-1 text-sm text-outline">
              Cuentas y accesos al sistema.
            </p>
          </div>

          <button
            type="button"
            onClick={handleNewUser}
            className="flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-primary-container px-4 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            <Plus size={17} />
            Nuevo usuario
          </button>
        </div>

        {/* KPIs */}
        <UserStats users={users} />

        {/* Workspace */}
        <div className="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-12">

          {/* Tabla */}
          <UserTable
            users={users}
            isLoading={isLoading}
            error={error}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEditUser}
            onRetry={refreshUsers}
          />

          {/* Resumen de roles */}
          <UserRolesSummary users={users} />

        </div>
      </div>

      {/* Modal crear / editar usuario */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCancel();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
            <UserForm
              key={selectedUser?.id ?? "new"}
              user={selectedUser}
              onSave={handleSaveUser}
              onCancel={handleCancel}
              onReset={handleNewUser}
            />
          </div>
        </div>
      )}
    </main>
  );
}