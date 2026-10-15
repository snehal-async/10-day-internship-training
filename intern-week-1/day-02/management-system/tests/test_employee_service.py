"""
Unit tests for EmployeeService business logic.
"""
import unittest
import tempfile
import os
import shutil
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from employee_service import EmployeeService
from storage import Storage
from validators import ValidationError


class TestEmployeeService(unittest.TestCase):

    def setUp(self):
        self.test_dir = tempfile.mkdtemp()
        self.file_path = os.path.join(self.test_dir, "test_employees.json")
        self.storage = Storage(self.file_path)
        self.service = EmployeeService(self.storage)

    def tearDown(self):
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def test_add_employee_success(self):
        emp = self.service.add_employee("E001", "Alice", "Engineering", 80000)
        self.assertEqual(emp.id, "E001")
        self.assertEqual(emp.name, "Alice")
        self.assertEqual(len(self.service.list_employees()), 1)

    def test_add_duplicate_employee_id_rejected(self):
        self.service.add_employee("E001", "Alice", "Engineering", 80000)
        with self.assertRaises(ValidationError):
            self.service.add_employee("E001", "Bob", "HR", 50000)

    def test_update_existing_employee(self):
        self.service.add_employee("E001", "Alice", "Engineering", 80000)
        updated = self.service.update_employee("E001", name="Alice Smith", salary=85000)
        self.assertEqual(updated.name, "Alice Smith")
        self.assertEqual(updated.salary, 85000.0)
        self.assertEqual(updated.department, "Engineering")  # Preserved

    def test_update_nonexistent_employee_raises(self):
        with self.assertRaises(KeyError):
            self.service.update_employee("NONEXISTENT", name="Ghost")

    def test_delete_employee(self):
        self.service.add_employee("E001", "Alice", "Engineering", 80000)
        self.assertTrue(self.service.delete_employee("E001"))
        self.assertFalse(self.service.delete_employee("E001"))  # Already deleted
        self.assertEqual(len(self.service.list_employees()), 0)

    def test_search_by_id_and_name_case_insensitive(self):
        self.service.add_employee("E101", "Alice Wonder", "IT", 70000)
        self.service.add_employee("E102", "Bob Marley", "Music", 65000)
        self.service.add_employee("E103", "Charlie Chaplin", "Cinema", 90000)

        # Search by substring in name
        res = self.service.search_employees("marley")
        self.assertEqual(len(res), 1)
        self.assertEqual(res[0].id, "E102")

        # Search by ID substring
        res_id = self.service.search_employees("103")
        self.assertEqual(len(res_id), 1)
        self.assertEqual(res_id[0].name, "Charlie Chaplin")

    def test_filter_by_department_case_insensitive(self):
        self.service.add_employee("E1", "Alice", "Engineering", 80000)
        self.service.add_employee("E2", "Bob", "engineering", 82000)
        self.service.add_employee("E3", "Charlie", "HR", 50000)

        results = self.service.filter_by_department("ENGINEERING")
        self.assertEqual(len(results), 2)

    def test_sort_by_name_and_salary(self):
        self.service.add_employee("E1", "Zara", "IT", 95000)
        self.service.add_employee("E2", "Adam", "HR", 50000)
        self.service.add_employee("E3", "Mary", "Finance", 75000)

        # Name Ascending
        by_name = self.service.sort_employees(by="name", descending=False)
        self.assertEqual([e.name for e in by_name], ["Adam", "Mary", "Zara"])

        # Salary Descending
        by_salary_desc = self.service.sort_employees(by="salary", descending=True)
        self.assertEqual([e.salary for e in by_salary_desc], [95000.0, 75000.0, 50000.0])

    def test_statistics_normal_and_empty(self):
        # Empty
        empty_stats = self.service.get_statistics()
        self.assertEqual(empty_stats["total_employees"], 0)
        self.assertEqual(empty_stats["average_salary"], 0.0)

        # Populate
        self.service.add_employee("E1", "A", "IT", 60000)
        self.service.add_employee("E2", "B", "IT", 80000)
        self.service.add_employee("E3", "C", "HR", 100000)

        stats = self.service.get_statistics()
        self.assertEqual(stats["total_employees"], 3)
        self.assertEqual(stats["average_salary"], 80000.0)
        self.assertEqual(stats["min_salary"], 60000.0)
        self.assertEqual(stats["max_salary"], 100000.0)
        self.assertEqual(stats["departments"], {"IT": 2, "HR": 1})


if __name__ == "__main__":
    unittest.main()