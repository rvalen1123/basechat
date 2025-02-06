import { json, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

/**
 * Base fields shared across all tables
 */
const baseFields = {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date().toISOString()),
};

/**
 * Users table - Core user data and authentication
 */
export const users = pgTable("users", {
    ...baseFields,
    email: text("email").unique().notNull(),
    password: text("password"), // Hashed password
    name: text("name"),
});

/**
 * Tenants table - Multi-tenant support
 */
export const tenants = pgTable("tenants", {
    ...baseFields,
    name: text("name").notNull(),
    ownerId: uuid("owner_id")
        .references(() => users.id, { onDelete: "restrict" })
        .notNull(),
});

/**
 * UserTenants table - User-tenant relationships with roles
 */
export const userTenants = pgTable(
    "user_tenants",
    {
        ...baseFields,
        userId: uuid("user_id")
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),
        tenantId: uuid("tenant_id")
            .references(() => tenants.id, { onDelete: "cascade" })
            .notNull(),
        role: text("role").default("user").notNull(), // Simple role system: "owner", "admin", "user"
    },
    (t) => ({
        uniqUserTenant: unique().on(t.userId, t.tenantId),
    })
);

/**
 * Connections table - RAG connections configuration
 */
export const connections = pgTable("connections", {
    ...baseFields,
    tenantId: uuid("tenant_id")
        .references(() => tenants.id, { onDelete: "cascade" })
        .notNull(),
    ragieConnectionId: text("ragie_connection_id").unique().notNull(),
    name: text("name").notNull(),
    status: text("status").notNull(), // "active", "pending", "error"
    sourceType: text("source_type").notNull(), // Type of data source
});

/**
 * Conversations table - Chat conversations
 */
export const conversations = pgTable("conversations", {
    ...baseFields,
    tenantId: uuid("tenant_id")
        .references(() => tenants.id, { onDelete: "cascade" })
        .notNull(),
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    title: text("title").notNull(),
});

/**
 * Messages table - Conversation messages with RAG sources
 */
export const messages = pgTable("messages", {
    ...baseFields,
    conversationId: uuid("conversation_id")
        .references(() => conversations.id, { onDelete: "cascade" })
        .notNull(),
    content: text("content").notNull(),
    role: text("role").notNull(), // "user" or "assistant"
    sources: json("sources").$type<Array<{ text: string; metadata?: Record<string, unknown> }>>().default([]).notNull(),
});
