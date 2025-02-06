import type { NextAuthConfig } from "next-auth";

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET environment variable is required");
}

export default {
  providers: [],
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/(auth)/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
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
    authorized({ auth }) {
      return !!auth;
    },
  },
} satisfies NextAuthConfig;
