import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // If Supabase is not configured, let all requests through gracefully.
  // This prevents MIDDLEWARE_INVOCATION_FAILED when env vars are missing.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh session — keeps cookies in sync
    const { data: { user } } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/login") || pathname.startsWith("/auth")) {
      if (user && pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return supabaseResponse;
    }

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return supabaseResponse;
  } catch {
    // If Supabase auth fails at runtime, fail open — app stays accessible.
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals, static assets, and PWA files
    "/((?!_next/static|_next/image|favicon.ico|sw\\.js|manifest\\.json|apple-icon.*|icon.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
