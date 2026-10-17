/**
 * 06-functions.ts
 * ============================================================================
 * Topic: Functions in TypeScript (Parameter Types, Return Types, Overloads, Async)
 * Domain Context: Salary Computations, Tax Deductions, and Asynchronous Lookups
 * ============================================================================
 */

// 1. Function Declarations with Explicit Types
function calculateNetSalary(
  grossSalary: number,
  taxRatePercent: number,
  providentFundRate: number = 0.12 // Default parameter with type inference
): number {
  const taxDeduction = grossSalary * (taxRatePercent / 100);
  const pfDeduction = grossSalary * providentFundRate;
  return Math.round(grossSalary - taxDeduction - pfDeduction);
}

// 2. Arrow Functions with Typed Parameters & Inferred Return
const formatCurrency = (amount: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
};

// 3. Function Type Signatures (Callbacks & Higher-Order Functions)
type FilterPredicate = (employee: { department: string; salary: number }) => boolean;

function filterEmployees(
  roster: Array<{ id: string; name: string; department: string; salary: number }>,
  predicate: FilterPredicate
): Array<{ id: string; name: string; department: string; salary: number }> {
  return roster.filter(predicate);
}

// 4. Rest Parameters (Variadic Functions)
function computeDepartmentExpenses(
  departmentName: string,
  ...expenseItems: number[]
): { department: string; totalExpense: number; itemsCount: number } {
  const totalExpense = expenseItems.reduce((acc, curr) => acc + curr, 0);
  return {
    department: departmentName,
    totalExpense,
    itemsCount: expenseItems.length
  };
}

// 5. Function Overloading
// Step A: Declare Overload Signatures
function getEmployeeInfo(id: number): string;
function getEmployeeInfo(email: string): string;
function getEmployeeInfo(name: string, department: string): string;

// Step B: Single Implementation Signature compatible with all overloads
function getEmployeeInfo(param1: string | number, param2?: string): string {
  if (typeof param1 === "number") {
    return `Looking up employee by numeric ID: EMP-${param1.toString().padStart(3, "0")}`;
  } else if (typeof param1 === "string" && param2 !== undefined) {
    return `Looking up employee by Name: '${param1}' in Department: '${param2}'`;
  } else {
    return `Looking up employee by Email: '${param1}'`;
  }
}

// 6. Asynchronous Functions with Promise<T>
interface AsyncLookupResult {
  found: boolean;
  timestamp: string;
  record: { id: string; name: string; role: string } | null;
}

async function simulateFetchEmployeeRecord(id: string): Promise<AsyncLookupResult> {
  // Simulating async network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        found: true,
        timestamp: new Date().toISOString(),
        record: {
          id,
          name: "Priya Patel",
          role: "Senior UX Researcher"
        }
      });
    }, 100);
  });
}

// ============================================================================
// COMMON TYPE MISTAKES (Safely demonstrated in comments)
// ============================================================================
/*
// Mistake 1: Returning wrong type from annotated function
// function badTax(): number { return "100"; } 
// TS2322: Type 'string' is not assignable to type 'number'.

// Mistake 2: Missing arguments in function call without defaults
// calculateNetSalary(85000); 
// TS2554: Expected 2-3 arguments, but got 1.
*/

// ============================================================================
// EXECUTION & DEMONSTRATION
// ============================================================================
async function runDemonstration(): Promise<void> {
  console.log("=== 06: Functions Demonstration ===");

  const gross = 120000;
  const net = calculateNetSalary(gross, 20, 0.12);
  console.log(`Gross Salary: ${formatCurrency(gross)} -> Net Take-Home: ${formatCurrency(net)}`);

  // Testing Higher-Order Function
  const sampleTeam = [
    { id: "EMP-001", name: "Aarav", department: "Engineering", salary: 125000 },
    { id: "EMP-002", name: "Priya", department: "Design", salary: 92000 },
    { id: "EMP-003", name: "Rohan", department: "Engineering", salary: 85000 }
  ];

  const highEarners = filterEmployees(sampleTeam, (emp) => emp.salary >= 90000);
  console.log(`High Earners (>= $90k):`, highEarners.map((e) => `${e.name} ($${e.salary})`).join(", "));

  // Rest parameters
  const opsExpense = computeDepartmentExpenses("Operations", 4500, 12000, 3200, 890);
  console.log(`Department Expense for ${opsExpense.department}: ${formatCurrency(opsExpense.totalExpense)} (${opsExpense.itemsCount} items)`);

  // Overloads
  console.log("Overload 1 (Numeric ID) :", getEmployeeInfo(101));
  console.log("Overload 2 (Email)      :", getEmployeeInfo("aarav.sharma@example.com"));
  console.log("Overload 3 (Name + Dept):", getEmployeeInfo("Rohan Verma", "Engineering"));

  // Async function execution
  const asyncResult = await simulateFetchEmployeeRecord("EMP-002");
  console.log("Async Lookup Result     :", JSON.stringify(asyncResult.record));
  console.log("===================================\n");
}

runDemonstration();

export {};
