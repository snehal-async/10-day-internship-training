import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller.js";
import {
  validateCreateEmployee,
  validateUpdateEmployee
} from "../middleware/validator.middleware.js";
import { requireDemoAuth } from "../middleware/auth.middleware.js";

export const employeeRouter = Router();

// Statistics endpoint (must be declared BEFORE /:id dynamic route!)
employeeRouter.get("/stats", EmployeeController.getStats);

// List employees with filter and sort query parameters
employeeRouter.get("/", EmployeeController.getAll);

// Get single employee by ID
employeeRouter.get("/:id", EmployeeController.getById);

// Create new employee (with schema validation middleware)
employeeRouter.post("/", validateCreateEmployee, EmployeeController.create);

// Update existing employee (with schema validation middleware)
employeeRouter.put("/:id", validateUpdateEmployee, EmployeeController.update);

// Delete employee (Protected by educational demo auth middleware: Bearer intern-auth-token-2026)
employeeRouter.delete("/:id", requireDemoAuth, EmployeeController.delete);