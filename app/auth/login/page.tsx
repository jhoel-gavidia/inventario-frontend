"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { login } from "@/features/auth/services/auth-service";
import { useSession } from "@/features/auth/hooks/use-session";
import { resetSessionCache } from "@/features/auth/session-cache";

export default function LoginPage() {
  const router = useRouter();

  const { user: existingUser } = useSession();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingUser) {
      router.replace("/dashboard");
    }
  }, [existingUser, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({
        username,
        password,
      });

      resetSessionCache();

      router.replace("/dashboard");
    } catch {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  }

return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-primary-container/10 blur-3xl" />

      <section className="relative w-full max-w-md rounded-xl bg-surface-container-lowest p-8 shadow-xl">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <span className="text-sm font-bold tracking-tight text-white">
              R&S
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            R&S Jhoelito
          </h1>

          <p className="mt-2 text-sm leading-6 text-secondary">
            Ingresa tus credenciales de administrador para gestionar el
            inventario del taller.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <UserRound size={16} className="text-secondary" />

              <label
                htmlFor="username"
                className="text-sm font-medium text-on-surface"
              >
                Usuario
              </label>
            </div>

            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Ingresa tu usuario"
              autoComplete="username"
              required
              disabled={loading}
              className="w-full rounded-lg border border-outline/30 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <label
                htmlFor="password"
                className="text-sm font-medium text-on-surface"
              >
                Contraseña
              </label>

              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-secondary">
                Acceso administrativo
              </span>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full rounded-lg border border-outline/30 bg-surface-container-low px-4 py-3 pr-12 text-sm text-on-surface outline-none transition placeholder:text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-line-error bg-error-container px-4 py-3 text-sm text-error"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                Iniciando sesión
                <LoaderCircle size={18} className="animate-spin" />
              </>
            ) : (
              <>
                Iniciar Sesión
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-7 flex gap-3 rounded-lg bg-surface-container-low p-4">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-primary"
          />

          <div>
            <p className="text-sm font-semibold text-on-surface">
              Conexión segura TLS
            </p>

            <p className="mt-1 text-xs leading-5 text-secondary">
              Acceso restringido y auditado. Las comunicaciones se protegen
              mediante HTTPS/TLS.
            </p>
          </div>
        </div>

        <p className="mt-7 text-center text-xs text-secondary">
          Soporte Técnico • Jhoelito © 2026
        </p>
      </section>
    </main>
  );
}
