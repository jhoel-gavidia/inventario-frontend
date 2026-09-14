"use client";

import {
  Check,
  Edit3,
  Power,
  Search,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { User, UserRole } from "../types/user";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  error: string | null;
  onToggleStatus: (user: User) => Promise<void>;
  onEdit: (user: User) => void;
  onRetry: () => void;
}

type RoleFilter = "ALL" | UserRole;
type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export function UserTable({
  users,
  isLoading,
  error,
  onToggleStatus,
  onEdit,
  onRetry,
}: UserTableProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");
  const [processingId, setProcessingId] =
    useState<number | null>(null);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.username.toLowerCase().includes(term) ||
        String(user.id).includes(term);

      const matchesRole =
        roleFilter === "ALL" ||
        user.rol === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.estado) ||
        (statusFilter === "INACTIVE" && !user.estado);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  async function handleToggleStatus(user: User) {
    try {
      setProcessingId(user.id);
      await onToggleStatus(user);
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <section className="min-w-0 xl:col-span-8">
      <div className="rounded-xl border border-[#e5e7ef] bg-white">
        {/* Header */}
        <div className="border-b border-[#eef0f5] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#0b1c30]">
                Directorio de Usuarios
              </h3>

              <p className="mt-1 text-xs text-[#737686]">
                Credenciales y nivel de acceso
              </p>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="border-b border-[#eef0f5] px-5 py-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Buscar usuario..."
                className="h-10 w-full rounded-lg border border-[#dfe2ea] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#737686] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
              />
            </div>

            <div className="flex items-center overflow-x-auto rounded-lg border border-[#e5e7ef] bg-[#f8f9ff] p-1">
              <FilterButton
                active={
                  roleFilter === "ALL" &&
                  statusFilter === "ALL"
                }
                onClick={() => {
                  setRoleFilter("ALL");
                  setStatusFilter("ALL");
                }}
              >
                Todos
              </FilterButton>

              <FilterButton
                active={roleFilter === "ADMIN"}
                onClick={() => setRoleFilter("ADMIN")}
              >
                ADMIN
              </FilterButton>

              <FilterButton
                active={roleFilter === "USER"}
                onClick={() => setRoleFilter("USER")}
              >
                USER
              </FilterButton>

              <FilterButton
                active={statusFilter === "ACTIVE"}
                onClick={() => setStatusFilter("ACTIVE")}
              >
                Activos
              </FilterButton>

              <FilterButton
                active={statusFilter === "INACTIVE"}
                onClick={() =>
                  setStatusFilter("INACTIVE")
                }
              >
                Inactivos
              </FilterButton>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-175 text-left">
            <thead>
              <tr className="border-b border-[#eef0f5] text-xs uppercase tracking-wide text-[#737686]">
                <th className="w-16 px-5 py-3 text-center font-medium">
                  ID
                </th>

                <th className="px-5 py-3 font-medium">
                  Usuario
                </th>

                <th className="px-5 py-3 font-medium">
                  Rol
                </th>

                <th className="px-5 py-3 font-medium">
                  Estado
                </th>

                <th className="px-5 py-3 text-right font-medium">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f0f1f5]">
              {isLoading ? (
                <LoadingRows />
              ) : error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-14 text-center"
                  >
                    <p className="text-sm font-medium text-[#ba1a1a]">
                      No se pudieron cargar los usuarios.
                    </p>

                    <button
                      type="button"
                      onClick={onRetry}
                      className="mt-2 text-xs font-medium text-[#2563eb] hover:underline"
                    >
                      Reintentar
                    </button>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <EmptyState />
              ) : (
                filteredUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    processing={
                      processingId === user.id
                    }
                    onEdit={onEdit}
                    onToggle={() =>
                      void handleToggleStatus(user)
                    }
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#eef0f5] px-5 py-4">
          <span className="text-xs text-[#737686]">
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1
              ? "usuario"
              : "usuarios"}
          </span>

          <span className="text-xs text-[#737686]">
            Vista completa
          </span>
        </div>
      </div>
    </section>
  );
}

function UserRow({
  user,
  processing,
  onEdit,
  onToggle,
}: {
  user: User;
  processing: boolean;
  onEdit: (user: User) => void;
  onToggle: () => void;
}) {
  const initial = user.username
    .charAt(0)
    .toUpperCase();

  return (
    <tr
      className={`transition hover:bg-[#fafbff] ${
        !user.estado ? "bg-[#f8f9ff]" : ""
      }`}
    >
      <td className="px-5 py-4 text-center font-mono text-xs font-medium text-[#737686]">
        #{user.id}
      </td>

      <td className="px-5 py-4">
        <div
          className={`flex items-center gap-2.5 ${
            !user.estado ? "opacity-80" : ""
          }`}
        >
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-bold ${
              user.estado
                ? "bg-[#eff4ff] text-[#2563eb]"
                : "bg-[#f1f3f7] text-[#737686]"
            }`}
          >
            {initial}
          </div>

          <span
            className={`rounded-full bg-[#eff4ff] px-2.5 py-1 font-mono text-xs ${
              user.estado
                ? "font-semibold text-[#2563eb]"
                : "font-medium text-[#737686] line-through"
            }`}
          >
            {user.username}
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        <RoleBadge role={user.rol} />
      </td>

      <td className="px-5 py-4">
        <StatusBadge active={user.estado} />
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(user)}
            title="Editar usuario"
            aria-label={`Editar ${user.username}`}
            className="rounded-lg p-2 text-[#737686] transition hover:bg-[#eff4ff] hover:text-[#2563eb]"
          >
            <Edit3 size={16} />
          </button>

          <button
            type="button"
            onClick={onToggle}
            disabled={processing}
            title={
              user.estado
                ? "Desactivar usuario"
                : "Activar usuario"
            }
            aria-label={
              user.estado
                ? `Desactivar ${user.username}`
                : `Activar ${user.username}`
            }
            className="rounded-lg p-2 text-[#737686] transition hover:bg-[#ecfdf3] hover:text-[#16823b] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {processing ? (
              <span className="block h-4 w-4 animate-spin rounded-full border-2 border-[#e5e7ef] border-t-[#2563eb]" />
            ) : user.estado ? (
              <Power size={16} />
            ) : (
              <Check size={16} />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        role === "ADMIN"
          ? "bg-[#2563eb] text-white"
          : "bg-[#f1f3f7] text-[#434655]"
      }`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        active
          ? "bg-[#ecfdf3] text-[#16823b]"
          : "bg-[#f1f3f7] text-[#737686]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-[#16823b]" : "bg-[#737686]"
        }`}
      />

      {active ? "ACTIVO" : "INACTIVO"}
    </span>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-white text-[#2563eb] shadow-sm"
          : "text-[#737686] hover:text-[#434655]"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <tr>
      <td
        colSpan={5}
        className="px-5 py-14 text-center"
      >
        <div className="mx-auto max-w-sm">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f8] text-[#737686]">
            <UserRound size={18} />
          </div>

          <p className="text-sm font-medium">
            No hay usuarios
          </p>

          <p className="mt-1 text-xs text-[#737686]">
            No se encontraron usuarios con los filtros
            actuales.
          </p>
        </div>
      </td>
    </tr>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <tr key={index}>
          <td colSpan={5} className="px-5 py-4">
            <div className="h-5 animate-pulse rounded bg-[#f1f3f7]" />
          </td>
        </tr>
      ))}
    </>
  );
}