import type { Adapter } from "@auth/core/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq, sql } from "drizzle-orm";
import NextAuth from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";

import authConfig from "./auth.config";
import db from "./lib/db";
import { schema } from "./lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tenantId?: string;
      email?: string | null;
      name?: string | null;
    };
  }
}

interface DBUser extends AdapterUser {
  password?: string | null;
}

// Helper to convert DB user to AdapterUser
const toAdapterUser = (user: typeof schema.users.$inferSelect): DBUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  emailVerified: null,
  password: user.password,
});

// Create a custom adapter configuration
const customAdapter = {
  ...DrizzleAdapter(db),
  createUser: async (user: AdapterUser) => {
    const result = await db.insert(schema.users)
      .values({
        email: user.email,
        name: user.name ?? null,
        password: (user as DBUser).password ?? null,
      })
      .returning();
    return toAdapterUser(result[0]);
  },
  getUser: async (id: string) => {
    if (!id) {
      return null;
    }
    const [result] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return result ? toAdapterUser(result) : null;
  },
  getUserByEmail: async (email: string | null | undefined) => {
    if (!email) {
      return null;
    }
    const [result] = await db.select()
      .from(schema.users)
      .where(sql`${schema.users.email} = ${email}`)
      .limit(1);
    return result ? toAdapterUser(result) : null;
  },
} satisfies Adapter;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: customAdapter,
  providers: [
    Credentials({
      credentials: {
        email: { type: "email", label: "Email", required: true },
        password: { type: "password", label: "Password", required: true },
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>>) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = (await customAdapter.getUserByEmail(credentials.email as string)) as DBUser;
        if (!user?.password) {
          return null;
        }

        // Simple password comparison since we removed argon2
        const isValid = user.password === credentials.password;
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
});
