/**
 * 04-union-types-and-enums.ts
 * ============================================================================
 * Topic: Union Types, String Enums, Numeric Enums, and Discriminated Unions
 * Domain Context: Employee Statuses, Roles, Departments, and System Events
 * ============================================================================
 */

// ============================================================================
// 1. STRING ENUMS & NUMERIC ENUMS
// ============================================================================

// String Enum: Values are human-readable strings, easier to debug and log
export enum Department {
  Engineering = "Engineering",
  Design = "Design",
  Marketing = "Marketing",
  HumanResources = "Human Resources",
  Finance = "Finance",
  Operations = "Operations"
}

// Numeric Enum: Auto-incrementing numbers (defaults to 0, 1, 2, ...)
export enum AccessLevel {
  Guest = 1,      // 1
  Employee = 2,   // 2
  TeamLead = 3,   // 3
  DepartmentHead = 4, // 4
  SystemAdmin = 5 // 5
}

// Const Enum: Inlined at compile time for zero runtime overhead
export const enum ContractType {
  Permanent = "PERM",
  Probation = "PROB",
  FixedTerm = "TERM"
}

// ============================================================================
// 2. UNION TYPES & LITERAL TYPES
// ============================================================================

// String Literal Union (Often preferred over enums for simple states in modern TS/React)
export type EmploymentStatus = "Active" | "Inactive" | "On Leave";

// Flexible identifier: Can be database string or numeric sequence
type EmployeeIdentifier = string | number;

function formatEmployeeBadge(id: EmployeeIdentifier, status: EmploymentStatus): string {
  const normalizedId = typeof id === "number" ? `EMP-${id.toString().padStart(3, "0")}` : id;
  return `Badge [${normalizedId}] - Status: ${status.toUpperCase()}`;
}

// ============================================================================
// 3. DISCRIMINATED UNIONS (Tagged Unions for Safe Pattern Matching)
// ============================================================================

// Each event variant has a common discriminant property: `type`
type SalaryCreditEvent = {
  type: "SALARY_CREDITED";
  employeeId: string;
  amount: number;
  bankReference: string;
};

type PromotionEvent = {
  type: "PROMOTION_AWARDED";
  employeeId: string;
  oldDesignation: string;
  newDesignation: string;
  newSalary: number;
};

type PerformanceReviewEvent = {
  type: "PERFORMANCE_LOGGED";
  employeeId: string;
  score: number;
  reviewerId: string;
};

// The Discriminated Union
type HRNotificationEvent = SalaryCreditEvent | PromotionEvent | PerformanceReviewEvent;

function processHREvent(event: HRNotificationEvent): string {
  // Exhaustive type checking using the discriminant `type`
  switch (event.type) {
    case "SALARY_CREDITED":
      return `[Payroll] $${event.amount.toLocaleString()} credited to ${event.employeeId} (Ref: ${event.bankReference})`;

    case "PROMOTION_AWARDED":
      return `[Career] Congratulations! ${event.employeeId} promoted from '${event.oldDesignation}' to '${event.newDesignation}' with new salary $${event.newSalary.toLocaleString()}`;

    case "PERFORMANCE_LOGGED":
      return `[Review] Performance score ${event.score}/5.0 logged for ${event.employeeId} by reviewer ${event.reviewerId}`;

    default: {
      // TypeScript ensures compile-time exhaustiveness check with 'never'
      const _exhaustiveCheck: never = event;
      return _exhaustiveCheck;
    }
  }
}

// ============================================================================
// COMMON TYPE MISTAKES (Safely demonstrated in comments)
// ============================================================================
/*
// Mistake 1: Assigning an invalid string to a literal union
// const invalidStatus: EmploymentStatus = "Suspended"; 
// TS2322: Type '"Suspended"' is not assignable to type 'EmploymentStatus'.

// Mistake 2: Missing required property for a discriminated union variant
// const badEvent: HRNotificationEvent = {
//   type: "PROMOTION_AWARDED",
//   employeeId: "EMP-001",
//   // Missing newDesignation, oldDesignation, newSalary
// };
// TS2739: Type '{ type: "PROMOTION_AWARDED"; employeeId: string; }' is missing properties.
*/

// ============================================================================
// EXECUTION & DEMONSTRATION
// ============================================================================
console.log("=== 04: Union Types and Enums Demonstration ===");
console.log(`Department Enum Sample : ${Department.Engineering} (${Department.Engineering})`);
console.log(`Access Level Enum      : Admin Level = ${AccessLevel.SystemAdmin}`);
console.log(`Contract Type Constant : ${ContractType.Permanent}`);
console.log(`Badge 1 (Numeric ID)   :`, formatEmployeeBadge(42, "Active"));
console.log(`Badge 2 (String ID)    :`, formatEmployeeBadge("EMP-987", "On Leave"));

const sampleSalaryEvent: HRNotificationEvent = {
  type: "SALARY_CREDITED",
  employeeId: "EMP-001",
  amount: 10416,
  bankReference: "HDFC-TXN-998822"
};

const samplePromoEvent: HRNotificationEvent = {
  type: "PROMOTION_AWARDED",
  employeeId: "EMP-003",
  oldDesignation: "Software Engineer",
  newDesignation: "Senior Lead Architect",
  newSalary: 115000
};

console.log("HR Event 1             :", processHREvent(sampleSalaryEvent));
console.log("HR Event 2             :", processHREvent(samplePromoEvent));
console.log("===============================================\n");

export {};
