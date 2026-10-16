export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ProblemDetailsPayload {
  title?: string;
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "https://comven-mini-billing-backend.onrender.com").replace(/\/$/, "");

function resolveApiUrl(input: RequestInfo | URL): RequestInfo | URL {
  if (!apiBaseUrl) {
    return input;
  }

  if (typeof input === "string" && input.startsWith("/api/")) {
    return `${apiBaseUrl}${input}`;
  }

  if (input instanceof URL && input.pathname.startsWith("/api/")) {
    return new URL(`${input.pathname}${input.search}${input.hash}`, `${apiBaseUrl}/`);
  }

  if (input instanceof Request && new URL(input.url).pathname.startsWith("/api/")) {
    return new Request(`${apiBaseUrl}${new URL(input.url).pathname}${new URL(input.url).search}`, input);
  }

  return input;
}

function safeParseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string") {
    return payload || fallback;
  }

  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const problem = payload as ProblemDetailsPayload;
  const validationErrors = problem.errors
    ? Object.values(problem.errors).flat().filter(Boolean)
    : [];

  return (
    validationErrors[0] ||
    problem.detail ||
    problem.message ||
    problem.title ||
    fallback
  );
}

export async function requestJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(resolveApiUrl(input), init);
  const text = await response.text();
  const payload = text ? safeParseJson(text) : null;

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload, "A API retornou um erro."),
      response.status,
    );
  }

  return payload as T;
}
