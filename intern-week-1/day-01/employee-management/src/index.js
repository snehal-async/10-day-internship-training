/**
 * Employee Management System - Application Entry Point
 *
 * Bootstraps the store, business service, and terminal interface.
 */

const { EmployeeStore } = require('./employee-store');
const { EmployeeService } = require('./employee-service');
const { EmployeeMenu } = require('./menu');

async function main() {
  try {
    const store = new EmployeeStore();
    const service = new EmployeeService(store);

    await service.init();

    const menu = new EmployeeMenu(service);
    await menu.start();
  } catch (error) {
    console.error('\n[FATAL ERROR] Failed to start Employee Management System:');
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
