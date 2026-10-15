"""
Unit tests for employee input validators.
"""
import unittest
import math
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from validators import (
    validate_id,
    validate_name,
    validate_department,
    validate_salary,
    validate_employee_data,
    ValidationError
)


class TestValidators(unittest.TestCase):

    def test_valid_fields(self):
        self.assertEqual(validate_id("EMP100"), "EMP100")
        self.assertEqual(validate_name("Alice Johnson"), "Alice Johnson")
        self.assertEqual(validate_department("Engineering"), "Engineering")
        self.assertEqual(validate_salary(75000), 75000.0)
        self.assertEqual(validate_salary("82500.50"), 82500.5)

    def test_blank_id_rejected(self):
        with self.assertRaises(ValidationError):
            validate_id("")
        with self.assertRaises(ValidationError):
            validate_id("   ")
        with self.assertRaises(ValidationError):
            validate_id(None)

    def test_blank_name_rejected(self):
        with self.assertRaises(ValidationError):
            validate_name("")
        with self.assertRaises(ValidationError):
            validate_name("   \t  ")
        with self.assertRaises(ValidationError):
            validate_name(None)

    def test_blank_department_rejected(self):
        with self.assertRaises(ValidationError):
            validate_department("")
        with self.assertRaises(ValidationError):
            validate_department("   ")
        with self.assertRaises(ValidationError):
            validate_department(None)

    def test_invalid_salary_rejected(self):
        # Non-numeric string
        with self.assertRaises(ValidationError):
            validate_salary("invalid_salary")
        # Negative salary
        with self.assertRaises(ValidationError):
            validate_salary(-500)
        # Zero salary
        with self.assertRaises(ValidationError):
            validate_salary(0)
        # NaN and Infinities
        with self.assertRaises(ValidationError):
            validate_salary(float("nan"))
        with self.assertRaises(ValidationError):
            validate_salary(float("inf"))
        with self.assertRaises(ValidationError):
            validate_salary(float("-inf"))

    def test_validate_employee_data_batch(self):
        clean = validate_employee_data("E01", "Jane", "Marketing", 60000)
        self.assertEqual(clean["id"], "E01")
        self.assertEqual(clean["name"], "Jane")
        self.assertEqual(clean["department"], "Marketing")
        self.assertEqual(clean["salary"], 60000.0)


if __name__ == "__main__":
    unittest.main()