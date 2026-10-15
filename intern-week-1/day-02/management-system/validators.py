"""
validators.py - Input validation logic for Employee Management System.
"""
import math
from typing import Any


class ValidationError(ValueError):
    """Raised when an employee attribute fails business validation rules."""
    pass


def validate_id(emp_id: Any) -> str:
    """Ensure ID is a non-empty string."""
    if emp_id is None:
        raise ValidationError("Employee ID cannot be None.")
    emp_id_str = str(emp_id).strip()
    if not emp_id_str:
        raise ValidationError("Employee ID cannot be blank.")
    return emp_id_str


def validate_name(name: Any) -> str:
    """Ensure name is a non-empty string."""
    if name is None:
        raise ValidationError("Employee name cannot be None.")
    name_str = str(name).strip()
    if not name_str:
        raise ValidationError("Employee name cannot be blank.")
    return name_str


def validate_department(department: Any) -> str:
    """Ensure department is a non-empty string."""
    if department is None:
        raise ValidationError("Department cannot be None.")
    dept_str = str(department).strip()
    if not dept_str:
        raise ValidationError("Department cannot be blank.")
    return dept_str


def validate_salary(salary: Any) -> float:
    """
    Ensure salary is a valid, non-negative, finite number.
    Rejects strings that cannot be parsed, negatives, NaN, and infinities.
    """
    if salary is None:
        raise ValidationError("Salary cannot be None.")
    try:
        val = float(salary)
    except (ValueError, TypeError):
        raise ValidationError(f"Salary must be a valid number, got {salary!r}.")
    
    if not math.isfinite(val):
        raise ValidationError("Salary must be a finite number (cannot be NaN or infinity).")
    
    if val <= 0:
        raise ValidationError(f"Salary must be positive and greater than 0, got {val}.")
    
    return round(val, 2)


def validate_employee_data(emp_id: Any, name: Any, department: Any, salary: Any) -> dict:
    """Validate all fields at once and return clean dictionary."""
    return {
        "id": validate_id(emp_id),
        "name": validate_name(name),
        "department": validate_department(department),
        "salary": validate_salary(salary)
    }