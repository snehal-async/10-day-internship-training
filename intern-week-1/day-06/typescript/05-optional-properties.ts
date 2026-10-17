/**
 * 05-optional-properties.ts
 * ============================================================================
 * Topic: Optional Properties, Optional Chaining, Nullish Coalescing, and Utility Types
 * Domain Context: Employee Onboarding Forms, Optional Profiles, and Draft Updates
 * ============================================================================
 */

// 1. Interface with Optional Properties
interface EmployeeProfile {
  id: string;
  fullName: string;
  email: string;
  department: string;
  // Optional Properties using '?'
  phone?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone?: string;
  };
  linkedInUrl?: string;
  githubProfile?: string;
  yearsOfExperience?: number;
  certifications?: string[];
}

// 2. Optional Parameters in Functions
// Note: Optional parameters must always appear AFTER required parameters
function calculateBonus(
  baseSalary: number,
  performanceScore: number,
  specialDiscretionaryBonus?: number
): number {
  const standardBonus = baseSalary * (performanceScore / 100);
  // Nullish coalescing operator `??` provides a fallback only if undefined or null
  const discretionary = specialDiscretionaryBonus ?? 0;
  return Math.round(standardBonus + discretionary);
}

// 3. Optional Chaining (`?.`) for Safe Deep Property Access
function printEmergencyContact(profile: EmployeeProfile): string {
  // Safe navigation prevents "TypeError: Cannot read properties of undefined"
  const contactName = profile.emergencyContact?.name ?? "No emergency contact listed";
  const contactPhone = profile.emergencyContact?.phone ?? "N/A";
  return `${contactName} (Phone: ${contactPhone})`;
}

// 4. Utility Types: Partial<T> and Required<T>
// Partial<T> makes all properties optional - ideal for PATCH / update requests
type EmployeeUpdateDTO = Partial<EmployeeProfile>;

// Required<T> makes all properties mandatory - ideal for full compliance verification
type FullyCompliantEmployee = Required<EmployeeProfile>;

const draftUpdatePayload: EmployeeUpdateDTO = {
  department: "Product Architecture",
  linkedInUrl: "https://linkedin.com/in/aarav-sharma-architect"
  // id, fullName, email, etc. can be omitted in a partial update!
};

// ============================================================================
// COMMON TYPE MISTAKES (Safely demonstrated in comments)
// ============================================================================
/*
// Mistake 1: Placing optional parameter before required parameter
// function badFunction(bonus?: number, baseSalary: number) {}
// TS1016: A required parameter cannot follow an optional parameter.

// Mistake 2: Accessing nested optional property without optional chaining
// const unsafe = profile.emergencyContact.phone; 
// TS18048: 'profile.emergencyContact' is possibly 'undefined'.
*/

// ============================================================================
// EXECUTION & DEMONSTRATION
// ============================================================================
console.log("=== 05: Optional Properties Demonstration ===");

const minimalProfile: EmployeeProfile = {
  id: "EMP-004",
  fullName: "Ananya Iyer",
  email: "ananya.iyer@example.com",
  department: "Human Resources"
  // All optional properties gracefully omitted
};

const comprehensiveProfile: EmployeeProfile = {
  id: "EMP-001",
  fullName: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  department: "Engineering",
  phone: "+91-98230-11223",
  emergencyContact: {
    name: "Geeta Sharma",
    relationship: "Spouse",
    phone: "+91-98230-88776"
  },
  linkedInUrl: "https://linkedin.com/in/aarav-sharma",
  yearsOfExperience: 8,
  certifications: ["GCP Cloud Architect", "CKA Kubernetes"]
};

console.log("Minimal Profile Emergency Contact      :", printEmergencyContact(minimalProfile));
console.log("Comprehensive Profile Emergency Contact:", printEmergencyContact(comprehensiveProfile));
console.log("LinkedIn (Optional Chaining)           :", comprehensiveProfile.linkedInUrl?.toUpperCase() ?? "NOT_PROVIDED");
console.log("Certifications Count                   :", comprehensiveProfile.certifications?.length ?? 0);

// Bonus Calculations
const standardBonus = calculateBonus(100000, 15); // without discretionary bonus
const customBonus = calculateBonus(100000, 15, 5000); // with $5000 discretionary bonus
console.log(`Calculated Standard Bonus              : $${standardBonus.toLocaleString()}`);
console.log(`Calculated Executive Bonus (with grant): $${customBonus.toLocaleString()}`);
console.log(`Partial Update Payload Keys            :`, Object.keys(draftUpdatePayload));
console.log("=============================================\n");

export {};
