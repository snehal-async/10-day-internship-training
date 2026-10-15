# Day 1: Programming Fundamentals, DSA & Employee Management CLI

**10-Day Intern Technical Training & Domain Assessment Program**  
**Track:** Engineering Fundamentals, Problem Solving, and Practical Software Development  
**Author:** snehal-async  
**Repository:** [https://github.com/snehal-async/10-day-internship-training](https://github.com/snehal-async/10-day-internship-training)

---

## 📑 Table of Contents
1. [Overview & Problem Statement](#-overview--problem-statement)
2. [Day 1 Objectives](#-day-1-objectives)
3. [Core Programming Fundamentals Demonstrated](#-core-programming-fundamentals-demonstrated)
4. [15 Data Structures & Algorithms Exercises](#-15-data-structures--algorithms-exercises)
5. [Employee Management CLI Application](#-employee-management-cli-application)
6. [Project Structure](#-project-structure)
7. [Prerequisites & Installation](#-prerequisites--installation)
8. [Execution Commands](#-execution-commands)
9. [Example Interactive CLI Workflow](#-example-interactive-cli-workflow)
10. [Actual Automated Testing Results](#-actual-automated-testing-results)
11. [Algorithm Complexity Matrix](#-algorithm-complexity-matrix)
12. [Technical Challenges & Engineering Decisions](#-technical-challenges--engineering-decisions)
13. [Future Improvements](#-future-improvements)

---

## 📋 Overview & Problem Statement

### Problem Statement
Software engineering requires a disciplined foundation in core programming semantics, algorithmic complexity evaluation, structured data processing, and defensive system design. Beginning engineers frequently rely on high-level framework abstractions and black-box library methods (such as `Array.prototype.reverse()`, `Math.max()`, or `Array.prototype.sort()`) without mastering the underlying pointer operations, data flow mechanics, memory implications, and failure modes.

### Day 1 Deliverables
To establish these essential technical competencies, Day 1 delivers:
1. **15 Algorithmic Problem Solutions:** Standalone, modular implementations with zero dependencies on black-box utilities, featuring comprehensive edge-case handling and rigorous complexity analysis.
2. **An Interactive Employee Management CLI System:** A menu-driven application built using a decoupled architecture (Validators, Store, Service, and Menu) with resilient JSON file persistence and complete lifecycle management.
3. **Deterministic Automated Test Suites:** Comprehensive unit and integration test coverage using Node.js's native test runner (`node:test`) and assertion library (`node:assert/strict`).

---

## 🎯 Day 1 Objectives

- Master modern JavaScript (ES6+) semantics: variable declarations, primitive vs. reference types, scopes, loops, and OOP encapsulation.
- Implement fundamental data structures and classical algorithms from first principles (Strings, Arrays, Sets, Hash Maps, Stacks, Queues, Kadane's Algorithm, Bubble Sort).
- Architect clean, maintainable, modular software following the Separation of Concerns (SoC) principle.
- Implement resilient data persistence that safeguards files against corrupted data states.
- Execute automated tests covering normal paths, edge cases, invalid inputs, and persistence resilience.
- Maintain a structured, professional Git commit history adhering to conventional commit specifications.

---

## 💡 Core Programming Fundamentals Demonstrated

### 1. Variables and Constants (`let` vs. `const`)
- `const` is employed by default for all references, imports, class declarations, and immutable variables to prevent unintentional reassignment.
- `let` is strictly utilized for loop counters (e.g., `for (let i = 0; i < len; i++)`), accumulator pointers, and state flags (e.g., `swapped` in Bubble Sort, `running` in CLI menu loop).

### 2. Primitive vs. Reference Types
- **Primitives (Number, String, Boolean, null, undefined):** Passed by value. Demonstrated in string manipulation (`reverseString`, `isPalindrome`) and mathematical evaluations (`findLargestNumber`, `findMissingNumber`).
- **Reference Types (Array, Object, Set, Map):** Passed by reference. Demonstrated in immutability practices where arrays are cloned (e.g., `[...arr]` in `bubbleSort` and `[...this.#items]` in `Stack.toArray()`) to ensure callers' original data structures remain unmutated.

### 3. Operators
- **Arithmetic:** `+`, `-`, `*`, `/`, `%` used in Gauss's summation formula `(n * (n + 1)) / 2`, subarray accumulators, and payroll statistics.
- **Comparison:** Strict equality (`===`, `!==`) and relational operators (`<`, `<=`, `>`, `>=`) avoiding type-coercion pitfalls.
- **Logical:** `&&`, `||`, `!` used in complex boundary guards and optional fallback defaults (`const { caseSensitive = false } = options`).
- **Assignment:** Compound assignments (`+=`, `-=`, `++`, `--`) used across pointer movements and iterations.

### 4. Control Flow & Loops
- `if...else if...else` branches used for conditional validation and state decisions.
- `while` loops applied in two-pointer algorithms (`mergeSortedArrays`, `isPalindrome`) and queue management.
- `for` loops with early termination (`break`) demonstrated in optimized Bubble Sort.
- `switch...case` applied in `EmployeeMenu.start()` to route user selections cleanly.

### 5. Functions & Scopes
- Reusable modular functions with typed JSDoc parameters and explicit return signatures.
- Arrow functions used in array transformations (`.map()`, `.filter()`, `.reduce()`).
- Scope levels respected: Block scope (`let`/`const` inside loops), Function scope, and Module scope via CommonJS `module.exports`.

### 6. Error Handling & Validation
- Defensive programming with explicit type and range checks:
  - `TypeError` thrown when unexpected data types are passed (e.g., non-string to `reverseString`, non-array to `findLargestNumber`).
  - `RangeError` thrown when operations violate boundary limits (e.g., empty array to `maxSubarraySum`, underflow on empty `Stack` or `Queue`).
  - Graceful `try...catch` blocks handling file I/O errors and corrupted JSON safely.

### 7. Object-Oriented Programming (OOP) & Encapsulation
- Classes used for `Stack`, `Queue`, `EmployeeStore`, `EmployeeService`, and `EmployeeMenu`.
- Private class fields (`#items`, `#headIndex`) ensure true information hiding and prevent external callers from corrupting internal data structures.

---

## 🧩 15 Data Structures & Algorithms Exercises

All exercise modules reside under `intern-week-1/day-01/exercises/`. Each module is self-contained, exported for automated testing, and avoids built-in methods that defeat the problem's objective.

### 1. Reverse a String (`reverse-string.js`)
- **Problem:** Reverse an input string without using `Array.prototype.reverse()`.
- **Approach:** Iterates from `str.length - 1` down to 0, appending each character to an accumulator.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$

### 2. Palindrome Checker (`palindrome.js`)
- **Problem:** Determine if a string reads identically forward and backward.
- **Treatment:** By default, case-insensitive and ignores special characters/punctuation (e.g., `"A man, a plan, a canal: Panama"` is true). Configurable via `options.caseSensitive` and `options.ignoreSpecial`.
- **Approach:** Two pointers (`left` and `right`) advancing toward the center.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$ normalized

### 3. Largest Number (`largest-number.js`)
- **Problem:** Find the maximum value in a non-empty numeric array without `Math.max(...arr)`.
- **Approach:** Initializes `largest` with the first element and performs a single linear pass comparison.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$

### 4. Second-Largest Distinct Number (`second-largest.js`)
- **Problem:** Find the second-largest distinct numeric value. Handle arrays with fewer than two distinct numbers.
- **Approach:** Tracks `first` and `second` max variables in a single pass. Returns `null` if fewer than two distinct values exist.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$

### 5. Remove Duplicates (`remove-duplicates.js`)
- **Problem:** Remove duplicate elements while strictly preserving first occurrence order.
- **Approach:** Uses an auxiliary `Set` for $O(1)$ lookup checks while streaming first-seen items into an output array.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$

### 6. Missing Number in Sequence 1..n (`missing-number.js`)
- **Problem:** Identify the missing number from a sequence containing $1$ through $n$.
- **Approach:** Uses Gauss's summation formula $S = \frac{n(n+1)}{2}$. The missing value is $S - \sum \text{elements}$.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$ for uniqueness validation

### 7. Find Duplicate Numbers (`find-duplicates.js`)
- **Problem:** Identify duplicate values in an array without reporting any duplicate more than once.
- **Approach:** Employs a `seen` set and a `reported` set. When an item is in `seen` and not in `reported`, it is recorded.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$

### 8. Character Frequency (`character-frequency.js`)
- **Problem:** Count the occurrences of each character in a string.
- **Treatment:** Case-sensitive and space-preserving by default. Supports options `{ caseSensitive, ignoreSpaces }`.
- **Approach:** Single linear traversal populating a frequency dictionary object.
- **Complexity:** Time: $O(n)$ | Space: $O(k)$ unique characters

### 9. First Non-Repeating Character (`first-non-repeating.js`)
- **Problem:** Find the first character that appears exactly once, or return `null`.
- **Approach:** Two-pass algorithm: Pass 1 builds frequency counts; Pass 2 inspects characters in original order.
- **Complexity:** Time: $O(n)$ | Space: $O(k)$

### 10. Merge Two Sorted Arrays (`merge-sorted-arrays.js`)
- **Problem:** Merge two sorted arrays into one sorted array without `Array.prototype.sort()`.
- **Approach:** Two pointers comparing elements and pushing the smaller value, followed by appending remaining tails.
- **Complexity:** Time: $O(n + m)$ | Space: $O(n + m)$

### 11. Common Elements (`common-elements.js`)
- **Problem:** Find common elements between two arrays.
- **Treatment:** Set intersection (unique elements) by default; multiset intersection supported via `retainDuplicates: true`.
- **Complexity:** Time: $O(n + m)$ | Space: $O(\min(n, m))$

### 12. Stack Data Structure (`stack.js`)
- **Problem:** Implement a LIFO stack with `push`, `pop`, `peek`, `isEmpty`, and `size`.
- **Approach:** Encapsulated ES6 class with private field `#items`. Protects against stack underflow via descriptive errors.
- **Complexity:** Operations: $O(1)$ | Space: $O(n)$

### 13. Queue Data Structure (`queue.js`)
- **Problem:** Implement a FIFO queue with `enqueue`, `dequeue`, `front`, `isEmpty`, and `size`.
- **Approach:** Encapsulated ES6 class using `#headIndex` offset for amortized $O(1)$ dequeues, with periodic space compaction.
- **Complexity:** Operations: $O(1)$ amortized | Space: $O(n)$

### 14. Maximum Subarray Sum (`maximum-subarray-sum.js`)
- **Problem:** Find the contiguous subarray with the maximum sum (Kadane's Algorithm), supporting all negative numbers.
- **Approach:** At each index, `currentSum = Math.max(arr[i], currentSum + arr[i])` and `maxSum = Math.max(maxSum, currentSum)`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$

### 15. Bubble Sort (`bubble-sort.js`)
- **Problem:** Sort an array in ascending order without using built-in sort.
- **Approach:** Adjacent element swaps with early-exit flag `swapped`. Preserves caller array by sorting a clone.
- **Complexity:** Best: $O(n)$ | Average/Worst: $O(n^2)$ | Auxiliary Space: $O(1)$

---

## 🏢 Employee Management CLI Application

The Employee Management application (`employee-management/`) provides full terminal-based lifecycle management of employee records with clean modularity:

```text
employee-management/
├── src/
│   ├── index.js             # Bootstrap and error boundary
│   ├── employee-service.js  # Business domain logic (all 8 features)
│   ├── employee-store.js    # Resilient JSON file persistence
│   ├── validators.js        # Strict input sanitization and verification
│   └── menu.js              # Readline-driven interactive terminal interface
├── data/
│   └── .gitkeep             # Preserves data directory structure in Git
└── tests/                   # Automated native test suites
```

### The 8 Core Features
1. **Add Employee:** Validates unique ID, non-empty name, non-empty department, and positive numeric salary.
2. **Update Employee:** Updates specific fields while keeping existing data if fields are left blank.
3. **Delete Employee:** Permanently deletes an employee only after explicit confirmation (`y/N`).
4. **Search Employee:** Dual search modes supporting exact ID lookups and case-insensitive substring name matches.
5. **List All Employees:** Displays all registered employees in a formatted, aligned ASCII table.
6. **Highest Salary:** Identifies highest earners, with complete support for multiple employees sharing the top salary (ties).
7. **Average Salary:** Computes active employee count, total payroll, and average salary. Handles empty rosters safely.
8. **Department Filter:** Filters employee records by department name (case-insensitive).

---

## 📁 Project Structure

```text
10-day-internship-training/
├── README.md                                  # Root repository overview
├── .gitignore                                 # Git exclusions (.json, node_modules, logs)
└── intern-week-1/
    └── day-01/
        ├── README.md                          # Comprehensive Day 1 documentation
        ├── package.json                       # Day 1 scripts (npm start, test, exercises)
        ├── exercises/                         # 15 DSA Exercise modules
        │   ├── reverse-string.js
        │   ├── palindrome.js
        │   ├── largest-number.js
        │   ├── second-largest.js
        │   ├── remove-duplicates.js
        │   ├── missing-number.js
        │   ├── find-duplicates.js
        │   ├── character-frequency.js
        │   ├── first-non-repeating.js
        │   ├── merge-sorted-arrays.js
        │   ├── common-elements.js
        │   ├── stack.js
        │   ├── queue.js
        │   ├── maximum-subarray-sum.js
        │   ├── bubble-sort.js
        │   └── run-all.js                     # Batch runner demonstration
        └── employee-management/               # CLI Application
            ├── README.md                      # CLI manual and architecture
            ├── package.json                   # CLI specific package config
            ├── src/
            │   ├── index.js
            │   ├── employee-service.js
            │   ├── employee-store.js
            │   ├── validators.js
            │   └── menu.js
            ├── data/
            │   └── .gitkeep
            └── tests/
                ├── exercises.test.js          # Unit tests for all 15 DSA exercises
                └── employee-management.test.js# Integration tests for all 8 CLI features
```

---

## ⚙️ Prerequisites & Installation

### Prerequisites
- **Node.js:** Version `18.0.0` or higher (verified on Node.js `v24.18.0`).
- **Git:** Version `2.20` or higher.
- **Operating System:** Cross-platform (Windows, macOS, Linux).

### Setup
No external npm packages are required. The entire codebase utilizes native Node.js standard libraries (`node:test`, `node:assert`, `fs`, `path`, `readline`).

```bash
# Navigate to the Day 1 directory
cd intern-week-1/day-01
```

---

## 🚀 Execution Commands

All commands can be executed directly using `npm` or `node`:

### 1. Run all 15 DSA Exercises
```bash
# Via npm script
npm run exercises

# Or directly via Node
node exercises/run-all.js
```

### 2. Run Automated Test Suite
```bash
# Via npm script (runs both test suites)
npm test

# Or directly via Node's native test runner
node --test employee-management/tests/exercises.test.js employee-management/tests/employee-management.test.js
```

### 3. Launch Employee Management CLI
```bash
# Via npm script
npm start

# Or directly via Node
node employee-management/src/index.js
```

---

## 🖥️ Example Interactive CLI Workflow

```text
====================================================
         EMPLOYEE MANAGEMENT SYSTEM (CLI)
====================================================
 1. Add Employee
 2. Update Employee
 3. Delete Employee
 4. Search Employee (by ID or Name)
 5. List All Employees
 6. View Highest Salary Employee(s)
 7. View Average Salary
 8. Filter Employees by Department
 9. Exit Application
====================================================

Enter your choice (1-9): 1

--- [1] Add New Employee ---
Enter Employee ID (e.g., EMP001): EMP001
Enter Employee Name: Alice Cooper
Enter Department: Engineering
Enter Monthly Salary: 95000

[✓] Successfully added employee: Alice Cooper (ID: EMP001)

Press [Enter] to return to main menu...

Enter your choice (1-9): 5

--- [5] All Registered Employees ---

+----------+----------------------+--------------------+----------------+
| ID       | Name                 | Department         | Salary ($)     |
+----------+----------------------+--------------------+----------------+
| EMP001   | Alice Cooper         | Engineering        |      95,000.00 |
| EMP002   | Bob Smith            | Marketing          |      72,000.00 |
| EMP003   | Carlos Rivera        | Engineering        |      95,000.00 |
+----------+----------------------+--------------------+----------------+
Total Records: 3

Press [Enter] to return to main menu...

Enter your choice (1-9): 6

--- [6] Highest Salary Employee(s) ---

Highest Salary Recorded: $95,000.00
Note: A tie of 2 employees share this maximum salary.

+----------+----------------------+--------------------+----------------+
| ID       | Name                 | Department         | Salary ($)     |
+----------+----------------------+--------------------+----------------+
| EMP001   | Alice Cooper         | Engineering        |      95,000.00 |
| EMP003   | Carlos Rivera        | Engineering        |      95,000.00 |
+----------+----------------------+--------------------+----------------+
Total Records: 2
```

---

## 📊 Actual Automated Testing Results

All tests were executed on Node.js `v24.18.0` using `npm test`.

```text
✔ Employee Management - Validation Layer (9.09ms)
✔ Employee Management - Service & Feature Suite (102.67ms)
  ✔ Feature 1: should add a valid employee and persist record
  ✔ Feature 1: should reject duplicate IDs when adding
  ✔ Feature 1: should reject employee with negative or invalid salary
  ✔ Feature 2: should update existing employee fields
  ✔ Feature 2: should reject update on non-existent employee ID
  ✔ Feature 3: should delete an employee by ID
  ✔ Feature 3: should reject deleting a non-existent employee
  ✔ Feature 4: should search employee by exact ID case-insensitively
  ✔ Feature 4: should search employees by name with case-insensitive substring matching
  ✔ Feature 5: should list all employees
  ✔ Feature 6: should identify highest salary employee and handle ties
  ✔ Feature 7: should calculate average salary and handle empty list safely
  ✔ Feature 8: should filter by department case-insensitively
  ✔ Persistence: records should survive application restarts via JSON file
  ✔ Persistence: should throw on malformed JSON without deleting the file
✔ Exercise 1: Reverse String (7.50ms)
✔ Exercise 2: Palindrome Checker (4.14ms)
✔ Exercise 3: Largest Number (2.25ms)
✔ Exercise 4: Second-Largest Distinct Number (1.83ms)
✔ Exercise 5: Remove Duplicates (4.27ms)
✔ Exercise 6: Missing Number (3.97ms)
✔ Exercise 7: Find Duplicate Numbers (2.78ms)
✔ Exercise 8: Character Frequency (2.62ms)
✔ Exercise 9: First Non-Repeating Character (1.68ms)
✔ Exercise 10: Merge Sorted Arrays (3.58ms)
✔ Exercise 11: Common Elements (2.34ms)
✔ Exercise 12: Stack (LIFO) (1.93ms)
✔ Exercise 13: Queue (FIFO) (1.90ms)
✔ Exercise 14: Maximum Subarray Sum (Kadane) (1.94ms)
✔ Exercise 15: Bubble Sort (3.12ms)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ℹ tests 109
ℹ suites 17
ℹ pass 109
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 307.45
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result: 109 passing tests, 0 failures.**

---

## ⏱️ Algorithm Complexity Matrix

| Exercise # | Algorithm / Exercise | Time Complexity (Best) | Time Complexity (Worst) | Auxiliary Space Complexity | Primary Data Structure |
|---|---|---|---|---|---|
| **Ex 1** | Reverse String | $O(n)$ | $O(n)$ | $O(n)$ | String accumulator |
| **Ex 2** | Palindrome Checker | $O(1)$ | $O(n)$ | $O(n)$ | Two-pointer inward scan |
| **Ex 3** | Largest Number | $O(n)$ | $O(n)$ | $O(1)$ | Single pass accumulator |
| **Ex 4** | Second-Largest Distinct | $O(n)$ | $O(n)$ | $O(1)$ | Dual value tracking |
| **Ex 5** | Remove Duplicates | $O(n)$ | $O(n)$ | $O(n)$ | Hash Set (`seen`) |
| **Ex 6** | Missing Number (1..n) | $O(n)$ | $O(n)$ | $O(n)$ | Gauss summation + Set validation |
| **Ex 7** | Find Duplicates | $O(n)$ | $O(n)$ | $O(n)$ | Dual Sets (`seen`, `reported`) |
| **Ex 8** | Character Frequency | $O(n)$ | $O(n)$ | $O(k)$ | Hash Map / Object dictionary |
| **Ex 9** | First Non-Repeating | $O(n)$ | $O(n)$ | $O(k)$ | Two-pass frequency Map |
| **Ex 10** | Merge Sorted Arrays | $O(n + m)$ | $O(n + m)$ | $O(n + m)$ | Two-pointer merge |
| **Ex 11** | Common Elements | $O(n + m)$ | $O(n + m)$ | $O(\min(n, m))$ | Set / Multiset Map |
| **Ex 12** | Stack (LIFO) | $O(1)$ | $O(1)$ | $O(n)$ | Private Array (`#items`) |
| **Ex 13** | Queue (FIFO) | $O(1)$ amortized | $O(1)$ amortized | $O(n)$ | Pointer offset + array compaction |
| **Ex 14** | Kadane's Algorithm | $O(n)$ | $O(n)$ | $O(1)$ | Dynamic accumulators |
| **Ex 15** | Bubble Sort | $O(n)$ | $O(n^2)$ | $O(1)$ | In-place swaps on cloned array |

*$n, m$: lengths of respective inputs; $k$: number of distinct characters in alphabet ($k \le n$).*

---

## 🛠️ Technical Challenges & Engineering Decisions

### 1. Parent Directory Git Collision
- **Observation:** Running `git status` from the workspace root initially reported deletions and hundreds of untracked personal files located in the Windows user profile (`C:\Users\LENOVO`).
- **Diagnosis:** A `.git` folder had previously been initialized in `C:\Users\LENOVO` pointing to an unrelated repository.
- **Resolution:** A dedicated Git repository was cleanly initialized inside `c:\Users\LENOVO\OneDrive\Desktop\10-day-internship-training` with its remote pointed to `https://github.com/snehal-async/10-day-internship-training.git`. This isolated the project completely and prevented accidental staging of home directory files.

### 2. Resilient Persistence vs. Silent Data Loss
- **Design Decision:** In typical beginner projects, encountering an invalid JSON data file causes the code to either crash or overwrite the file with an empty array `[]`. If an external process or user edit damaged the file, overwriting it would destroy potentially recoverable records.
- **Implementation:** `EmployeeStore.load()` verifies file integrity. If parsing fails, it throws a descriptive error and halts without mutating or truncating the file on disk.

### 3. Queue Dequeue Efficiency in JavaScript
- **Challenge:** In JavaScript, using `Array.prototype.shift()` on an array of length $n$ takes $O(n)$ time because all subsequent elements must be shifted in memory.
- **Resolution:** `Queue` tracks a private `#headIndex` pointer, achieving true $O(1)$ dequeue operations. A periodic compaction step recycles memory once deleted slots exceed 100 items.

### 4. Handling Highest Salary Ties
- **Design Decision:** In real corporate payrolls, multiple employees may share the top salary. Returning only a single record causes loss of information.
- **Implementation:** `EmployeeService.getHighestSalaryEmployees()` identifies the maximum salary and filters all employees earning that exact maximum, returning a complete list alongside metadata indicating tie status.

### 5. Safe Automated Persistence Testing
- **Challenge:** Automated tests that write to `data/employees.json` could pollute user data or cause cross-test race conditions.
- **Resolution:** `employee-management.test.js` generates an isolated temporary directory in the OS temp folder for each test execution (`fs.mkdtempSync`), ensuring 100% test isolation and cleaning up temporary files after each test run.

---

## 🔮 Future Improvements

1. **Persistent Pagination & Sorting:** Add CLI pagination and column-based sorting (`sort by salary asc/desc`, `sort by name`) for rosters with hundreds of records.
2. **Export Capabilities:** Add features to export employee records and payroll reports into CSV and PDF formats.
3. **Audit Logging:** Maintain a timestamped transaction log (`audit.log`) recording when employees are added, modified, or deleted.
4. **Interactive Pagination TUI:** Enhance the CLI with terminal UI libraries such as `blessed` or `@inquirer/prompts` for arrow-key navigation.
