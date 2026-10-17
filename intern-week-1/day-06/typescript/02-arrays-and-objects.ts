/**
 * 02-arrays-and-objects.ts
 * ============================================================================
 * Topic: Arrays, Tuples, and Object Types in TypeScript
 * Domain Context: Employee Rosters, Skills Inventories, and Nested Records
 * ============================================================================
 */

// 1. Array Types: Using T[] and generic Array<T> syntax
const coreSkills: string[] = ["TypeScript", "React", "Node.js", "GraphQL"];
const quarterlyRatings: Array<number> = [4.8, 4.6, 4.9, 5.0];

// Readonly Arrays: Prevents accidental mutations like .push(), .pop(), or index reassignment
const standardCompanyHolidays: readonly string[] = [
  "New Year",
  "Republic Day",
  "Independence Day",
  "Diwali"
];

// 2. Tuples: Fixed-length, ordered sequences of specific types
// Example: [DepartmentCode, HeadcountQuota, IsBudgetApproved]
const departmentBudgetQuota: [string, number, boolean] = ["ENG", 35, true];

// Named tuple elements for clarity (self-documenting structure)
type Coordinate = [latitude: number, longitude: number];
const corporateOfficeLocation: Coordinate = [18.5204, 73.8567]; // Pune, India

// 3. Object Types: Explicit inline type declaration
const leadArchitect: {
  readonly id: string; // Immutable identifier
  firstName: string;
  lastName: string;
  department: string;
  salary: number;
  skills: string[];
  contact: {
    email: string;
    phone: string;
    emergencyContactName: string;
  };
} = {
  id: "EMP-001",
  firstName: "Aarav",
  lastName: "Sharma",
  department: "Engineering",
  salary: 125000,
  skills: ["System Architecture", "Microservices", "TypeScript"],
  contact: {
    email: "aarav.sharma@example.com",
    phone: "+91-98230-11223",
    emergencyContactName: "Geeta Sharma"
  }
};

// 4. Array of Typed Objects
const engineeringTeam: Array<{ id: string; name: string; role: string }> = [
  { id: "EMP-001", name: "Aarav Sharma", role: "Lead Architect" },
  { id: "EMP-003", name: "Rohan Verma", role: "Full Stack Developer" },
  { id: "EMP-008", name: "Simran Kaur", role: "QA Automation Specialist" }
];

// ============================================================================
// COMMON TYPE MISTAKES (Safely demonstrated in comments)
// ============================================================================
/*
// Mistake 1: Pushing an incompatible type into an array
// coreSkills.push(42); 
// TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.

// Mistake 2: Mutating a readonly array
// standardCompanyHolidays.push("Christmas");
// TS2339: Property 'push' does not exist on type 'readonly string[]'.

// Mistake 3: Violating tuple length or order
// const badTuple: [string, number] = [100, "ENG"]; 
// TS2322: Type 'number' is not assignable to type 'string'.

// Mistake 4: Mutating a readonly object property
// leadArchitect.id = "EMP-999"; 
// TS2540: Cannot assign to 'id' because it is a read-only property.
*/

// ============================================================================
// EXECUTION & DEMONSTRATION
// ============================================================================
console.log("=== 02: Arrays and Objects Demonstration ===");
console.log(`Core Skills (${coreSkills.length})     :`, coreSkills.join(", "));
const averageRating = quarterlyRatings.reduce((sum, r) => sum + r, 0) / quarterlyRatings.length;
console.log(`Avg Performance Rating: ${averageRating.toFixed(2)} / 5.0`);
console.log(`Department Quota Tuple : Dept: ${departmentBudgetQuota[0]}, Quota: ${departmentBudgetQuota[1]}, Approved: ${departmentBudgetQuota[2]}`);
console.log(`Office Coordinates     : Lat ${corporateOfficeLocation[0]}, Lon ${corporateOfficeLocation[1]}`);
console.log(`Lead Architect         : ${leadArchitect.firstName} ${leadArchitect.lastName} (${leadArchitect.id})`);
console.log(`Emergency Contact      : ${leadArchitect.contact.emergencyContactName} (${leadArchitect.contact.phone})`);
console.log(`Engineering Team Count : ${engineeringTeam.length} members`);
engineeringTeam.forEach((member, idx) => {
  console.log(`  ${idx + 1}. [${member.id}] ${member.name} - ${member.role}`);
});
console.log("============================================\n");

export {};
