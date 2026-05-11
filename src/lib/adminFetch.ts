import Cookies from "js-cookie";

function getAdminToken(): string | null {
  return Cookies.get("adminToken") ?? null;
}

export function adminAuthHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...adminAuthHeaders(),
      ...(options.headers as Record<string, string> | undefined),
    },
  });
}
