import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "./lib/session";

export default async function proxy(request: NextRequest) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/user/:path*",
};
