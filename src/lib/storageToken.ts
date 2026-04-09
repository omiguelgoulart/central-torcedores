import Cookies from "js-cookie";

const AUTH_COOKIE = "auth";
const DEFAULT_AUTH_COOKIE_MAX_AGE_MINUTES = 120;

function getAuthCookieMaxAgeMinutes(): number {
    const raw = process.env.NEXT_PUBLIC_AUTH_COOKIE_MAX_AGE_MINUTES;
    const parsed = Number(raw);

    if (!Number.isFinite(parsed) || parsed <= 0) {
        return DEFAULT_AUTH_COOKIE_MAX_AGE_MINUTES;
    }

    return parsed;
}

function getCookieExpiresDays(minutes: number): number {
    return minutes / (24 * 60);
}

function decodeJwtPayload(token: string): { exp?: number } | null {
    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;

        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
        const json = atob(padded);

        return JSON.parse(json) as { exp?: number };
    } catch {
        return null;
    }
}

function isJwtExpired(token: string): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return false;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowInSeconds;
}

export function getToken(): string | undefined {
    try {
        const raw = Cookies.get(AUTH_COOKIE);
        if (!raw) return undefined;

        const parsed = JSON.parse(raw) as { token?: string };
        if (!parsed?.token) return undefined;

        if (isJwtExpired(parsed.token)) {
            removeAuthCookie();
            return undefined;
        }

        return parsed?.token;
    } catch {
        return undefined;
    }
}

export function setAuthCookie(data: Record<string, unknown>) {
    const maxAgeMinutes = getAuthCookieMaxAgeMinutes();

    Cookies.set(AUTH_COOKIE, JSON.stringify(data), {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: getCookieExpiresDays(maxAgeMinutes),
    });
}

export function removeAuthCookie() {
    Cookies.remove(AUTH_COOKIE);
}

