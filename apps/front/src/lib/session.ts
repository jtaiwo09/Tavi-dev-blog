import { cookies } from "next/headers";
import { COOKIE_NAME } from "./constants";

// export type SessionUser = {
//   id?: string;
//   name?: string;
//   avatar?: string;
// };

// export type Session = {
//   user: SessionUser;
//   accessToken: string;
// };

export async function createSession(accessToken: string) {
  // const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.APP_ENV === "production",
    sameSite: "lax",
    path: "/",
    // expires: expiredAt,
    maxAge: 30 * 24 * 60 * 60,
  });
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token ?? null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.delete(COOKIE_NAME);
}
