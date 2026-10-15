# Day 1: Programming Fundamentals, DSA & Employee Management CLI

**10-Day Intern Technical Training & Domain Assessment Program**  
**Track:** Engineering Fundamentals, Problem Solving, and Practical Software Development  
**Author:** snehal-async  

---

## 📋 Overview

Day 1 establishes foundational programming capabilities, analytical problem-solving skills, and clean coding practices. The deliverables comprise:
1. **Programming Fundamentals:** Core JavaScript constructs including scoping, data types, operators, control flow, functions, error handling, and object-oriented encapsulation.
2. **15 Data Structures & Algorithms Exercises:** Modular implementations with input validation, algorithmic problem descriptions, and time/space complexity documentation.
3. **Employee Management CLI Application:** A robust, menu-driven command-line system featuring eight core management functions and safe JSON persistence.
4. **Automated Testing Suite:** Native unit and integration tests covering typical, boundary, and error scenarios.

---

## 🎯 Day 1 Objectives

- Develop fluency in modern JavaScript (ES6+) without relying on black-box utilities where algorithmic mechanics are being evaluated.
- Implement classical algorithms and data structures (Strings, Arrays, Hash Maps, Stacks, Queues, Kadane's algorithm, Bubble Sort).
- Design and structure a modular Node.js application separating business logic, data persistence, and interactive user interface.
- Implement resilient error handling and data validation.
- Verify software correctness with deterministic automated testing using Node.js's native test runner (`node:test`).
- Maintain a clean, professional Git commit workflow following conventional commit standards.

---

## 🗂️ Day 1 Directory Layout

```text
day-01/
├── README.md                          # In-depth Day 1 documentation and test verification
├── package.json                       # Scripts for running exercises, CLI, and test suite
├── exercises/                         # 15 DSA exercise modules
│   ├── reverse-string.js              # Exercise 1: String reversal without built-in reverse
│   ├── palindrome.js                  # Exercise 2: Palindrome verification
│   ├── largest-number.js              # Exercise 3: Maximum value finder
│   ├── second-largest.js              # Exercise 4: Second-largest distinct value
│   ├── remove-duplicates.js           # Exercise 5: Deduplication preserving order
│   ├── missing-number.js              # Exercise 6: Missing number in sequence 1..n
│   ├── find-duplicates.js             # Exercise 7: Identification of duplicate elements
│   ├── character-frequency.js         # Exercise 8: Character occurrence frequency mapping
│   ├── first-non-repeating.js         # Exercise 9: First unique character finder
│   ├── merge-sorted-arrays.js         # Exercise 10: Two-pointer sorted array merger
│   ├── common-elements.js             # Exercise 11: Set intersection of two arrays
│   ├── stack.js                       # Exercise 12: Encapsulated Stack LIFO data structure
│   ├── queue.js                       # Exercise 13: Encapsulated Queue FIFO data structure
│   ├── maximum-subarray-sum.js        # Exercise 14: Kadane's algorithm
│   ├── bubble-sort.js                 # Exercise 15: Classical bubble sort algorithm
│   └── run-all.js                     # Batch runner demonstration
└── employee-management/               # Modular CLI application
    ├── README.md                      # CLI application architecture & operations
    ├── package.json                   # CLI specific package configuration
    ├── src/
    │   ├── index.js                   # CLI entry point
    │   ├── employee-service.js        # Domain business logic
    │   ├── employee-store.js          # Resilient JSON file store
    │   ├── validators.js              # Input validation layer
    │   └── menu.js                    # Interactive terminal user interface
    ├── data/
    │   └── .gitkeep                   # Git tracking placeholder
    └── tests/
        ├── exercises.test.js          # Unit tests for all 15 DSA modules
        └── employee-management.test.js# Integration tests for all 8 CLI features
```

---

## ⚙️ Prerequisites & Execution

### Prerequisites
- Node.js `v18.0.0` or higher (tested on Node.js `v24.18.0`).
- Git `v2.20+`.

### Quick Commands

```bash
# Navigate to Day 1
cd intern-week-1/day-01

# Run all 15 DSA exercises with demonstrations
npm run exercises

# Run automated tests
npm test

# Start the Employee Management CLI
npm start
```
