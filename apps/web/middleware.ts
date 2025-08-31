import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { locales, routing } from "./app/_shared/i18n";
import { auth } from "./auth";
import { BASE_URL } from "./lib/constants";

const publicPages = ["/", "/auth/sign-in", "/consumer"];

const intlMiddleware = createIntlMiddleware(routing);

const authMiddleware = auth((req) => {
  if (req.auth) return intlMiddleware(req);
  const reqUrl = new URL(req.url);

  if (reqUrl.pathname !== "/") {
    return NextResponse.redirect(new URL(`${BASE_URL}/auth/sign-in}`, req.url));
  }
});

// export default createIntlMiddleware(routing);

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i",
  );

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  return isPublicPage ? intlMiddleware(req) : (authMiddleware as any)(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
