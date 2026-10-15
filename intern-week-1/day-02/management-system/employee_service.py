"""
employee_service.py - Business logic layer for Employee Management System.
"""
from typing import List, Dict, Optional, Any
from models import Employee
from validators import validate_employee_data, validate_name, validate_department, validate_salary, ValidationError
from storage import Storage, StorageError


class EmployeeService:
    """Provides CRUD, search, filter, sorting, and statistical analysis on employee records."""

    def __init__(self, storage: Optional[Storage] = None):
        self.storage = storage or Storage()
        self.employees: Dict[str, Employee] = {}
        self.load_from_storage()

    def load_from_storage(self) -> None:
        """Load employees from persistent storage."""
        raw_records = self.storage.load()
        self.employees = {}
        for rec in raw_records:
            emp = Employee.from_dict(rec)
            self.employees[emp.id] = emp

    def save_to_storage(self) -> None:
        """Serialize and save employees to persistent storage."""
        records = [emp.to_dict() for emp in self.employees.values()]
        self.storage.save(records)

    def add_employee(self, emp_id: str, name: str, department: str, salary: float) -> Employee:
        """
        Validate and create a new employee.
        Raises ValidationError if fields are invalid or ID already exists.
        """
        clean_data = validate_employee_data(emp_id, name, department, salary)
        clean_id = clean_data["id"]

        if clean_id in self.employees:
            raise ValidationError(f"Employee with ID '{clean_id}' already exists.")

        employee = Employee(**clean_data)
        self.employees[clean_id] = employee
        self.save_to_storage()
        return employee

    def update_employee(
        self,
        emp_id: str,
        name: Optional[str] = None,
        department: Optional[str] = None,
        salary: Optional[float] = None
    ) -> Employee:
        """
        Update an existing employee.
        Raises KeyError if employee does not exist.
        Raises ValidationError if any updated value is invalid.
        """
        emp_id = str(emp_id).strip()
        if emp_id not in self.employees:
            raise KeyError(f"Employee with ID '{emp_id}' not found.")

        current = self.employees[emp_id]

        new_name = validate_name(name) if name is not None else current.name
        new_dept = validate_department(department) if department is not None else current.department
        new_salary = validate_salary(salary) if salary is not None else current.salary

        current.name = new_name
        current.department = new_dept
        current.salary = new_salary

        self.save_to_storage()
        return current

    def delete_employee(self, emp_id: str) -> bool:
        """
        Delete an employee by ID.
        Returns True if removed, False if not found.
        """
        emp_id = str(emp_id).strip()
        if emp_id in self.employees:
            del self.employees[emp_id]
            self.save_to_storage()
            return True
        return False

    def get_employee(self, emp_id: str) -> Optional[Employee]:
        """Retrieve single employee by ID."""
        return self.employees.get(str(emp_id).strip())

    def list_employees(self) -> List[Employee]:
        """Return all employees in arbitrary order."""
        return list(self.employees.values())

    def search_employees(self, query: str) -> List[Employee]:
        """Case-insensitive search by ID or name substring."""
        q = str(query).strip().lower()
        if not q:
            return []
        return [
            emp for emp in self.employees.values()
            if q in emp.id.lower() or q in emp.name.lower()
        ]

    def filter_by_department(self, department: str) -> List[Employee]:
        """Case-insensitive department filter."""
        d = str(department).strip().lower()
        return [
            emp for emp in self.employees.values()
            if emp.department.lower() == d
        ]

    def sort_employees(self, by: str = "name", descending: bool = False) -> List[Employee]:
        """
        Sort employees by 'name' or 'salary'.
        Defaults to sorting by name ascending.
        """
        by_clean = by.strip().lower()
        if by_clean == "salary":
            return sorted(self.employees.values(), key=lambda e: e.salary, reverse=descending)
        elif by_clean == "name":
            return sorted(self.employees.values(), key=lambda e: e.name.lower(), reverse=descending)
        elif by_clean == "id":
            return sorted(self.employees.values(), key=lambda e: e.id.lower(), reverse=descending)
        else:
            raise ValueError(f"Unknown sort key '{by}'. Choose 'name', 'salary', or 'id'.")

    def get_statistics(self) -> Dict[str, Any]:
        """
        Compute aggregate statistics:
        - Total count
        - Average, minimum, maximum salary
        - Department-wise counts
        Handles empty list gracefully.
        """
        total = len(self.employees)
        if total == 0:
            return {
                "total_employees": 0,
                "average_salary": 0.0,
                "min_salary": 0.0,
                "max_salary": 0.0,
                "departments": {}
            }

        salaries = [e.salary for e in self.employees.values()]
        dept_counts: Dict[str, int] = {}
        for e in self.employees.values():
            dept_counts[e.department] = dept_counts.get(e.department, 0) + 1

        return {
            "total_employees": total,
            "average_salary": round(sum(salaries) / total, 2),
            "min_salary": round(min(salaries), 2),
            "max_salary": round(max(salaries), 2),
            "departments": dept_counts
        }