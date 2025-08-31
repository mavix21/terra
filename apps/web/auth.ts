import type { DefaultSession, NextAuthConfig } from "next-auth";
import Credentials from "@auth/core/providers/credentials";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { importPKCS8, SignJWT } from "jose";
import NextAuth from "next-auth";

import type { Id } from "@terra/convex/convex/_generated/dataModel";
import { api } from "@terra/convex/convex/_generated/api";

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
        interface Payload {
          sub?: string;
          name?: string;
          email?: string;
        }
        const jwtPayload = (await validateJWT(token)) as Payload | null;
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
      if (!token.sub) {
        console.error("token.sub is not defined");
        return session;
      }

      const privateKey = await importPKCS8(
        env.CONVEX_AUTH_PRIVATE_KEY,
        "RS256",
      );
      // Ensure a Convex user exists and use its _id as the subject when possible
      let subject = token.sub;
      const email = session.user.email;
      if (email) {
        try {
          // Ensure user exists (idempotent if already created elsewhere)
          await fetchMutation(api.users.createUserIfNotExists, {
            email,
            walletAddress: "0x",
          });
          const userId = await fetchQuery(api.users.getUserIdByEmail, {
            email,
          });
          if (userId) {
            subject = userId as unknown as string;
            // Attach data to the NextAuth session for client usage
            session.user = {
              ...session.user,
              email,
              convexUserId: userId as Id<"users">,
            };
          }
        } catch (err) {
          console.error("Failed to resolve convex user id for session:", err);
        }
      }

      const convexToken = await new SignJWT({ sub: subject })
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
    user: DefaultSession["user"] & {
      convexUserId?: Id<"users">;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(config);
