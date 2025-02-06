-- Disable triggers temporarily for faster migration
SET session_replication_role = 'replica';

-- Create new tables
CREATE TABLE IF NOT EXISTS "user_tenants" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "user_id" uuid NOT NULL,
    "tenant_id" uuid NOT NULL,
    "role" text NOT NULL DEFAULT 'user',
    CONSTRAINT "uniq_user_tenant" UNIQUE("user_id", "tenant_id")
);

-- Migrate data
-- 1. Users table remains the same, just remove unused columns
ALTER TABLE "users" 
    DROP COLUMN IF EXISTS "email_verified",
    DROP COLUMN IF EXISTS "image",
    DROP COLUMN IF EXISTS "current_profile_id";

-- 2. Migrate profiles to user_tenants
INSERT INTO "user_tenants" ("user_id", "tenant_id", "role", "created_at", "updated_at")
SELECT DISTINCT
    p."user_id",
    p."tenant_id",
    'user',
    p."created_at",
    p."updated_at"
FROM "profiles" p;

-- 3. Update tenant owners
UPDATE "user_tenants" ut
SET role = 'owner'
FROM "tenants" t
WHERE ut."user_id" = t."owner_id" AND ut."tenant_id" = t."id";

-- 4. Clean up connections table
ALTER TABLE "connections"
    DROP COLUMN IF EXISTS "provider_type",
    DROP COLUMN IF EXISTS "provider_config",
    DROP COLUMN IF EXISTS "metadata";

-- 5. Clean up conversations and messages
-- These tables structure remains mostly the same, just ensure referential integrity

-- Drop unused tables
DROP TABLE IF EXISTS "accounts" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "verification_tokens" CASCADE;
DROP TABLE IF EXISTS "authenticators" CASCADE;
DROP TABLE IF EXISTS "notes" CASCADE;
DROP TABLE IF EXISTS "invites" CASCADE;
DROP TABLE IF EXISTS "profiles" CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Add new indexes for performance
CREATE INDEX IF NOT EXISTS "idx_user_tenants_user_id" ON "user_tenants" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_tenants_tenant_id" ON "user_tenants" ("tenant_id");
CREATE INDEX IF NOT EXISTS "idx_connections_tenant_id" ON "connections" ("tenant_id");
CREATE INDEX IF NOT EXISTS "idx_conversations_tenant_id" ON "conversations" ("tenant_id");
CREATE INDEX IF NOT EXISTS "idx_conversations_user_id" ON "conversations" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_messages_conversation_id" ON "messages" ("conversation_id");

-- Update updated_at function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
DO $$ 
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_updated_at ON %I;
            CREATE TRIGGER update_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at();
        ', t, t);
    END LOOP;
END $$;
