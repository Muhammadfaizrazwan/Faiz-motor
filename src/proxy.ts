import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper: extract token payload from NextAuth session cookie (JWT-based)
async function getTokenFromRequest(request: NextRequest) {
  // For API calls, check Authorization header first
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    // If using external bearer token, we let the route handler verify it
    // For NextAuth, session cookies are the primary mechanism
    return null;
  }

  // Check for NextAuth session cookie
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    return null;
  }

  return sessionToken;
}

// Admin-only paths and methods
const ADMIN_ROUTES: { path: string; methods: string[] }[] = [
  { path: "/api/motors", methods: ["POST"] },
  { path: "/api/motors/", methods: ["PUT", "DELETE"] },
  { path: "/api/motors/", methods: ["PATCH"] }, // status update
  { path: "/api/photos", methods: ["POST", "DELETE", "PATCH"] },
  { path: "/api/reviews/", methods: ["PATCH", "DELETE"] }, // moderate, delete
  { path: "/api/users", methods: ["GET", "PATCH"] },
  { path: "/api/dashboard", methods: ["GET"] },
];

// Auth-required paths
const AUTH_REQUIRED_ROUTES: { path: string; methods: string[] }[] = [
  { path: "/api/saved", methods: ["GET", "POST", "DELETE"] },
  { path: "/api/auth/me", methods: ["GET"] },
];

function isAdminRoute(pathname: string, method: string): boolean {
  // Dashboard routes
  if (pathname.startsWith("/api/dashboard")) {
    return method === "GET";
  }

  // User management routes
  if (pathname.startsWith("/api/users")) {
    return ["GET", "PATCH"].includes(method);
  }

  // Motor CUD operations
  if (pathname === "/api/motors" && method === "POST") {
    return true;
  }
  if (pathname.startsWith("/api/motors/") && ["PUT", "DELETE", "PATCH"].includes(method)) {
    return true;
  }

  // Photo management
  if (
    (pathname.startsWith("/api/motors/") && pathname.includes("/photos") && method === "POST") ||
    (pathname.startsWith("/api/photos/") && ["DELETE", "PATCH"].includes(method))
  ) {
    return true;
  }

  // Review moderation & deletion (admin-specific routes)
  if (pathname === "/api/reviews" && method === "GET") {
    return true;
  }
  if (
    pathname.startsWith("/api/reviews/") &&
    (pathname.includes("/moderate") || method === "DELETE")
  ) {
    return true;
  }

  return false;
}

function isAuthRequiredRoute(pathname: string, method: string): boolean {
  // Saved motor routes
  if (pathname.startsWith("/api/saved")) {
    return ["GET", "POST", "DELETE"].includes(method);
  }

  // Auth me route
  if (pathname === "/api/auth/me") {
    return method === "GET";
  }

  // Submit review
  if (
    pathname.startsWith("/api/motors/") &&
    pathname.endsWith("/reviews") &&
    method === "POST"
  ) {
    return true;
  }

  return false;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Only handle API routes
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Skip NextAuth routes — they handle their own auth
  if (pathname.startsWith("/api/auth/") && !pathname.startsWith("/api/auth/me") && !pathname.startsWith("/api/auth/register")) {
    return NextResponse.next();
  }

  // Rate limiting on auth endpoints
  if (pathname.startsWith("/api/auth/register") || pathname.startsWith("/api/auth/callback")) {
    // Rate limiting is handled inside the route handlers themselves
    // because the proxy runs at the edge and doesn't have access to the same
    // in-memory store as the Node.js runtime routes
  }

  // Check for session token
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;
  const hasAuth = !!sessionToken;

  // For admin routes, we can't fully verify role in proxy (JWT decoding
  // requires the secret which is available, but for safety we do the
  // full check in route handlers). Proxy just ensures a session exists.
  if (isAdminRoute(pathname, method)) {
    if (!hasAuth) {
      return Response.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Authentication required",
        },
        { status: 401 }
      );
    }
    // Role check (ADMIN) is done inside individual route handlers
    // because proxy can't reliably decode the JWT
  }

  // Auth-required routes
  if (isAuthRequiredRoute(pathname, method)) {
    if (!hasAuth) {
      return Response.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Authentication required",
        },
        { status: 401 }
      );
    }
  }

  // Add CORS headers for API routes
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
