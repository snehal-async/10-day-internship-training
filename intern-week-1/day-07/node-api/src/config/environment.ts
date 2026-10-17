import dotenv from "dotenv";
dotenv.config();

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  demoApiKey: string;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || "4000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  demoApiKey: process.env.DEMO_API_KEY || "intern-auth-token-2026"
};