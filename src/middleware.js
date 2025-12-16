import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const adminToken = request.cookies.get("adminToken")?.value || "";

  const isPublicPath = pathname === "/login";

  var ligalcookies = { token: true, adminToken: true, isAuthenticated: true };

  let isAuthenticated = false;
  const cookies = request.cookies || {};

  function checkIllegalCookies() {
    for (const [name, value] of Object.entries(cookies)) {
      if (!ligalcookies.hasOwnProperty(name)) {
        // delete cookie properly
        request.cookies.delete(name);
      }
    }
  }
  try {
    checkIllegalCookies();
  } catch (error) {
    console.error("Error checking illegal cookies:", error);
  }

  if (adminToken) {
    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/verify", {
        method: "GET",
        headers: {
          Cookie: adminToken, // MUST forward manually
        },
      });

      const data = await res.json();
      console.log("Middleware verify response:", data);
      if (res.ok && data?.success) {
        isAuthenticated = true;
      }
    } catch (err) {
      console.error("Middleware verify error:", err);
    }
  }

  function logoutUser() {
    const response = NextResponse.next();
    response.cookies.delete("adminToken");
    return response;
  }

  if (!isAuthenticated && !isPublicPath) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("adminToken");
    return response;
  }

  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
