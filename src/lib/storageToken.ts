import Cookies from "js-cookie";

const AUTH_COOKIE = "auth";

export function getToken(): string | undefined {
    try {
        const raw = Cookies.get(AUTH_COOKIE);
        if (!raw) return undefined;

        const parsed = JSON.parse(raw) as { token?: string };
        return parsed?.token;
    } catch {
        return undefined;
    }
}

export function setAuthCookie(data: Record<string, unknown>) {
    Cookies.set(AUTH_COOKIE, JSON.stringify(data), {
        secure: true,
        sameSite: "strict",
    });
}

export function removeAuthCookie() {
    Cookies.remove(AUTH_COOKIE);
}

