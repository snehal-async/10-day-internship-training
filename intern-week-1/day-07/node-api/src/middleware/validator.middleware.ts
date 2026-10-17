import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ALLOWED_DEPARTMENTS, ALLOWED_STATUSES } from "../models/employee.model.js";
import { sendError } from "../utils/response.js";

const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

export const createEmployeeSchema = z.object({
  id: z.string().optional(),
  firstName: z
    .string({ required_error: "First name is strictly required" })
    .trim()
    .min(2, "First name must be at least 2 characters")
    .regex(/^[A-Za-z\s'-]+$/, "First name can only contain letters, spaces, and hyphens"),
  lastName: z
    .string({ required_error: "Last name is strictly required" })
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .regex(/^[A-Za-z\s'-]+$/, "Last name can only contain letters, spaces, and hyphens"),
  email: z
    .string({ required_error: "Work email is required" })
    .trim()
    .email("Please provide a valid work email address"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .regex(PHONE_REGEX, "Enter a valid phone number (e.g. +91-98230-11223)"),
  department: z.string().refine((val) => ALLOWED_DEPARTMENTS.includes(val as any), {
    message: `Department must be one of: ${ALLOWED_DEPARTMENTS.join(", ")}`
  }),
  designation: z
    .string({ required_error: "Job designation is required" })
    .trim()
    .min(2, "Job designation must be at least 2 characters"),
  status: z.enum(ALLOWED_STATUSES as [string, ...string[]], {
    errorMap: () => ({ message: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}` })
  }),
  joiningDate: z
    .string({ required_error: "Joining date is required" })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format for joining date (use YYYY-MM-DD)" }),
  salary: z.coerce
    .number({ required_error: "Salary is required", invalid_type_error: "Salary must be numeric" })
    .positive("Annual salary must be a positive number greater than 0")
    .max(10000000, "Salary exceeds maximum threshold of $10,000,000")
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export function validateCreateEmployee(req: Request, res: Response, next: NextFunction): void {
  try {
    req.body = createEmployeeSchema.parse(req.body);
    next();
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      const fieldErrors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message
      }));
      sendError(res, "Input validation failed. Please correct the specified fields.", 400, "VALIDATION_ERROR", fieldErrors);
      return;
    }
    next(err);
  }
}

export function validateUpdateEmployee(req: Request, res: Response, next: NextFunction): void {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      sendError(res, "Update payload cannot be empty", 400, "EMPTY_PAYLOAD");
      return;
    }
    req.body = updateEmployeeSchema.parse(req.body);
    next();
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      const fieldErrors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message
      }));
      sendError(res, "Validation failed for update payload", 400, "VALIDATION_ERROR", fieldErrors);
      return;
    }
    next(err);
  }
}