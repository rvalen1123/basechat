export const APP_NAME = "Base Chat";

export const AUTH_SECRET = process.env.AUTH_SECRET!;

export const COMPANY_NAME = "Acme Corp";

// assert(process.env.BASE_URL);
export const BASE_URL = process.env.BASE_URL!;

// Database URLs
export const DATABASE_URL = process.env.DATABASE_URL!;
export const POSTGRES_URL = process.env.POSTGRES_URL!;
export const POSTGRES_URL_NON_POOLING = process.env.POSTGRES_URL_NON_POOLING!;

// assert(process.env.RAGIE_API_BASE_URL);
export const RAGIE_API_BASE_URL = process.env.RAGIE_API_BASE_URL!;

// assert(process.env.RAGIE_API_KEY);
export const RAGIE_API_KEY = process.env.RAGIE_API_KEY!;

// assert(process.env.RAGIE_WEBHOOK_SECRET);
export const RAGIE_WEBHOOK_SECRET = process.env.RAGIE_WEBHOOK_SECRET!;

export const SMTP_FROM = process.env.SMTP_FROM!;
export const SMTP_HOST = process.env.SMTP_HOST!;
export const SMTP_PORT = Number(process.env.SMTP_PORT!);
export const SMTP_SECURE = process.env.SMTP_SECURE === "1";
export const { SMTP_USER } = process.env;
export const { SMTP_PASSWORD } = process.env;
