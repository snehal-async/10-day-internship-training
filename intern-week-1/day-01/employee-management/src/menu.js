/**
 * Employee Management System - Interactive Terminal Menu Interface
 *
 * Provides a user-friendly, formatted CLI menu driven by Node.js readline.
 */

const readline = require('readline');

class EmployeeMenu {
  /**
   * @param {import('./employee-service').EmployeeService} service
   * @param {Object} [io]
   * @param {NodeJS.ReadableStream} [io.input]
   * @param {NodeJS.WritableStream} [io.output]
   */
  constructor(service, io = {}) {
    this.service = service;
    this.input = io.input || process.stdin;
    this.output = io.output || process.stdout;
    this.rl = readline.createInterface({
      input: this.input,
      output: this.output
    });
  }

  /**
   * Prompts the user with a question and resolves with trimmed input.
   * @param {string} promptText
   * @returns {Promise<string>}
   */
  ask(promptText) {
    return new Promise(resolve => {
      this.rl.question(promptText, answer => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Displays formatted tabular output for a list of employees.
   * @param {Array<Object>} employees
   */
  displayTable(employees) {
    if (!employees || employees.length === 0) {
      console.log('\n[!] No employee records found.');
      return;
    }

    console.log('\n+----------+----------------------+--------------------+----------------+');
    console.log('| ID       | Name                 | Department         | Salary ($)     |');
    console.log('+----------+----------------------+--------------------+----------------+');

    employees.forEach(emp => {
      const id = String(emp.id).padEnd(8).slice(0, 8);
      const name = String(emp.name).padEnd(20).slice(0, 20);
      const dept = String(emp.department).padEnd(18).slice(0, 18);
      const salary = Number(emp.salary).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).padStart(14).slice(0, 14);

      console.log(`| ${id} | ${name} | ${dept} | ${salary} |`);
    });

    console.log('+----------+----------------------+--------------------+----------------+');
    console.log(`Total Records: ${employees.length}\n`);
  }

  /**
   * Displays the main menu options.
   */
  showMenu() {
    console.log('====================================================');
    console.log('         EMPLOYEE MANAGEMENT SYSTEM (CLI)');
    console.log('====================================================');
    console.log(' 1. Add Employee');
    console.log(' 2. Update Employee');
    console.log(' 3. Delete Employee');
    console.log(' 4. Search Employee (by ID or Name)');
    console.log(' 5. List All Employees');
    console.log(' 6. View Highest Salary Employee(s)');
    console.log(' 7. View Average Salary');
    console.log(' 8. Filter Employees by Department');
    console.log(' 9. Exit Application');
    console.log('====================================================');
  }

  /**
   * Handles Option 1: Add Employee
   */
  async handleAdd() {
    console.log('\n--- [1] Add New Employee ---');
    try {
      const id = await this.ask('Enter Employee ID (e.g., EMP001): ');
      const name = await this.ask('Enter Employee Name: ');
      const department = await this.ask('Enter Department: ');
      const salaryInput = await this.ask('Enter Monthly Salary: ');

      const added = await this.service.addEmployee({
        id,
        name,
        department,
        salary: salaryInput
      });

      console.log(`\n[✓] Successfully added employee: ${added.name} (ID: ${added.id})`);
    } catch (err) {
      console.log(`\n[✗] Failed to add employee: ${err.message}`);
    }
  }

  /**
   * Handles Option 2: Update Employee
   */
  async handleUpdate() {
    console.log('\n--- [2] Update Employee ---');
    try {
      const id = await this.ask('Enter Employee ID to update: ');
      const existing = this.service.getEmployeeById(id);

      if (!existing) {
        console.log(`\n[!] No employee found with ID "${id}".`);
        return;
      }

      console.log('\nCurrent Details:');
      this.displayTable([existing]);
      console.log('(Press Enter to keep current value)\n');

      const name = await this.ask(`New Name [${existing.name}]: `);
      const department = await this.ask(`New Department [${existing.department}]: `);
      const salary = await this.ask(`New Salary [${existing.salary}]: `);

      const updated = await this.service.updateEmployee(id, {
        name: name || existing.name,
        department: department || existing.department,
        salary: salary ? salary : existing.salary
      });

      console.log(`\n[✓] Successfully updated employee "${updated.id}".`);
    } catch (err) {
      console.log(`\n[✗] Failed to update employee: ${err.message}`);
    }
  }

  /**
   * Handles Option 3: Delete Employee (with confirmation)
   */
  async handleDelete() {
    console.log('\n--- [3] Delete Employee ---');
    try {
      const id = await this.ask('Enter Employee ID to delete: ');
      const existing = this.service.getEmployeeById(id);

      if (!existing) {
        console.log(`\n[!] No employee found with ID "${id}".`);
        return;
      }

      console.log('\nTarget Record:');
      this.displayTable([existing]);

      const confirmation = await this.ask('Are you sure you want to permanently delete this employee? (y/N): ');
      if (confirmation.toLowerCase() === 'y' || confirmation.toLowerCase() === 'yes') {
        const deleted = await this.service.deleteEmployee(id);
        console.log(`\n[✓] Employee "${deleted.name}" (ID: ${deleted.id}) has been removed.`);
      } else {
        console.log('\n[-] Deletion cancelled by user.');
      }
    } catch (err) {
      console.log(`\n[✗] Error deleting employee: ${err.message}`);
    }
  }

  /**
   * Handles Option 4: Search Employee
   */
  async handleSearch() {
    console.log('\n--- [4] Search Employee ---');
    console.log('1. Search by Employee ID');
    console.log('2. Search by Employee Name');
    const choice = await this.ask('Select search mode (1 or 2): ');

    if (choice === '1') {
      const id = await this.ask('Enter Employee ID: ');
      const emp = this.service.getEmployeeById(id);
      if (emp) {
        this.displayTable([emp]);
      } else {
        console.log(`\n[!] No employee found matching ID "${id}".`);
      }
    } else if (choice === '2') {
      const name = await this.ask('Enter Name (or partial name): ');
      const results = this.service.searchByName(name);
      if (results.length > 0) {
        this.displayTable(results);
      } else {
        console.log(`\n[!] No employees found matching name "${name}".`);
      }
    } else {
      console.log('\n[!] Invalid search option.');
    }
  }

  /**
   * Handles Option 5: List All Employees
   */
  handleList() {
    console.log('\n--- [5] All Registered Employees ---');
    const employees = this.service.getAllEmployees();
    this.displayTable(employees);
  }

  /**
   * Handles Option 6: Highest Salary (with ties)
   */
  handleHighestSalary() {
    console.log('\n--- [6] Highest Salary Employee(s) ---');
    const result = this.service.getHighestSalaryEmployees();
    if (result.employees.length === 0) {
      console.log('\n[!] No employees registered.');
      return;
    }

    console.log(`\nHighest Salary Recorded: $${Number(result.maxSalary).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    if (result.employees.length > 1) {
      console.log(`Note: A tie of ${result.employees.length} employees share this maximum salary.`);
    }
    this.displayTable(result.employees);
  }

  /**
   * Handles Option 7: Average Salary
   */
  handleAverageSalary() {
    console.log('\n--- [7] Salary Statistics ---');
    const stats = this.service.getAverageSalary();
    if (stats.count === 0) {
      console.log('\n[!] Cannot calculate average: employee roster is empty.');
      return;
    }

    console.log(`\nTotal Active Employees : ${stats.count}`);
    console.log(`Total Payroll Expenditure: $${stats.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    console.log(`Average Monthly Salary   : $${stats.average.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n`);
  }

  /**
   * Handles Option 8: Department Filter
   */
  async handleDepartmentFilter() {
    console.log('\n--- [8] Department Filter ---');
    const dept = await this.ask('Enter Department name to filter by: ');
    const results = this.service.filterByDepartment(dept);

    if (results.length > 0) {
      console.log(`\nShowing employees in "${dept}":`);
      this.displayTable(results);
    } else {
      console.log(`\n[!] No employees found in department "${dept}".`);
    }
  }

  /**
   * Main menu loop.
   */
  async start() {
    let running = true;

    while (running) {
      this.showMenu();
      const choice = await this.ask('\nEnter your choice (1-9): ');

      switch (choice) {
        case '1':
          await this.handleAdd();
          break;
        case '2':
          await this.handleUpdate();
          break;
        case '3':
          await this.handleDelete();
          break;
        case '4':
          await this.handleSearch();
          break;
        case '5':
          this.handleList();
          break;
        case '6':
          this.handleHighestSalary();
          break;
        case '7':
          this.handleAverageSalary();
          break;
        case '8':
          await this.handleDepartmentFilter();
          break;
        case '9':
          console.log('\nExiting Employee Management System. Goodbye!\n');
          running = false;
          break;
        default:
          console.log('\n[!] Invalid selection. Please enter a number between 1 and 9.');
      }

      if (running) {
        await this.ask('\nPress [Enter] to return to main menu...');
        console.log('\n');
      }
    }

    this.close();
  }

  /**
   * Closes the underlying readline interface safely.
   */
  close() {
    this.rl.close();
  }
}

module.exports = { EmployeeMenu };
