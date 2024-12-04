import authConfig from "@/lib/auth-config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  
  const isPrivateRoute =
    nextUrl.pathname === "/criar-noticia" || nextUrl.pathname === "/editar-noticia";
  const isLoginRoute = nextUrl.pathname === "/login";

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/criar-noticia", "/editar-noticia", "/login"],
};
