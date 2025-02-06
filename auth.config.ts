import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export default {
  providers: [],
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  callbacks: {
    session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
} satisfies NextAuthConfig;
