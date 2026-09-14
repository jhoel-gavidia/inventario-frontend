import { isAxiosError } from "axios";

interface ApiErrorData {
  message?: string;
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorData | undefined;

    if (data?.message) {
      return data.message;
    }

    if (error.response) {
      return `Error del servidor (${error.response.status}).`;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function isServerValidationError(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;

  return status !== undefined && status >= 400 && status < 500;
}

export function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response;
}