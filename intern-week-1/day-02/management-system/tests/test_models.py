"""
Unit tests for Employee domain model.
"""
import unittest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import Employee


class TestEmployeeModel(unittest.TestCase):

    def test_employee_creation(self):
        emp = Employee(id="EMP001", name="Alice", department="Engineering", salary=80000.0)
        self.assertEqual(emp.id, "EMP001")
        self.assertEqual(emp.name, "Alice")
        self.assertEqual(emp.department, "Engineering")
        self.assertEqual(emp.salary, 80000.0)

    def test_to_dict(self):
        emp = Employee(id="EMP002", name="Bob", department="HR", salary=55000.0)
        d = emp.to_dict()
        self.assertEqual(d, {
            "id": "EMP002",
            "name": "Bob",
            "department": "HR",
            "salary": 55000.0
        })

    def test_from_dict(self):
        data = {"id": "EMP003", "name": "Charlie", "department": "Finance", "salary": 72000.5}
        emp = Employee.from_dict(data)
        self.assertEqual(emp.id, "EMP003")
        self.assertEqual(emp.name, "Charlie")
        self.assertEqual(emp.department, "Finance")
        self.assertEqual(emp.salary, 72000.5)

    def test_str_representation(self):
        emp = Employee(id="EMP004", name="Diana", department="Legal", salary=95000.0)
        s = str(emp)
        self.assertIn("EMP004", s)
        self.assertIn("Diana", s)
        self.assertIn("Legal", s)


if __name__ == "__main__":
    unittest.main()