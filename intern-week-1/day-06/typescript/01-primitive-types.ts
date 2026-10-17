/**
 * 01-primitive-types.ts
 * ============================================================================
 * Topic: Primitive Types in TypeScript (string, number, boolean, null, undefined)
 * Domain Context: Employee Profile Attributes
 * ============================================================================
 */

// 1. String: Textual data
const employeeId: string = "EMP-101";
const firstName: string = "Snehal";
const lastName: string = "Solanke";
const companyEmail: string = "snehal.solanke@enterprise.io";

// Template literals are fully supported and type-checked as strings
const fullName: string = `${firstName} ${lastName}`;

// 2. Number: Double-precision 64-bit floating point numbers (integers & floats)
const baseSalary: number = 85000;
const performanceBonusRate: number = 0.12; // 12% bonus
const totalCompensation: number = baseSalary * (1 + performanceBonusRate);
const tenureYears: number = 3;

// 3. Boolean: Logical flags (true or false)
const isFullTime: boolean = true;
const isProbationComplete: boolean = true;
const hasHealthInsurance: boolean = true;

// 4. Null and Undefined: Intentional absence vs uninitialized state
// In strictNullChecks mode, null and undefined are their own distinct types!
const terminationDate: string | null = null; // Currently employed, so null is intentional
let middleName: string | undefined = undefined; // Optional field not provided

// 5. Type Inference: TypeScript automatically infers the correct primitive type
let department = "Engineering"; // Inferred as string
let annualLeavesRemaining = 18; // Inferred as number
let remoteWorkEligible = true;   // Inferred as boolean

// ============================================================================
// COMMON TYPE MISTAKES (Safely demonstrated in comments)
// ============================================================================
/*
// Mistake 1: Assigning number to string
// let invalidId: string = 101; 
// TS2322: Type 'number' is not assignable to type 'string'.

// Mistake 2: Assigning string to boolean
// let invalidFlag: boolean = "true"; 
// TS2322: Type 'string' is not assignable to type 'boolean'.

// Mistake 3: Assigning null to non-nullable type when strictNullChecks is enabled
// let mandatoryName: string = null; 
// TS2322: Type 'null' is not assignable to type 'string'.
*/

// ============================================================================
// EXECUTION & DEMONSTRATION
// ============================================================================
console.log("=== 01: Primitive Types Demonstration ===");
console.log(`Employee ID       : ${employeeId}`);
console.log(`Full Name         : ${fullName}`);
console.log(`Email             : ${companyEmail}`);
console.log(`Base Salary       : $${baseSalary.toLocaleString()}`);
console.log(`Total Compensation: $${totalCompensation.toLocaleString()} (Tenure: ${tenureYears} yrs)`);
console.log(`Full Time         : ${isFullTime ? "Yes" : "No"}`);
console.log(`Probation Status  : ${isProbationComplete ? "Completed" : "In Progress"}`);
console.log(`Termination Date  : ${terminationDate === null ? "None (Active Employee)" : terminationDate}`);
console.log(`Middle Name       : ${middleName ?? "N/A"}`);
console.log(`Department        : ${department}`);
console.log("=========================================\n");

export {};
