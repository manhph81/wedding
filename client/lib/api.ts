import type { ApiErrorBody } from "@shared/api";

/** Base URL của API (relative tới origin, default `/api/v1`). */
export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "/api/v1";

export class ApiError extends Error {
  status: number;
  messageId?: string;
  body?: unknown;

  constructor(
    status: number,
    message: string,
    opts?: { messageId?: string; body?: unknown },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.messageId = opts?.messageId;
    this.body = opts?.body;
  }
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = new Headers(init?.headers);
  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...init,
    method,
    headers,
    body: body === undefined ? init?.body : JSON.stringify(body),
  });

  if (!res.ok) {
    let errBody: ApiErrorBody | undefined;
    try {
      errBody = (await res.json()) as ApiErrorBody;
    } catch {
      // body not JSON — ignore
    }
    throw new ApiError(res.status, errBody?.message ?? res.statusText, {
      messageId: errBody?.message_id,
      body: errBody,
    });
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}

export const api = {
  get: <T>(path: string, init?: RequestInit) =>
    request<T>("GET", path, undefined, init),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>("POST", path, body, init),
  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>("PUT", path, body, init),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>("PATCH", path, body, init),
  delete: <T>(path: string, init?: RequestInit) =>
    request<T>("DELETE", path, undefined, init),
};
