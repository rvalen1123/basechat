import type { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { verifyPassword } from "./lib/server-utils";
import { findUserByEmail } from "./lib/service";

declare module "next-auth" {
  interface User {
    tenantId?: string;
  }
}

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET environment variable is required");
}

if (process.env.AUTH_GOOGLE_ID && !process.env.AUTH_GOOGLE_SECRET) {
  throw new Error("AUTH_GOOGLE_SECRET is required when AUTH_GOOGLE_ID is set");
}

const config = {
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    Credentials({
      credentials: {
        email: { type: "email", label: "Email", required: true },
        password: { type: "password", label: "Password", required: true },
      },
      async authorize(credentials, _request) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await findUserByEmail(credentials.email as string);
          if (!user?.password) {
            return null;
          }

          const isValid = await verifyPassword(user.password, credentials.password as string);
          if (!isValid) {
            return null;
          }

          return user;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  callbacks: {
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      if (token.tenantId) {
        session.user.tenantId = token.tenantId as string;
      }
      return session;
    },
    jwt({ token, user, trigger }) {
      if ((trigger === "signIn" || trigger === "signUp") && user?.id) {
        token.id = user.id;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

export default config;
