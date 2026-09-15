import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    (process.env.NODE_ENV === "development"
      ? "http://localhost:8080/api/v1"
      : ""),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      typeof window !== "undefined" &&
      axios.isAxiosError(error)
    ) {
      const status = error.response?.status;
      const url = error.config?.url ?? "";
      const isAuthFlow = url.includes("/auth/");
      const alreadyOnLogin =
        window.location.pathname === "/auth/login";

      if (
        (status === 401 || status === 403) &&
        !isAuthFlow &&
        !alreadyOnLogin
      ) {
        // Recarga dura para vaciar caches de memoria (React Query y sesión).
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign("/auth/login");
      }
    }

    return Promise.reject(error);
  },
);