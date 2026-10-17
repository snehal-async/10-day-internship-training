import { Router } from "express";
import { employeeRouter } from "./employee.routes.js";
import { healthRouter } from "./health.routes.js";

export const rootRouter = Router();
rootRouter.use("/health", healthRouter);
rootRouter.use("/employees", employeeRouter);