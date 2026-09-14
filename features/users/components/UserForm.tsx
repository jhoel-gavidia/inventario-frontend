"use client";

import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
} from "lucide-react";

import { useState, type FormEvent } from "react";

import {
  getApiErrorMessage,
  isServerValidationError,
} from "@/lib/api/errors";

import type {
  User,
  UserRequest,
  UserRole,
  UserUpdateRequest,
} from "../types/user";

interface UserFormProps {
  user: User | null;
  onSave: (
    data: UserRequest | UserUpdateRequest,
  ) => Promise<void>;
  onCancel: () => void;
  onReset: () => void;
}

export function UserForm({
  user,
  onSave,
  onCancel,
  onReset,
}: UserFormProps) {
  const [username, setUsername] = useState(
    user?.username ?? "",
  );

  const [password, setPassword] = useState("");

  const [rol, setRol] = useState<UserRole>(
    user?.rol ?? "USER",
  );

  const [estado, setEstado] = useState(
    user?.estado ?? true,
  );

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [fieldError, setFieldError] =
    useState<string | null>(null);

  const [serverError, setServerError] =
    useState<string | null>(null);

  const isEditing = user !== null;

  const normalizedUsername = username.trim();

  const isInvalid =
    normalizedUsername.length < 4 ||
    normalizedUsername.length > 50 ||
    (!isEditing && password.length < 8) ||
    isSaving;

  function clearErrors() {
    setFieldError(null);
    setServerError(null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isInvalid) {
      return;
    }

    try {
      setIsSaving(true);
      clearErrors();

      if (isEditing) {
        await onSave({
          username: normalizedUsername,
          rol,
          estado,
        });
      } else {
        await onSave({
          username: normalizedUsername,
          password,
          rol,
          estado,
        });
      }
    } catch (requestError) {
      if (isServerValidationError(requestError)) {
        setFieldError(
          getApiErrorMessage(
            requestError,
            "Los datos del usuario no son válidos.",
          ),
        );
      } else {
        setServerError(
          getApiErrorMessage(
            requestError,
            "No se pudo conectar con el servidor.",
          ),
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setUsername(user?.username ?? "");
    setPassword("");
    setRol(user?.rol ?? "USER");
    setEstado(user?.estado ?? true);

    clearErrors();

    onReset();
  }

  function handleCancel() {
    clearErrors();
    onCancel();
  }

  const inputClassName =
    "h-10 w-full rounded-lg border bg-white px-3 text-sm text-[#0b1c30] outline-none transition placeholder:text-[#9a9dab] focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#f3f4f7]";

  const inputBorderClassName = fieldError
    ? "border-[#d38a8a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/10"
    : "border-[#dfe2ea] focus:border-[#2563eb] focus:ring-[#2563eb]/10";

  return (
    <div className="sticky top-6">
      <div className="rounded-xl border border-[#e5e7ef] bg-white">

        {/* Header */}
        <div className="border-b border-[#eef0f5] px-5 py-5">
          <div className="flex items-start justify-between gap-4">

            <div>
              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff4ff] text-[#2563eb]">
                  <CheckCircle size={17} />
                </div>

                <h2 className="font-semibold">
                  {isEditing
                    ? "Editar Usuario"
                    : "Nuevo Usuario"}
                </h2>

              </div>

              <p className="mt-2 text-xs leading-5 text-[#737686]">
                {isEditing
                  ? "Actualiza los datos, rol y estado de la cuenta."
                  : "Crea una cuenta para acceder al sistema del taller."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              title="Restablecer formulario"
              aria-label="Restablecer formulario"
              className="rounded-lg p-2 text-[#737686] transition hover:bg-[#eff4ff] hover:text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshCw size={17} />
            </button>

          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          {/* Username */}
          <div>
            <div className="mb-2 flex items-center justify-between">

              <label
                htmlFor="user-username"
                className="text-xs font-semibold text-[#0b1c30]"
              >
                Nombre de usuario
              </label>

              <span className="text-[11px] text-[#737686]">
                {username.length}/50
              </span>

            </div>

            <input
              id="user-username"
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                clearErrors();
              }}
              placeholder="Ej. operador01"
              maxLength={50}
              disabled={isSaving}
              autoComplete="username"
              aria-invalid={fieldError !== null}
              className={`${inputClassName} ${inputBorderClassName}`}
            />

            {fieldError ? (
              <p className="mt-1.5 flex items-start gap-1 text-xs text-[#ba1a1a]">
                <AlertCircle
                  size={14}
                  className="mt-0.5 shrink-0"
                />

                {fieldError}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-[#737686]">
                Usa un nombre claro para identificar la cuenta.
              </p>
            )}
          </div>

          {/* Password */}
          {!isEditing && (
            <div>
              <label
                htmlFor="user-password"
                className="mb-2 block text-xs font-semibold text-[#0b1c30]"
              >
                Contraseña
              </label>

              <div className="relative">
                <input
                  id="user-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearErrors();
                  }}
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  disabled={isSaving}
                  autoComplete="new-password"
                  className={`${inputClassName} pr-10`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value,
                    )
                  }
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#737686] hover:bg-[#eff4ff] hover:text-[#2563eb]"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-[#737686]">
                La contraseña debe tener al menos 8 caracteres.
              </p>
            </div>
          )}

          {/* Role */}
          <div>
            <label
              htmlFor="user-role"
              className="mb-2 block text-xs font-semibold text-[#0b1c30]"
            >
              Rol
            </label>

            <select
              id="user-role"
              value={rol}
              onChange={(event) =>
                setRol(
                  event.target.value as UserRole,
                )
              }
              disabled={isSaving}
              className={`${inputClassName} border-[#dfe2ea] focus:border-[#2563eb] focus:ring-[#2563eb]/10`}
            >
              <option value="USER">
                USER — Operación Taller
              </option>

              <option value="ADMIN">
                ADMIN — Control Total
              </option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="user-status"
              className="mb-2 block text-xs font-semibold text-[#0b1c30]"
            >
              Estado
            </label>

            <select
              id="user-status"
              value={estado ? "true" : "false"}
              onChange={(event) =>
                setEstado(
                  event.target.value === "true",
                )
              }
              disabled={isSaving}
              className={`${inputClassName} border-[#dfe2ea] focus:border-[#2563eb] focus:ring-[#2563eb]/10`}
            >
              <option value="true">
                Activo
              </option>

              <option value="false">
                Inactivo
              </option>
            </select>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="flex items-start gap-2.5 rounded-lg border border-[#f2cccc] bg-[#fff7f7] px-3.5 py-3 text-xs text-[#ba1a1a]">
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0"
              />

              <p>{serverError}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">

            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="h-10 flex-1 rounded-lg border border-[#dfe2ea] px-4 text-sm font-medium text-[#434655] transition hover:bg-[#f8f9ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              disabled={isInvalid}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 text-sm font-medium text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />

                  {isEditing
                    ? "Actualizar usuario"
                    : "Guardar usuario"}
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}