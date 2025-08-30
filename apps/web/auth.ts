import type { NextAuthConfig } from "next-auth";
import Credentials from "@auth/core/providers/credentials";
import { importPKCS8, SignJWT } from "jose";
import NextAuth from "next-auth";

import { env } from "./env";
import { validateJWT } from "./lib/authHelpers";

interface User {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}

const CONVEX_SITE_URL = env.NEXT_PUBLIC_CONVEX_URL.replace(/.cloud$/, ".site");

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(
        credentials: Partial<Record<"token", unknown>>,
      ): Promise<User | null> {
        const token = credentials.token as string; // Safely cast to string; ensure to handle undefined case
        if (typeof token !== "string" || !token) {
          throw new Error("Token is required");
        }
        const jwtPayload = await validateJWT(token);

        if (jwtPayload) {
          // Transform the JWT payload into your user object
          const user: User = {
            id: jwtPayload.sub ?? "", // Assuming 'sub' is the user ID
            name: jwtPayload.name ?? "", // Replace with actual field from JWT payload
            email: jwtPayload.email ?? "", // Replace with actual field from JWT payload
            // Map other fields as needed
          };
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },
    async session({ session, token }) {
      if (!token.sub) return session;

      const privateKey = await importPKCS8(
        env.CONVEX_AUTH_PRIVATE_KEY.replace(/\\n/g, "\n"),
        "RS256",
      );
      const convexToken = await new SignJWT({
        sub: session.userId,
      })
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setIssuer(CONVEX_SITE_URL)
        .setAudience("convex")
        .setExpirationTime("1h")
        .sign(privateKey);

      session.convexToken = convexToken;

      return session;
    },
  },
} satisfies NextAuthConfig;

declare module "next-auth" {
  interface Session {
    convexToken: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(config);
