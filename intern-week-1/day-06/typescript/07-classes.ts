/**
 * 07-classes.ts
 * ============================================================================
 * Topic: Classes, Access Modifiers, Inheritance, Abstract Classes, and Encapsulation
 * Domain Context: Corporate Hierarchy, Payroll Classes, and Role Specialization
 * ============================================================================
 */

// 1. Interface contract for class implementation
interface Auditable {
  getAuditMetadata(): string;
}

// 2. Abstract Base Class
abstract class CorporateMember implements Auditable {
  // Static property shared across all instances
  public static readonly COMPANY_LEGAL_NAME = "Enterprise Solutions Global Inc.";

  // Parameter Properties Shorthand:
  // Declares member variable and assigns constructor argument in one clean line!
  constructor(
    public readonly id: string, // Immutable public ID
    public firstName: string,   // Publicly accessible & mutable
    public lastName: string,
    protected department: string, // Accessible only within this class & subclasses
    private _baseSalary: number   // Completely encapsulated, accessible only within this class
  ) {}

  // Getter for encapsulated private salary
  public get baseSalary(): number {
    return this._baseSalary;
  }

  // Setter with validation logic
  public set baseSalary(newSalary: number) {
    if (newSalary <= 0) {
      throw new Error("Base salary must be a positive non-zero number.");
    }
    this._baseSalary = newSalary;
  }

  // Full name helper getter
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Abstract Method: Subclasses MUST implement this specific method!
  public abstract calculateAnnualCompensation(): number;

  // Implementation of Auditable interface
  public getAuditMetadata(): string {
    return `[Member ID: ${this.id}] ${this.fullName} | Dept: ${this.department}`;
  }
}

// 3. Concrete Subclass: Salaried Employee
class RegularStaff extends CorporateMember {
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    department: string,
    baseSalary: number,
    public designation: string,
    private performanceBonusPercent: number
  ) {
    // Calling super constructor
    super(id, firstName, lastName, department, baseSalary);
  }

  // Implementing abstract method
  public calculateAnnualCompensation(): number {
    const bonus = this.baseSalary * (this.performanceBonusPercent / 100);
    return Math.round(this.baseSalary + bonus);
  }

  public getSummary(): string {
    // Can access `protected department` from parent class!
    return `${this.fullName} (${this.designation}) works in ${this.department}`;
  }
}

// 4. Concrete Subclass: Executive Leader
class ExecutiveManager extends CorporateMember {
  private _equityStockGrants: number;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    department: string,
    baseSalary: number,
    public executiveTitle: string,
    stockGrants: number,
    public directReports: number
  ) {
    super(id, firstName, lastName, department, baseSalary);
    this._equityStockGrants = stockGrants;
  }

  public calculateAnnualCompensation(): number {
    const executiveBonusMultiplier = 0.35; // 35% executive incentive
    return Math.round(this.baseSalary * (1 + executiveBonusMultiplier) + this._equityStockGrants);
  }

  public getLeaderProfile(): string {
    return `${this.executiveTitle}: ${this.fullName} managing ${this.directReports} direct reports in ${this.department}.`;
  }
}

// ============================================================================
// COMMON TYPE MISTAKES (Safely demonstrated in comments)
// ============================================================================
/*
// Mistake 1: Directly accessing private property from outside
// const staff = new RegularStaff(...);
// console.log(staff._baseSalary); 
// TS2341: Property '_baseSalary' is private and only accessible within class 'CorporateMember'.

// Mistake 2: Accessing protected property outside subclass
// console.log(staff.department); 
// TS2445: Property 'department' is protected and only accessible within class 'CorporateMember' and its subclasses.

// Mistake 3: Trying to instantiate an abstract class directly
// const person = new CorporateMember("EMP-000", "John", "Doe", "HR", 50000); 
// TS2511: Cannot create an instance of an abstract class.
*/

// ============================================================================
// EXECUTION & DEMONSTRATION
// ============================================================================
console.log("=== 07: Classes and Object-Oriented TypeScript ===");
console.log(`Corporate Entity  : ${CorporateMember.COMPANY_LEGAL_NAME}`);

const staffMember = new RegularStaff(
  "EMP-003",
  "Rohan",
  "Verma",
  "Engineering",
  85000,
  "Full Stack Developer",
  10
);

const executiveLead = new ExecutiveManager(
  "EMP-001",
  "Aarav",
  "Sharma",
  "Engineering",
  125000,
  "VP of Engineering",
  30000,
  24
);

console.log("Staff Summary     :", staffMember.getSummary());
console.log("Staff Total Comp  : $" + staffMember.calculateAnnualCompensation().toLocaleString());
console.log("Audit Metadata    :", staffMember.getAuditMetadata());

console.log("Executive Profile :", executiveLead.getLeaderProfile());
console.log("Executive Comp    : $" + executiveLead.calculateAnnualCompensation().toLocaleString());

// Testing Encapsulated Setter
console.log(`Current Base Sal  : $${staffMember.baseSalary.toLocaleString()}`);
staffMember.baseSalary = 90000; // Updated via validated setter
console.log(`Updated Base Sal  : $${staffMember.baseSalary.toLocaleString()}`);
console.log("Updated Comp      : $" + staffMember.calculateAnnualCompensation().toLocaleString());
console.log("==================================================\n");

export {};
