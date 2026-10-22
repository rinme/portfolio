import { SignJWT, jwtVerify } from "jose";
import type { Cookies } from "@sveltejs/kit";

export const SESSION_COOKIE_NAME = "admin_session";
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "portfolio_super_secure_admin_jwt_secret_key_2026"
);

export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function createAdminSession(cookies: Cookies): Promise<string> {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

export async function verifyAdminSession(cookies: Cookies): Promise<boolean> {
  try {
    const token = cookies.get(SESSION_COOKIE_NAME);
    if (!token) return false;

    const { payload } = await jwtVerify(token, SECRET);
    return payload.admin === true;
  } catch {
    return false;
  }
}

export function destroyAdminSession(cookies: Cookies): void {
  cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
}
