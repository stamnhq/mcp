const BASE_URL = "https://api.stamn.com";

type Success<T> = { ok: true; data: T };
type Failure = { ok: false; error: string };
export type Result<T> = Success<T> | Failure;

export async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  apiKey?: string,
): Promise<Result<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) headers["X-API-Key"] = apiKey;

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const json = (await res.json()) as Record<string, unknown>;

    if (!res.ok) {
      const msg =
        (json.message as string) || (json.error as string) || res.statusText;
      return { ok: false, error: `${res.status}: ${msg}` };
    }

    return { ok: true, data: json.data as T };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
