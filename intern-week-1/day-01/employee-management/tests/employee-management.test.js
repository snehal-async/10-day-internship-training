/**
 * Automated Test Suite: Employee Management CLI System
 *
 * Built with Node.js native test runner (node:test) and assertions (node:assert/strict).
 * Covers all 8 core features, input validation, edge cases, and JSON persistence resilience.
 */

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const { EmployeeService } = require('../src/employee-service');
const { EmployeeStore } = require('../src/employee-store');
const {
  validateId,
  validateName,
  validateDepartment,
  validateSalary,
  validateEmployee
} = require('../src/validators');

describe('Employee Management - Validation Layer', () => {
  it('should validate and sanitize valid IDs', () => {
    assert.strictEqual(validateId('  EMP001  '), 'EMP001');
    assert.strictEqual(validateId(101), '101');
  });

  it('should reject empty, null, or blank IDs', () => {
    assert.throws(() => validateId(''), RangeError);
    assert.throws(() => validateId('   '), RangeError);
    assert.throws(() => validateId(null), RangeError);
  });

  it('should reject duplicate IDs (case-insensitive)', () => {
    const existing = [{ id: 'EMP001', name: 'John' }];
    assert.throws(() => validateId('emp001', existing), Error);
    assert.throws(() => validateId('EMP001', existing), Error);
  });

  it('should allow same ID during an update if updating the same employee', () => {
    const existing = [{ id: 'EMP001', name: 'John' }];
    assert.strictEqual(validateId('EMP001', existing, true, 'EMP001'), 'EMP001');
  });

  it('should validate and sanitize names', () => {
    assert.strictEqual(validateName('  Alice Smith  '), 'Alice Smith');
    assert.throws(() => validateName('   '), RangeError);
    assert.throws(() => validateName(123), TypeError);
  });

  it('should validate and sanitize departments', () => {
    assert.strictEqual(validateDepartment('  Engineering  '), 'Engineering');
    assert.throws(() => validateDepartment(''), RangeError);
    assert.throws(() => validateDepartment(null), TypeError);
  });

  it('should validate and round numeric salaries', () => {
    assert.strictEqual(validateSalary(75000), 75000);
    assert.strictEqual(validateSalary('82500.556'), 82500.56);
    assert.throws(() => validateSalary(-500), RangeError);
    assert.throws(() => validateSalary(0), RangeError);
    assert.throws(() => validateSalary('abc'), TypeError);
    assert.throws(() => validateSalary(Infinity), TypeError);
    assert.throws(() => validateSalary(NaN), TypeError);
  });
});

describe('Employee Management - Service & Feature Suite', () => {
  let tempFilePath;
  let store;
  let service;

  beforeEach(async () => {
    // Generate an isolated temporary file path for tests
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'emp-test-'));
    tempFilePath = path.join(tempDir, 'test-employees.json');
    store = new EmployeeStore(tempFilePath);
    service = new EmployeeService(store);
    await service.init();
  });

  afterEach(() => {
    // Clean up temporary files
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      const dir = path.dirname(tempFilePath);
      if (fs.existsSync(dir)) {
        fs.rmdirSync(dir);
      }
    } catch (e) {
      // Ignore cleanup error if already removed
    }
  });

  // Feature 1: Add Employee
  it('Feature 1: should add a valid employee and persist record', async () => {
    const employee = await service.addEmployee({
      id: 'EMP001',
      name: 'Alice Cooper',
      department: 'Engineering',
      salary: 95000
    });

    assert.strictEqual(employee.id, 'EMP001');
    assert.strictEqual(employee.name, 'Alice Cooper');
    assert.strictEqual(employee.department, 'Engineering');
    assert.strictEqual(employee.salary, 95000);

    const all = service.getAllEmployees();
    assert.strictEqual(all.length, 1);
  });

  it('Feature 1: should reject duplicate IDs when adding', async () => {
    await service.addEmployee({
      id: 'EMP001',
      name: 'Alice Cooper',
      department: 'Engineering',
      salary: 95000
    });

    await assert.rejects(
      async () => {
        await service.addEmployee({
          id: 'emp001',
          name: 'Bob Ross',
          department: 'Design',
          salary: 70000
        });
      },
      /already exists/
    );
  });

  it('Feature 1: should reject employee with negative or invalid salary', async () => {
    await assert.rejects(
      async () => {
        await service.addEmployee({
          id: 'EMP002',
          name: 'Invalid Guy',
          department: 'Sales',
          salary: -100
        });
      },
      RangeError
    );
  });

  // Feature 2: Update Employee
  it('Feature 2: should update existing employee fields', async () => {
    await service.addEmployee({
      id: 'EMP101',
      name: 'John Doe',
      department: 'Finance',
      salary: 60000
    });

    const updated = await service.updateEmployee('EMP101', {
      salary: 72000,
      department: 'Operations'
    });

    assert.strictEqual(updated.salary, 72000);
    assert.strictEqual(updated.department, 'Operations');
    assert.strictEqual(updated.name, 'John Doe'); // Preserved
  });

  it('Feature 2: should reject update on non-existent employee ID', async () => {
    await assert.rejects(
      async () => {
        await service.updateEmployee('EMP_404', { name: 'Ghost' });
      },
      /does not exist/
    );
  });

  // Feature 3: Delete Employee
  it('Feature 3: should delete an employee by ID', async () => {
    await service.addEmployee({
      id: 'EMP201',
      name: 'To Be Deleted',
      department: 'HR',
      salary: 50000
    });

    assert.strictEqual(service.getAllEmployees().length, 1);
    const deleted = await service.deleteEmployee('EMP201');
    assert.strictEqual(deleted.id, 'EMP201');
    assert.strictEqual(service.getAllEmployees().length, 0);
  });

  it('Feature 3: should reject deleting a non-existent employee', async () => {
    await assert.rejects(
      async () => {
        await service.deleteEmployee('NON_EXISTENT');
      },
      /does not exist/
    );
  });

  // Feature 4: Search Employee (by ID and by Name)
  it('Feature 4: should search employee by exact ID case-insensitively', async () => {
    await service.addEmployee({
      id: 'EMP301',
      name: 'Diana Prince',
      department: 'Security',
      salary: 80000
    });

    const found = service.getEmployeeById('emp301');
    assert.ok(found);
    assert.strictEqual(found.name, 'Diana Prince');

    const notFound = service.getEmployeeById('UNKNOWN');
    assert.strictEqual(notFound, null);
  });

  it('Feature 4: should search employees by name with case-insensitive substring matching', async () => {
    await service.addEmployee({ id: 'E1', name: 'Alexander Hamilton', department: 'Treasury', salary: 90000 });
    await service.addEmployee({ id: 'E2', name: 'Alex Turner', department: 'Music', salary: 85000 });
    await service.addEmployee({ id: 'E3', name: 'Elizabeth Bennet', department: 'Literature', salary: 75000 });

    const results = service.searchByName('alex');
    assert.strictEqual(results.length, 2);
    assert.strictEqual(results[0].name, 'Alexander Hamilton');
    assert.strictEqual(results[1].name, 'Alex Turner');

    const emptyResults = service.searchByName('Zack');
    assert.deepStrictEqual(emptyResults, []);
  });

  // Feature 5: List Employees
  it('Feature 5: should list all employees', async () => {
    assert.deepStrictEqual(service.getAllEmployees(), []);

    await service.addEmployee({ id: 'A1', name: 'Person A', department: 'Sales', salary: 50000 });
    await service.addEmployee({ id: 'A2', name: 'Person B', department: 'Sales', salary: 60000 });

    const list = service.getAllEmployees();
    assert.strictEqual(list.length, 2);
  });

  // Feature 6: Highest Salary (including Ties)
  it('Feature 6: should identify highest salary employee and handle ties', async () => {
    // Empty list check
    const emptyResult = service.getHighestSalaryEmployees();
    assert.strictEqual(emptyResult.maxSalary, null);
    assert.deepStrictEqual(emptyResult.employees, []);

    // Single highest
    await service.addEmployee({ id: 'H1', name: 'Regular Guy', department: 'Support', salary: 45000 });
    await service.addEmployee({ id: 'H2', name: 'High Earner 1', department: 'Executive', salary: 120000 });

    const singleResult = service.getHighestSalaryEmployees();
    assert.strictEqual(singleResult.maxSalary, 120000);
    assert.strictEqual(singleResult.employees.length, 1);
    assert.strictEqual(singleResult.employees[0].id, 'H2');

    // Tie for highest
    await service.addEmployee({ id: 'H3', name: 'High Earner 2', department: 'Executive', salary: 120000 });
    const tiedResult = service.getHighestSalaryEmployees();
    assert.strictEqual(tiedResult.maxSalary, 120000);
    assert.strictEqual(tiedResult.employees.length, 2);
    assert.deepStrictEqual(
      tiedResult.employees.map(e => e.id),
      ['H2', 'H3']
    );
  });

  // Feature 7: Average Salary (including Empty Roster Safety)
  it('Feature 7: should calculate average salary and handle empty list safely', async () => {
    // Empty roster
    const zeroStats = service.getAverageSalary();
    assert.strictEqual(zeroStats.count, 0);
    assert.strictEqual(zeroStats.average, 0);
    assert.strictEqual(zeroStats.total, 0);

    // Populated roster
    await service.addEmployee({ id: 'S1', name: 'One', department: 'Tech', salary: 50000 });
    await service.addEmployee({ id: 'S2', name: 'Two', department: 'Tech', salary: 70000 });
    await service.addEmployee({ id: 'S3', name: 'Three', department: 'Tech', salary: 65000 });

    const stats = service.getAverageSalary();
    assert.strictEqual(stats.count, 3);
    assert.strictEqual(stats.total, 185000);
    // (185000 / 3) = 61666.67
    assert.strictEqual(stats.average, 61666.67);
  });

  // Feature 8: Department Filter
  it('Feature 8: should filter by department case-insensitively', async () => {
    await service.addEmployee({ id: 'D1', name: 'Eng 1', department: 'Engineering', salary: 90000 });
    await service.addEmployee({ id: 'D2', name: 'Eng 2', department: 'engineering', salary: 85000 });
    await service.addEmployee({ id: 'D3', name: 'Mkt 1', department: 'Marketing', salary: 70000 });

    const engList = service.filterByDepartment('ENGINEERING');
    assert.strictEqual(engList.length, 2);

    const mktList = service.filterByDepartment('marketing');
    assert.strictEqual(mktList.length, 1);

    const emptyList = service.filterByDepartment('Legal');
    assert.deepStrictEqual(emptyList, []);
  });

  // Persistence Tests across application restart and corrupted file safety
  it('Persistence: records should survive application restarts via JSON file', async () => {
    await service.addEmployee({ id: 'P1', name: 'Persistent User', department: 'R&D', salary: 110000 });

    // Simulate application restart with a fresh service instance referencing the same file
    const restartedService = new EmployeeService(new EmployeeStore(tempFilePath));
    await restartedService.init();

    const loaded = restartedService.getAllEmployees();
    assert.strictEqual(loaded.length, 1);
    assert.strictEqual(loaded[0].id, 'P1');
    assert.strictEqual(loaded[0].name, 'Persistent User');
    assert.strictEqual(loaded[0].salary, 110000);
  });

  it('Persistence: should throw on malformed JSON without deleting the file', async () => {
    // Write corrupted JSON to the test file
    fs.writeFileSync(tempFilePath, '{ corrupted_json_syntax: true, missing_bracket: ', 'utf-8');

    const corruptStore = new EmployeeStore(tempFilePath);
    await assert.rejects(
      async () => {
        await corruptStore.load();
      },
      /contains malformed JSON/
    );

    // Verify the file was NOT deleted or overwritten
    const rawContent = fs.readFileSync(tempFilePath, 'utf-8');
    assert.ok(rawContent.includes('corrupted_json_syntax'));
  });
});
