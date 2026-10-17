import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { config } from "./config/environment.js";
import { rootRouter } from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";

export const app: Express = express();

// 1. CORS Configuration for local Next.js frontend
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or localhost origins
      if (!origin || origin.startsWith("http://localhost:") || origin === config.corsOrigin) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local training environment
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"]
  })
);

// 2. Request body parsing
app.use(express.json({ limit: "1mb" }));

// 3. Lightweight Development Request Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== "test") {
      console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// 4. API Routes Mount
app.use("/api", rootRouter);

// Root informational endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Employee Management REST API (Day 07)",
    documentation: "/api/health",
    version: "1.0.0"
  });
});

// 5. 404 Route Handler
app.use(notFoundHandler);

// 6. Global Centralized Error Handler
app.use(errorHandler);