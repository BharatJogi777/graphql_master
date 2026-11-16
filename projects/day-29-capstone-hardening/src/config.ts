export interface AppConfig {
  nodeEnv: "development" | "test" | "production";
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  corsOrigins: string[];
}

export function loadConfig(env: Record<string, string | undefined>): AppConfig {
  const nodeEnv = env.NODE_ENV ?? "development";
  if (!["development", "test", "production"].includes(nodeEnv)) throw new Error("NODE_ENV must be development, test or production");
  const port = Number(env.PORT ?? 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be a valid TCP port");
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required");
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret || (nodeEnv === "production" && jwtSecret.length < 32)) {
    throw new Error("JWT_SECRET must be set and contain at least 32 characters in production");
  }
  const corsOrigins = (env.CORS_ORIGINS ?? "").split(",").map((origin) => origin.trim()).filter(Boolean);
  if (nodeEnv === "production" && corsOrigins.length === 0) throw new Error("CORS_ORIGINS must be explicitly configured in production");
  return { nodeEnv: nodeEnv as AppConfig["nodeEnv"], port, databaseUrl, jwtSecret, corsOrigins };
}
