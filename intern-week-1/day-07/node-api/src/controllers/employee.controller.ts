import { Request, Response, NextFunction } from "express";
import { EmployeeService } from "../services/employee.service.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { EmployeeFilterQuery } from "../models/employee.model.js";

export class EmployeeController {
  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: EmployeeFilterQuery = {
        search: typeof req.query.search === "string" ? req.query.search : undefined,
        department: typeof req.query.department === "string" ? req.query.department : undefined,
        status: typeof req.query.status === "string" ? req.query.status : undefined,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any
      };
      const employees = await EmployeeService.list(query);
      sendSuccess(res, employees, 200, "Employees fetched successfully");
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const employee = await EmployeeService.getById(id);
      if (!employee) {
        sendError(res, `Employee with ID '${id}' was not found`, 404, "NOT_FOUND");
        return;
      }
      sendSuccess(res, employee, 200, "Employee retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  public static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await EmployeeService.getStatistics();
      sendSuccess(res, stats, 200, "Dashboard statistics retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await EmployeeService.create(req.body);
      sendSuccess(res, created, 201, "Employee record created successfully");
    } catch (err: any) {
      if (err.statusCode) {
        sendError(res, err.message, err.statusCode, err.code);
        return;
      }
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await EmployeeService.update(id, req.body);
      sendSuccess(res, updated, 200, "Employee record updated successfully");
    } catch (err: any) {
      if (err.statusCode) {
        sendError(res, err.message, err.statusCode, err.code);
        return;
      }
      next(err);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await EmployeeService.delete(id);
      sendSuccess(res, { id, deleted: true }, 200, `Employee record '${id}' was permanently deleted`);
    } catch (err: any) {
      if (err.statusCode) {
        sendError(res, err.message, err.statusCode, err.code);
        return;
      }
      next(err);
    }
  }
}