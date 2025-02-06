import assert from "assert";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import assertNever from "assert-never";
import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import authConfig from "./auth.config";
import db from "./lib/db";
import * as schema from "./lib/db/schema";
import { verifyPassword } from "./lib/server-utils";
import { findUserByEmail, getFirstTenantByUserId } from "./lib/service";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** User ID should always exist on the session */
      id: string;
      /** Tenant ID may exist on the session */
      tenantId?: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/(auth)/sign-in",
  },
  secret: process.env.AUTH_SECRET,
  providers: authConfig.providers,
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    authorized: ({ auth }) => !!auth,
    async jwt({ token, user, trigger, session }) {
      if ((trigger === "signIn" || trigger === "signUp") && user) {
        assert(user.id, "expected AdapterUser");
        token.id = user.id;
        const tenant = await getFirstTenantByUserId(user.id);
        if (tenant) {
          token.tenantId = tenant.id;
        }
      }
      return token;
    },
  },
});
