import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";

/**
 * 404 Not Found Middleware
 */
export function notFoundHandler(req: Request, res: Response): void {
  sendError(
    res,
    `Cannot ${req.method} ${req.originalUrl} - Endpoint not found on this server.`,
    404,
    "ROUTE_NOT_FOUND"
  );
}

/**
 * Centralized Global Error Handling Middleware
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(`[Unhandled Server Error] ${req.method} ${req.url}:`, err);

  // Catch Body-Parser JSON syntax errors (malformed JSON payload)
  if (err instanceof SyntaxError && "body" in err) {
    sendError(res, "Malformed JSON syntax in request body.", 400, "INVALID_JSON");
    return;
  }

  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
  const message = err.message || "An unexpected internal server error occurred.";

  sendError(res, message, statusCode, "INTERNAL_SERVER_ERROR", {
    name: err.name,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
}