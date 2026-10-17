/**
 * 08-generics.ts
 * ============================================================================
 * Topic: Generics in TypeScript (Generic Functions, Interfaces, Classes & Constraints)
 * Domain Context: Reusable API Envelopes, Entity Repositories, and Lookup Tables
 * ============================================================================
 */

// 1. Generic Interface: Standard REST API Response Envelope
interface ApiResponse<TData> {
  status: "success" | "error";
  code: number;
  message: string;
  data: TData;
  metadata?: {
    totalRecords: number;
    page: number;
    limit: number;
  };
}

// 2. Generic Constraint: Entity must have an identifiable `id`
interface Identifiable {
  id: string;
}

// 3. Generic In-Memory Repository Class
class DataRepository<T extends Identifiable> {
  private items: Map<string, T> = new Map();

  public add(item: T): void {
    this.items.set(item.id, item);
  }

  public getById(id: string): T | undefined {
    return this.items.get(id);
  }

  public getAll(): T[] {
    return Array.from(this.items.values());
  }

  public remove(id: string): boolean {
    return this.items.delete(id);
  }

  public count(): number {
    return this.items.size;
  }
}

// 4. Generic Function with Property Constraint (`keyof`)
// Allows safely extracting and sorting by any valid key of object T
function pluckProperty<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

// 5. Generic Utility Types in Action
interface EmployeeRecord extends Identifiable {
  id: string;
  name: string;
  email: string;
  department: string;
  salary: number;
}

// Pick<T, K>: Creates a type with only chosen properties
type EmployeeContactSummary = Pick<EmployeeRecord, "id" | "name" | "email">;

// Omit<T, K>: Drops sensitive or unnecessary properties
type EmployeePublicProfile = Omit<EmployeeRecord, "salary">;

// Record<K, V>: Strongly typed dictionary/map
type DepartmentDirectory = Record<string, EmployeeRecord[]>;

// ============================================================================
// COMMON TYPE MISTAKES (Safely demonstrated in comments)
// ============================================================================
/*
// Mistake 1: Passing non-identifiable object to constrained repository
// const invalidRepo = new DataRepository<{ title: string }>(); 
// TS2344: Type '{ title: string; }' does not satisfy the constraint 'Identifiable'.

// Mistake 2: Accessing a non-existent key with keyof constraint
// pluckProperty(sampleList, "nonExistentKey"); 
// TS2345: Argument of type '"nonExistentKey"' is not assignable to parameter of type '"id" | "name" | "email" ...'.
*/

// ============================================================================
// EXECUTION & DEMONSTRATION
// ============================================================================
console.log("=== 08: Generics Demonstration ===");

// A. Testing Generic API Response
const sampleApiResponse: ApiResponse<EmployeeRecord[]> = {
  status: "success",
  code: 200,
  message: "Successfully retrieved employee records",
  data: [
    { id: "EMP-001", name: "Aarav Sharma", email: "aarav@example.com", department: "Engineering", salary: 125000 },
    { id: "EMP-002", name: "Priya Patel", email: "priya@example.com", department: "Design", salary: 92000 },
    { id: "EMP-003", name: "Rohan Verma", email: "rohan@example.com", department: "Engineering", salary: 85000 }
  ],
  metadata: {
    totalRecords: 3,
    page: 1,
    limit: 10
  }
};
console.log(`API Response (${sampleApiResponse.code})   : ${sampleApiResponse.message}`);

// B. Testing Generic Repository
const employeeRepo = new DataRepository<EmployeeRecord>();
sampleApiResponse.data.forEach((emp) => employeeRepo.add(emp));

console.log(`Repository Record Count : ${employeeRepo.count()}`);
const retrieved = employeeRepo.getById("EMP-002");
console.log(`Looked up [EMP-002]       : ${retrieved?.name} (${retrieved?.department})`);

// C. Testing pluckProperty with keyof
const allEmails = pluckProperty(sampleApiResponse.data, "email");
const allSalaries = pluckProperty(sampleApiResponse.data, "salary");
console.log("Plucked Emails (string[]):", allEmails.join(", "));
console.log("Plucked Salaries (number[]):", allSalaries.join(", "));

// D. Testing Record<string, T[]>
const directory: DepartmentDirectory = {
  Engineering: [sampleApiResponse.data[0], sampleApiResponse.data[2]],
  Design: [sampleApiResponse.data[1]]
};
console.log(`Department Directory Keys:`, Object.keys(directory).join(", "));
console.log(`Engineering Headcount    :`, directory["Engineering"].length);
console.log("==================================\n");

export {};
