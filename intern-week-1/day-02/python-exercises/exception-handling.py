"""
exception-handling.py - Exception Handling in Python
Covers: try/except/else/finally, raising exceptions, custom exceptions,
        input validation, and understandable error messages.

Run:  python exception-handling.py
"""

# ===========================================================================
# 1. BASIC TRY / EXCEPT
# ===========================================================================
print("=" * 55)
print("1. BASIC TRY / EXCEPT")
print("=" * 55)

# Without exception handling this would crash:
# result = 10 / 0   <-- ZeroDivisionError

def safe_divide(a, b):
    """Divide a by b, returning None and a message if b is zero."""
    try:
        result = a / b
    except ZeroDivisionError:
        print(f"  ERROR: Cannot divide {a} by zero.")
        return None
    return result

print(f"  safe_divide(10, 2) = {safe_divide(10, 2)}")
print(f"  safe_divide(10, 0) = {safe_divide(10, 0)}")

# ===========================================================================
# 2. MULTIPLE EXCEPT CLAUSES
# ===========================================================================
print("\n" + "=" * 55)
print("2. MULTIPLE EXCEPT CLAUSES")
print("=" * 55)

def parse_salary(text):
    """Try to convert text to a valid salary (positive float)."""
    try:
        value = float(text)
        if value <= 0:
            raise ValueError(f"Salary must be positive, got {value}.")
        return value
    except ValueError as err:
        print(f"  ValueError: {err}")
        return None
    except TypeError as err:
        print(f"  TypeError : {err}")
        return None

test_inputs = ["72000", "0", "-500", "abc", None, "inf", "65000.50"]
for inp in test_inputs:
    result = parse_salary(inp)
    if result is not None:
        print(f"  parse_salary({str(inp)!r:10}) = ${result:,.2f}")

# ===========================================================================
# 3. ELSE AND FINALLY
# ===========================================================================
print("\n" + "=" * 55)
print("3. ELSE AND FINALLY")
print("=" * 55)

print("""
  try:    code that might raise an exception
  except: runs ONLY if an exception occurred
  else:   runs ONLY if NO exception occurred
  finally: ALWAYS runs (cleanup code)
""")

def read_number(text):
    """Demonstrate try/except/else/finally."""
    try:
        number = int(text)
    except ValueError:
        print(f"  '{text}' is not an integer -> except block runs")
    else:
        print(f"  Converted successfully: {number} -> else block runs")
    finally:
        print(f"  finally block ALWAYS runs (cleanup here)")
    print()

read_number("42")
read_number("hello")

# ===========================================================================
# 4. RAISING EXCEPTIONS
# ===========================================================================
print("=" * 55)
print("4. RAISING EXCEPTIONS")
print("=" * 55)

def set_age(age):
    """Validate age and raise ValueError with a clear message if invalid."""
    if not isinstance(age, (int, float)):
        raise TypeError(f"Age must be a number, got {type(age).__name__}.")
    if age < 0 or age > 150:
        raise ValueError(f"Age {age} is outside the valid range 0-150.")
    return int(age)

test_ages = [25, -1, 200, "thirty", 0, 150]
for age_input in test_ages:
    try:
        result = set_age(age_input)
        print(f"  set_age({str(age_input)!r:8}) -> {result}")
    except (TypeError, ValueError) as err:
        print(f"  set_age({str(age_input)!r:8}) -> ERROR: {err}")

# ===========================================================================
# 5. CUSTOM EXCEPTION CLASSES
# ===========================================================================
print("\n" + "=" * 55)
print("5. CUSTOM EXCEPTION CLASSES")
print("=" * 55)

class EmployeeError(Exception):
    """Base class for employee-related errors."""
    pass

class DuplicateEmployeeError(EmployeeError):
    """Raised when an employee with the same ID already exists."""
    def __init__(self, emp_id):
        self.emp_id = emp_id
        super().__init__(f"Employee '{emp_id}' already exists.")

class InvalidSalaryError(EmployeeError):
    """Raised when a salary value is invalid."""
    def __init__(self, value):
        super().__init__(
            f"Invalid salary '{value}'. Salary must be a positive number."
        )

def add_employee(registry, emp_id, salary):
    """Add employee with custom exception handling."""
    if emp_id in registry:
        raise DuplicateEmployeeError(emp_id)
    if not isinstance(salary, (int, float)) or salary <= 0:
        raise InvalidSalaryError(salary)
    registry[emp_id] = {"salary": salary}
    print(f"  Added {emp_id} with salary ${salary:,}")

registry = {}
test_cases = [
    ("E001", 72000),
    ("E001", 55000),   # duplicate
    ("E002", -100),    # invalid salary
    ("E002", 60000),
]

for emp_id, sal in test_cases:
    try:
        add_employee(registry, emp_id, sal)
    except DuplicateEmployeeError as err:
        print(f"  DuplicateError : {err}")
    except InvalidSalaryError as err:
        print(f"  SalaryError    : {err}")
    except EmployeeError as err:
        print(f"  EmployeeError  : {err}")

# ===========================================================================
# 6. VALIDATING USER INPUT (simulated)
# ===========================================================================
print("\n" + "=" * 55)
print("6. INPUT VALIDATION PATTERNS")
print("=" * 55)

def validate_employee_name(name):
    """Return cleaned name or raise ValueError."""
    if not isinstance(name, str):
        raise TypeError("Name must be a string.")
    name = name.strip()
    if not name:
        raise ValueError("Name cannot be blank.")
    if len(name) < 2:
        raise ValueError("Name is too short (minimum 2 characters).")
    if len(name) > 100:
        raise ValueError("Name is too long (maximum 100 characters).")
    return name

test_names = ["Alice Johnson", "  Bob  ", "", "  ", "X", "Valid Name"]
for raw in test_names:
    try:
        clean = validate_employee_name(raw)
        print(f"  {raw!r:20} -> OK: {clean!r}")
    except (TypeError, ValueError) as err:
        print(f"  {raw!r:20} -> ERROR: {err}")

print("\nexception-handling.py completed successfully.")
