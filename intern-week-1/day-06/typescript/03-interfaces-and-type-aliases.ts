/**
 * 03-interfaces-and-type-aliases.ts
 * ============================================================================
 * Topic: Interfaces and Type Aliases in TypeScript
 * Domain Context: Employee Hierarchies, Role Contracts, and Model Definitions
 * ============================================================================
 */

// ============================================================================
// 1. INTERFACES (Extensible Object Contracts)
// ============================================================================

// Base Person interface defining common human attributes
interface IPerson {
  readonly id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Interface extension (Inheritance using `extends`)
interface IEmployee extends IPerson {
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  status: "Active" | "Inactive" | "On Leave";
}

// Further specialization for Managers
interface IManager extends IEmployee {
  directReportsCount: number;
  departmentBudget: number;
  approveLeave(employeeId: string, days: number): boolean;
}

// Declaration Merging: Interfaces with the same name automatically merge in TypeScript!
interface IEmployee {
  workLocation?: "Remote" | "Hybrid" | "On-Site";
}

// ============================================================================
// 2. TYPE ALIASES (Flexible Shapes, Unions, and Intersections)
// ============================================================================

// Primitive alias
type EmployeeId = string;

// Union alias
type EmploymentType = "Full-Time" | "Part-Time" | "Contractor" | "Intern";

// Object Type Alias
type TechnicalSkills = {
  primaryLanguage: string;
  frameworks: string[];
  certifications?: string[];
};

type PerformanceEvaluation = {
  rating: number; // 1 to 5
  reviewYear: number;
  isEligibleForPromotion: boolean;
};

// Intersection Type (`&` combines multiple types)
type SoftwareEngineer = IEmployee & {
  skills: TechnicalSkills;
  evaluation: PerformanceEvaluation;
  githubUsername: string;
};

// ============================================================================
// 3. IMPLEMENTATION & USAGE
// ============================================================================

const seniorLead: SoftwareEngineer = {
  id: "EMP-003",
  firstName: "Rohan",
  lastName: "Verma",
  email: "rohan.verma@example.com",
  phone: "+91-98230-33445",
  department: "Engineering",
  designation: "Full Stack Developer",
  salary: 85000,
  joiningDate: "2023-06-01",
  status: "Active",
  workLocation: "Hybrid",
  githubUsername: "rohan-fullstack",
  skills: {
    primaryLanguage: "TypeScript",
    frameworks: ["React", "Node.js", "Express"],
    certifications: ["AWS Certified Developer"]
  },
  evaluation: {
    rating: 4.8,
    reviewYear: 2025,
    isEligibleForPromotion: true
  }
};

const engineeringManager: IManager = {
  id: "EMP-001",
  firstName: "Aarav",
  lastName: "Sharma",
  email: "aarav.sharma@example.com",
  phone: "+91-98230-11223",
  department: "Engineering",
  designation: "Lead Architect & Engineering Manager",
  salary: 125000,
  joiningDate: "2022-03-15",
  status: "Active",
  workLocation: "On-Site",
  directReportsCount: 8,
  departmentBudget: 1500000,
  approveLeave(empId: string, days: number): boolean {
    console.log(`[Manager Decision] Leave request for ${empId} (${days} days) is APPROVED.`);
    return true;
  }
};

// ============================================================================
// COMMON TYPE MISTAKES (Safely demonstrated in comments)
// ============================================================================
/*
// Mistake 1: Missing a required property from extended interface
// const badEmp: IEmployee = {
//   id: "EMP-999",
//   firstName: "Test",
//   // Missing lastName, email, phone, department, etc.
// };
// TS2739: Type '{ id: string; firstName: string; }' is missing properties from 'IEmployee'.

// Mistake 2: Re-declaring a type alias with the same name (Unlike interfaces, types cannot merge!)
// type EmployeeId = number; 
// TS2300: Duplicate identifier 'EmployeeId'.
*/

// ============================================================================
// EXECUTION & DEMONSTRATION
// ============================================================================
console.log("=== 03: Interfaces and Type Aliases Demonstration ===");
console.log(`Engineer Name        : ${seniorLead.firstName} ${seniorLead.lastName}`);
console.log(`Designation          : ${seniorLead.designation} (${seniorLead.workLocation})`);
console.log(`Primary Language     : ${seniorLead.skills.primaryLanguage}`);
console.log(`Frameworks           : ${seniorLead.skills.frameworks.join(", ")}`);
console.log(`Performance Rating   : ${seniorLead.evaluation.rating} / 5.0 (Promo: ${seniorLead.evaluation.isEligibleForPromotion})`);
console.log(`Engineering Manager  : ${engineeringManager.firstName} ${engineeringManager.lastName}`);
console.log(`Direct Reports Count : ${engineeringManager.directReportsCount}`);
console.log(`Annual Budget        : $${engineeringManager.departmentBudget.toLocaleString()}`);
engineeringManager.approveLeave(seniorLead.id, 4);
console.log("====================================================\n");

export {};
