# Day 06: TypeScript Practice Modules & Type System Mastery

**10-Day Intern Technical Training & Domain Assessment Program**  
**Author:** snehal-async  
**Directory:** `intern-week-1/day-06/typescript/`

---

## 1. Overview & Objectives

TypeScript is a typed superset of JavaScript that compiles directly to clean JavaScript. It provides static type verification at compile-time, detecting potential runtime bugs (like `undefined` property access, incorrect argument types, and unhandled branches) before code ever executes.

This directory contains 9 standalone, executable TypeScript modules modeling a realistic **Enterprise Employee Management System**. Every module is written with strict TypeScript compiler options (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`) and demonstrates both idiomatic usage and safely commented-out anti-patterns.

---

## 2. Directory Structure

```text
intern-week-1/day-06/typescript/
├── package.json                          # Scripts and project metadata
├── tsconfig.json                         # Strict TypeScript compiler options
├── README.md                             # Comprehensive study and execution guide
├── 01-primitive-types.ts                 # String, number, boolean, null, undefined, inference
├── 02-arrays-and-objects.ts              # Typed arrays, readonly arrays, tuples, object shapes
├── 03-interfaces-and-type-aliases.ts     # Extensible interfaces, union aliases, intersections (&)
├── 04-union-types-and-enums.ts           # String/numeric enums, union literals, discriminated unions
├── 05-optional-properties.ts             # Optional fields (?), optional chaining (?.), nullish (??), Partial<T>
├── 06-functions.ts                       # Parameter/return types, arrow functions, rest params, overloads, async
├── 07-classes.ts                         # OOP, access modifiers, constructors, inheritance, abstract classes
├── 08-generics.ts                        # Generic functions, interfaces, constraints (extends, keyof), utility types
└── 09-type-narrowing-and-type-guards.ts  # typeof, instanceof, in operator, custom guards (is), exhaustive never
```

---

## 3. Curriculum & Concept Breakdown

### Module 01: Primitive Types (`01-primitive-types.ts`)
- **Key Concepts:** `string`, `number`, `boolean`, `null`, `undefined`, template strings, type inference.
- **Enterprise Context:** Employee IDs (`"EMP-101"`), compensation calculations, probation flags, and intentional `null` values for active employee termination dates.
- **Compiler Safety:** Demonstrates why assigning `"true"` (string) to a boolean or `101` (number) to an ID string fails compile-time checks.

### Module 02: Arrays, Tuples & Objects (`02-arrays-and-objects.ts`)
- **Key Concepts:** `T[]`, `Array<T>`, `readonly T[]`, fixed-length ordered Tuples (`[string, number, boolean]`), named tuple labels, inline object types, and `readonly` properties.
- **Enterprise Context:** Skills inventory, quarterly performance ratings, department headcount quota tuples, and corporate office GPS coordinates.
- **Compiler Safety:** Prevents accidental `.push()` mutations on `readonly` arrays and unauthorized reassignments to `readonly` employee IDs.

### Module 03: Interfaces & Type Aliases (`03-interfaces-and-type-aliases.ts`)
- **Key Concepts:** Object contracts with `interface`, interface inheritance with `extends`, declaration merging, type aliases with `type`, and intersection types (`&`).
- **Enterprise Context:** Base person profile extended into `IEmployee`, specialized `IManager` with leave approval methods, and composite `SoftwareEngineer` type intersecting role + skills + evaluations.
- **Comparison:** When to choose `interface` (for extensible object models and OOP contracts) vs `type` (for unions, primitives, and complex computed shapes).

### Module 04: Union Types, Enums & Discriminated Unions (`04-union-types-and-enums.ts`)
- **Key Concepts:** String Enums (`Department`), Numeric Enums (`AccessLevel`), String Literal Unions (`"Active" | "Inactive" | "On Leave"`), and Discriminated Unions with exhaustive `switch/case` pattern matching.
- **Enterprise Context:** Multi-department directory, multi-tier RBAC access levels, and heterogeneous HR events (`SALARY_CREDITED`, `PROMOTION_AWARDED`, `PERFORMANCE_LOGGED`).
- **Compiler Safety:** Demonstrates how TypeScript guarantees exhaustive handling using `const _exhaustiveCheck: never = event`.

### Module 05: Optional Properties & Nullish Handling (`05-optional-properties.ts`)
- **Key Concepts:** Optional fields (`?`), optional parameters, optional chaining (`?.`), nullish coalescing (`??`), and utility types (`Partial<T>`, `Required<T>`).
- **Enterprise Context:** Onboarding forms with optional emergency contacts, discretionary performance bonus grants, and partial update (PATCH) payloads.
- **Compiler Safety:** Eliminates `TypeError: Cannot read properties of undefined` at compile time.

### Module 06: Typed Functions & Asynchronous Execution (`06-functions.ts`)
- **Key Concepts:** Parameter annotations, return type enforcement, default parameters, rest parameters (`...args`), higher-order predicate callbacks, function overloading, and `Promise<T>`.
- **Enterprise Context:** Net take-home salary and tax calculations, department expense aggregations, polymorphic employee lookups (by ID, Email, or Name + Dept), and async employee database queries.

### Module 07: Classes and Object-Oriented Programming (`07-classes.ts`)
- **Key Concepts:** ES6 classes in TypeScript, parameter property shorthand, access modifiers (`public`, `private`, `protected`, `readonly`), getters/setters with validation, abstract base classes, and interface implementation (`implements`).
- **Enterprise Context:** `CorporateMember` abstract class extended by `RegularStaff` and `ExecutiveManager`, with salary encapsulation and distinct compensation calculations.

### Module 08: Generics and Reusable Component Architecture (`08-generics.ts`)
- **Key Concepts:** Generic parameters (`<T>`), generic constraints (`<T extends Identifiable>`), `keyof` index constraints, generic repositories, and built-in utilities (`Pick`, `Omit`, `Record`).
- **Enterprise Context:** Standard REST API response envelope (`ApiResponse<TData>`), strongly typed in-memory `DataRepository<T>`, and dynamic property extraction (`pluckProperty`).

### Module 09: Type Narrowing and Type Guards (`09-type-narrowing-and-type-guards.ts`)
- **Key Concepts:** Control flow analysis, `typeof` guards, `instanceof` class guards, `in` property existence checks, user-defined type predicates (`worker is FullTimeWorker`), and exhaustive `never` checks.
- **Enterprise Context:** Heterogeneous payroll processing across full-time staff, hourly contractors, and stipended interns with custom access pass verification.

---

## 4. Execution & Verification Guide

### Prerequisites
Node.js (v18+) is required. TypeScript and execution tools can be run directly via `npx`.

### 1. Compile & Type-Check (Zero-Emit Check)
To verify that all 9 files compile strictly with zero type errors:
```bash
# Inside intern-week-1/day-06/typescript/
npx -y -p typescript tsc --noEmit
```

### 2. Execute Standalone Modules
You can run any individual module directly with `npx tsx`:
```bash
npx -y tsx 01-primitive-types.ts
npx -y tsx 02-arrays-and-objects.ts
npx -y tsx 03-interfaces-and-type-aliases.ts
npx -y tsx 04-union-types-and-enums.ts
npx -y tsx 05-optional-properties.ts
npx -y tsx 06-functions.ts
npx -y tsx 07-classes.ts
npx -y tsx 08-generics.ts
npx -y tsx 09-type-narrowing-and-type-guards.ts
```

### 3. Run All Modules Sequentially
```bash
npm run run:all
```
