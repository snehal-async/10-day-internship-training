/**
 * 09-type-narrowing-and-type-guards.ts
 * ============================================================================
 * Topic: Type Narrowing, Custom Type Guards, and Exhaustive Type Checking
 * Domain Context: Safe Handling of Mixed Payroll, Audits, and Form Inputs
 * ============================================================================
 */

// Domain Interfaces
interface FullTimeWorker {
  kind: "full-time";
  id: string;
  name: string;
  monthlyFixedSalary: number;
  benefitsEnrolled: boolean;
}

interface ContractWorker {
  kind: "contract";
  id: string;
  name: string;
  hourlyRate: number;
  hoursWorkedThisMonth: number;
}

interface VolunteerIntern {
  kind: "intern";
  id: string;
  name: string;
  stipend: number;
  mentorName: string;
}

type StaffMember = FullTimeWorker | ContractWorker | VolunteerIntern;

// ============================================================================
// 1. TYPEOF TYPE GUARDS
// ============================================================================
function parseSalaryInput(input: string | number): number {
  if (typeof input === "string") {
    // TypeScript knows `input` is guaranteed to be a string here
    const sanitized = input.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(sanitized);
    if (isNaN(parsed)) throw new Error(`Invalid numeric input: '${input}'`);
    return parsed;
  }
  // TypeScript knows `input` is guaranteed to be a number here
  return input;
}

// ============================================================================
// 2. INSTANCEOF TYPE GUARDS
// ============================================================================
class PermanentEmployee {
  constructor(public id: string, public name: string, public pensionFund: number) {}
}

class TemporaryConsultant {
  constructor(public id: string, public name: string, public firmName: string) {}
}

function processCorporatePass(person: PermanentEmployee | TemporaryConsultant): string {
  if (person instanceof PermanentEmployee) {
    return `[Permanent Badge] Access Level: ALL-FLOORS | Pension ID: ${person.pensionFund}`;
  } else {
    return `[Visitor Badge] Access Level: FLOOR-2 | Consulting Firm: ${person.firmName}`;
  }
}

// ============================================================================
// 3. 'IN' OPERATOR TYPE GUARDS
// ============================================================================
function inspectWorkerBenefits(worker: StaffMember): string {
  if ("benefitsEnrolled" in worker) {
    // Narrowed to FullTimeWorker
    return `${worker.name} is Full-Time (Benefits: ${worker.benefitsEnrolled ? "Active" : "Waived"})`;
  } else if ("hourlyRate" in worker) {
    // Narrowed to ContractWorker
    return `${worker.name} is Contractor (Rate: $${worker.hourlyRate}/hr, Logged: ${worker.hoursWorkedThisMonth} hrs)`;
  } else {
    // Narrowed to VolunteerIntern
    return `${worker.name} is Intern (Mentor: ${worker.mentorName}, Stipend: $${worker.stipend})`;
  }
}

// ============================================================================
// 4. USER-DEFINED TYPE GUARDS (Predicate: `arg is Type`)
// ============================================================================
function isFullTimeWorker(worker: StaffMember): worker is FullTimeWorker {
  return worker.kind === "full-time";
}

function isContractWorker(worker: StaffMember): worker is ContractWorker {
  return worker.kind === "contract";
}

// ============================================================================
// 5. EXHAUSTIVE DISCRIMINATED UNION CHECKING (with `never`)
// ============================================================================
function calculateMonthlyPayout(worker: StaffMember): number {
  switch (worker.kind) {
    case "full-time":
      return worker.monthlyFixedSalary;

    case "contract":
      return Math.round(worker.hourlyRate * worker.hoursWorkedThisMonth);

    case "intern":
      return worker.stipend;

    default: {
      // If a new worker type is added to StaffMember and not handled above,
      // TypeScript will produce a compile-time error right here!
      const _unreachable: never = worker;
      return _unreachable;
    }
  }
}

// ============================================================================
// COMMON TYPE MISTAKES (Safely demonstrated in comments)
// ============================================================================
/*
// Mistake 1: Accessing un-narrowed union property
// function badAudit(worker: StaffMember) {
//   console.log(worker.hourlyRate); 
//   // TS2339: Property 'hourlyRate' does not exist on type 'StaffMember'.
// }

// Mistake 2: Bad type predicate that returns boolean without `worker is Type`
// function badGuard(worker: StaffMember): boolean { return worker.kind === "contract"; }
// TS doesn't narrow the type automatically if the return signature is just boolean!
*/

// ============================================================================
// EXECUTION & DEMONSTRATION
// ============================================================================
console.log("=== 09: Type Narrowing and Type Guards Demonstration ===");

// 1. typeof
console.log("Parsed '$85,000.50' :", parseSalaryInput("$85,000.50"));
console.log("Parsed 120000       :", parseSalaryInput(120000));

// 2. instanceof
const perm = new PermanentEmployee("EMP-001", "Aarav Sharma", 99482);
const consultant = new TemporaryConsultant("CON-901", "Alex Smith", "TechStaff Global");
console.log("Pass 1 (Permanent) :", processCorporatePass(perm));
console.log("Pass 2 (Consultant):", processCorporatePass(consultant));

// 3. 'in' operator & Custom Type Guards
const team: StaffMember[] = [
  { kind: "full-time", id: "FT-1", name: "Aarav Sharma", monthlyFixedSalary: 10416, benefitsEnrolled: true },
  { kind: "contract", id: "CT-2", name: "Rohan Verma", hourlyRate: 65, hoursWorkedThisMonth: 160 },
  { kind: "intern", id: "IN-3", name: "Snehal Solanke", stipend: 2500, mentorName: "Aarav Sharma" }
];

team.forEach((member) => {
  console.log(`Worker Audit       :`, inspectWorkerBenefits(member));
  console.log(`  Monthly Payout   : $${calculateMonthlyPayout(member).toLocaleString()}`);
  if (isFullTimeWorker(member)) {
    console.log(`  -> Custom Guard: Confirmed Full-Time Employee (ID: ${member.id})`);
  } else if (isContractWorker(member)) {
    console.log(`  -> Custom Guard: Confirmed Contractor with Timesheet`);
  }
});

console.log("========================================================\n");

export {};
