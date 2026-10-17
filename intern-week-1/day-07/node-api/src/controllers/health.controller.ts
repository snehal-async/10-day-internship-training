import { Request, Response } from "express";
import { sendSuccess } from "../utils/response.js";

export function getHealth(req: Request, res: Response): void {
  const payload = {
    status: "ok",
    service: "employee-management-api",
    version: "1.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  };
  sendSuccess(res, payload, 200, "Service is healthy and operational");
}