"""
main.py - Interactive CLI entrypoint for Employee Management System.
"""
import sys
import os
from employee_service import EmployeeService
from validators import ValidationError
from storage import StorageError


def print_banner():
    print("\n" + "=" * 65)
    print("       EMPLOYEE MANAGEMENT SYSTEM - Day 02 Python Edition")
    print("=" * 65)


def print_menu():
    print("""
  [1] Add Employee
  [2] Update Employee
  [3] Delete Employee
  [4] Search Employee (by ID or Name)
  [5] Filter Employees by Department
  [6] Sort Employees
  [7] View Statistics
  [8] List All Employees
  [9] Exit
""")


def display_employees(employees, title="Employee Records"):
    print(f"\n--- {title} ({len(employees)} found) ---")
    if not employees:
        print("  (No records to display)")
        return

    header = f"| {'ID':<10} | {'Name':<22} | {'Department':<18} | {'Salary ($)':>12} |"
    divider = "+" + "-" * 12 + "+" + "-" * 24 + "+" + "-" * 20 + "+" + "-" * 14 + "+"
    print(divider)
    print(header)
    print(divider)
    for emp in employees:
        print(f"| {emp.id:<10} | {emp.name:<22} | {emp.department:<18} | {emp.salary:>12,.2f} |")
    print(divider)


def handle_add(service: EmployeeService):
    print("\n--- Add New Employee ---")
    emp_id = input("  Enter Employee ID: ").strip()
    name = input("  Enter Full Name: ").strip()
    dept = input("  Enter Department: ").strip()
    salary_str = input("  Enter Salary ($): ").strip()

    try:
        emp = service.add_employee(emp_id, name, dept, salary_str)
        print(f"\n[SUCCESS] Employee '{emp.name}' ({emp.id}) added successfully.")
    except ValidationError as err:
        print(f"\n[VALIDATION ERROR] {err}")
    except StorageError as err:
        print(f"\n[STORAGE ERROR] {err}")


def handle_update(service: EmployeeService):
    print("\n--- Update Existing Employee ---")
    emp_id = input("  Enter Employee ID to update: ").strip()
    existing = service.get_employee(emp_id)
    if not existing:
        print(f"\n[NOT FOUND] No employee found with ID '{emp_id}'.")
        return

    print(f"  Current: {existing.name} | Dept: {existing.department} | Salary: ${existing.salary:,.2f}")
    print("  (Press Enter to keep current value)")

    new_name = input(f"  New Name [{existing.name}]: ").strip()
    new_dept = input(f"  New Department [{existing.department}]: ").strip()
    new_salary = input(f"  New Salary [${existing.salary:,.2f}]: ").strip()

    try:
        updated = service.update_employee(
            emp_id=emp_id,
            name=new_name if new_name else None,
            department=new_dept if new_dept else None,
            salary=new_salary if new_salary else None
        )
        print(f"\n[SUCCESS] Employee '{updated.id}' updated successfully.")
    except (ValidationError, KeyError) as err:
        print(f"\n[ERROR] {err}")
    except StorageError as err:
        print(f"\n[STORAGE ERROR] {err}")


def handle_delete(service: EmployeeService):
    print("\n--- Delete Employee ---")
    emp_id = input("  Enter Employee ID to delete: ").strip()
    existing = service.get_employee(emp_id)
    if not existing:
        print(f"\n[NOT FOUND] No employee found with ID '{emp_id}'.")
        return

    confirm = input(f"  Are you sure you want to delete '{existing.name}' ({existing.id})? (yes/no): ").strip().lower()
    if confirm in ("yes", "y"):
        service.delete_employee(emp_id)
        print(f"\n[DELETED] Employee '{emp_id}' has been removed.")
    else:
        print("\n[CANCELLED] Deletion was cancelled.")


def handle_search(service: EmployeeService):
    print("\n--- Search Employees ---")
    query = input("  Enter Search Term (ID or Name): ").strip()
    results = service.search_employees(query)
    display_employees(results, f"Search Results for '{query}'")


def handle_filter(service: EmployeeService):
    print("\n--- Filter by Department ---")
    dept = input("  Enter Department Name: ").strip()
    results = service.filter_by_department(dept)
    display_employees(results, f"Department: '{dept}'")


def handle_sort(service: EmployeeService):
    print("\n--- Sort Employees ---")
    print("  [1] By Name (A-Z)")
    print("  [2] By Name (Z-A)")
    print("  [3] By Salary (Low to High)")
    print("  [4] By Salary (High to Low)")
    choice = input("  Choose sort option (1-4): ").strip()

    sort_map = {
        "1": ("name", False, "Name Ascending"),
        "2": ("name", True, "Name Descending"),
        "3": ("salary", False, "Salary Ascending"),
        "4": ("salary", True, "Salary Descending")
    }

    if choice in sort_map:
        key, desc, label = sort_map[choice]
        results = service.sort_employees(by=key, descending=desc)
        display_employees(results, f"Sorted by {label}")
    else:
        print("\n[INVALID] Please choose an option between 1 and 4.")


def handle_statistics(service: EmployeeService):
    print("\n--- Employee Statistics ---")
    stats = service.get_statistics()
    print(f"  Total Employees : {stats['total_employees']}")
    print(f"  Average Salary  : ${stats['average_salary']:,.2f}")
    print(f"  Minimum Salary  : ${stats['min_salary']:,.2f}")
    print(f"  Maximum Salary  : ${stats['max_salary']:,.2f}")
    print("\n  Department-wise Distribution:")
    if stats["departments"]:
        for d, count in sorted(stats["departments"].items()):
            print(f"    - {d:<20}: {count} employee(s)")
    else:
        print("    (No department data)")


def main():
    print_banner()
    try:
        service = EmployeeService()
    except StorageError as err:
        print(f"\n[FATAL ERROR] Could not initialize storage:\n{err}")
        sys.exit(1)

    while True:
        print_menu()
        choice = input("Enter your choice (1-9): ").strip()

        if choice == "1":
            handle_add(service)
        elif choice == "2":
            handle_update(service)
        elif choice == "3":
            handle_delete(service)
        elif choice == "4":
            handle_search(service)
        elif choice == "5":
            handle_filter(service)
        elif choice == "6":
            handle_sort(service)
        elif choice == "7":
            handle_statistics(service)
        elif choice == "8":
            display_employees(service.list_employees())
        elif choice == "9":
            print("\nExiting Employee Management System. Goodbye!\n")
            break
        else:
            print("\n[INVALID CHOICE] Please enter a number between 1 and 9.")


if __name__ == "__main__":
    main()