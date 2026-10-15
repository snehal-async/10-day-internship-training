# 10-Day Intern Technical Training & Domain Assessment Program

Welcome to the repository for the **10-Day Intern Technical Training & Domain Assessment Program**. This repository serves as the central workspace for daily engineering assignments, data structures and algorithms (DSA) challenges, domain-specific projects, and progressive technical milestones.

---

## 🎯 Program Overview

The 10-Day Internship Training Program is an intensive, hands-on engineering curriculum designed to build and assess foundational software engineering competencies, algorithmic problem solving, clean code practices, automated testing, and domain specialization across Web Development and AI/ML.

### Program Objectives
- **Core Engineering Fundamentals:** Master programming constructs, data structures, modular software design, and encapsulation.
- **Problem Solving & Algorithms:** Implement and analyze fundamental algorithms with proper time and space complexity evaluations.
- **Practical System Building:** Design and build modular, testable applications with clean architecture and reliable data persistence.
- **Quality Assurance & Verification:** Write comprehensive unit and integration tests using native testing frameworks.
- **Professional Git & GitHub Workflows:** Maintain a clear, milestone-driven commit history and clean repository hygiene.

---

## 📂 Repository & Folder Organization

The project is structured into weekly and daily milestone folders to maintain clean separation of concerns and transparent progress tracking:

```text
10-day-internship-training/
├── README.md                                  # Repository overview and roadmap guide
├── .gitignore                                 # Git ignore configuration
└── intern-week-1/                             # Week 1 technical training deliverables
    ├── day-01/                                # Day 1: Programming Fundamentals & Problem Solving
    │   ├── README.md                          # In-depth Day 1 documentation & results
    │   ├── package.json                       # Day 1 project scripts and configuration
    │   ├── exercises/                         # 15 standalone Data Structures & Algorithms modules
    │   │   ├── reverse-string.js
    │   │   ├── palindrome.js
    │   │   ├── largest-number.js
    │   │   ├── second-largest.js
    │   │   ├── remove-duplicates.js
    │   │   ├── missing-number.js
    │   │   ├── find-duplicates.js
    │   │   ├── character-frequency.js
    │   │   ├── first-non-repeating.js
    │   │   ├── merge-sorted-arrays.js
    │   │   ├── common-elements.js
    │   │   ├── stack.js
    │   │   ├── queue.js
    │   │   ├── maximum-subarray-sum.js
    │   │   ├── bubble-sort.js
    │   │   └── run-all.js                     # Terminal runner for all 15 DSA exercises
    │   └── employee-management/               # Practical Application: Employee Management CLI
    │       ├── README.md                      # CLI application architecture & user manual
    │       ├── package.json                   # CLI specific package configuration
    │       ├── src/
    │       │   ├── index.js                   # Application entry point
    │       │   ├── employee-service.js        # Core business logic service
    │       │   ├── employee-store.js          # Resilient JSON file persistence
    │       │   ├── validators.js              # Robust input validation logic
    │       │   └── menu.js                    # Interactive terminal menu interface
    │       ├── data/
    │       │   └── .gitkeep                   # Tracks data folder; runtime JSON ignored
    │       └── tests/
    │           ├── exercises.test.js          # Native test suite for all 15 exercises
    │           └── employee-management.test.js# Native test suite for all 8 CLI features
    ├── day-02/                                # [Upcoming] Day 2: Python Development
    ├── day-03/                                # [Upcoming] Day 3: Data & AI/ML (NumPy, Pandas)
    ├── day-04/                                # [Upcoming] Day 4: Machine Learning
    └── day-05/                                # [Upcoming] Day 5: Modern JavaScript & Async
```

> **Note:** Week 2 (Days 06 through 10) will be added under `intern-week-2/` as the training program progresses.

---

## 📅 10-Day Training Roadmap & Status

| Day | Focus Area | Key Topics | Deliverables & Status |
| :---: | :--- | :--- | :--- |
| **Day 01** | **Programming Fundamentals & Problem Solving** | JavaScript (ES6+), DSA, Modular Design, Git Workflow, Testing | **Completed** (`intern-week-1/day-01/`) |
| **Day 02** | Python Development | Syntax, OOP, File I/O, Modules, Exception Handling | *Scheduled (Upcoming)* |
| **Day 03** | Data Analysis & AI/ML Fundamentals | NumPy, Pandas, Matplotlib, Data Wrangling | *Scheduled (Upcoming)* |
| **Day 04** | Machine Learning | Supervised & Unsupervised Learning, Scikit-learn, Model Evaluation | *Scheduled (Upcoming)* |
| **Day 05** | Advanced JavaScript | Asynchronous JS, Promises, Async/Await, Web APIs, Fetch | *Scheduled (Upcoming)* |
| **Day 06** | TypeScript + React | TypeScript Static Typing, React Components, Hooks, State | *Scheduled (Upcoming)* |
| **Day 07** | Next.js + Backend Services | Next.js App Router, Node.js, Express, RESTful APIs | *Scheduled (Upcoming)* |
| **Day 08** | Databases & Backend APIs | Relational Databases, SQL Queries, Schema Design, Laravel / ORM | *Scheduled (Upcoming)* |
| **Day 09** | Angular + TypeScript + Integration | Angular Architecture, Components, Services, RxJS, HTTP Client | *Scheduled (Upcoming)* |
| **Day 10** | Capstone Final Project | End-to-end Full-Stack Application or AI/ML System & Presentation | *Scheduled (Upcoming)* |

---

## 🛠️ Technologies Used

### Current Milestone (Day 01)
- **Language:** JavaScript (Node.js ES6+ CommonJS modules)
- **Runtime:** Node.js (v18+ recommended; tested on v24.18.0)
- **Testing:** Node.js native test runner (`node:test`) and assertion library (`node:assert/strict`)
- **Version Control:** Git & GitHub

### Upcoming Curriculum Technologies
- **Python Stack:** Python 3, NumPy, Pandas, Matplotlib, Scikit-learn
- **Frontend Stack:** React, Next.js, Angular, TypeScript, TailwindCSS
- **Backend & Database:** Node.js, Express, Laravel / PHP, MySQL / PostgreSQL

---

## 🚀 Navigating to Day 1

All Day 1 code, exercises, interactive CLI application, and comprehensive documentation are located in:

📁 [`intern-week-1/day-01/`](./intern-week-1/day-01/)

### Quick Start Commands
From the project root:

```bash
# Navigate to the Day 1 directory
cd intern-week-1/day-01

# Run all 15 DSA exercises with demonstrations
npm run exercises

# Run the complete automated test suite (exercises + CLI)
npm test

# Launch the interactive Employee Management CLI
npm start
```

For complete implementation details, complexity analyses, and test execution reports, please consult the [Day 1 Comprehensive Documentation](./intern-week-1/day-01/README.md).
