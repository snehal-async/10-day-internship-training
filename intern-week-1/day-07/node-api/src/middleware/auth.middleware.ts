import { Request, Response, NextFunction } from "express";
import { config } from "../config/environment.js";
import { sendError } from "../utils/response.js";

/**
 * Educational / Demo Authentication Middleware
 * ----------------------------------------------------------------------------
 * NOTE: This is designed for training demonstration and assessment only.
 * In production, use robust asymmetric JWTs (RS256), OAuth2/OIDC, or Session cookies
 * backed by Redis and secure HttpOnly cookie storage.
 * ----------------------------------------------------------------------------
 */
export function requireDemoAuth(req: Request, res: Response, next: NextFunction): void {
  // Check either 'Authorization: Bearer <token>' or 'x-api-key: <token>' header
  const authHeader = req.headers.authorization;
  const apiKeyHeader = req.headers["x-api-key"];

  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (typeof apiKeyHeader === "string") {
    token = apiKeyHeader;
  }

  if (!token) {
    sendError(
      res,
      "Authentication required: Please provide an Authorization Bearer token or x-api-key header (Demo Token: 'intern-auth-token-2026')",
      401,
      "UNAUTHORIZED"
    );
    return;
  }

  if (token !== config.demoApiKey) {
    sendError(
      res,
      "Authentication failed: Invalid credentials or token expired.",
      401,
      "INVALID_TOKEN"
    );
    return;
  }

  // Token is valid
  next();
}