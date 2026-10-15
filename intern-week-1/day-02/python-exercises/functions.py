"""
functions.py - Functions, Modules, and Packages
Covers: defining functions, parameters, return values, *args/**kwargs,
        importing built-in modules, and organising reusable code.

Run:  python functions.py
"""

import math
import random
import os
import json
from datetime import datetime

# ===========================================================================
# 1. BASIC FUNCTIONS
# ===========================================================================
print("=" * 55)
print("1. BASIC FUNCTIONS")
print("=" * 55)

def add(a, b):
    """Return the sum of two numbers."""
    return a + b

def is_palindrome(text):
    """Return True if the string reads the same forwards and backwards."""
    cleaned = text.lower().replace(" ", "")
    return cleaned == cleaned[::-1]

def celsius_to_fahrenheit(celsius):
    """Convert Celsius to Fahrenheit."""
    return celsius * 9 / 5 + 32

print(f"  add(3, 7)                  = {add(3, 7)}")
print(f"  is_palindrome('racecar')   = {is_palindrome('racecar')}")
print(f"  is_palindrome('hello')     = {is_palindrome('hello')}")
print(f"  is_palindrome('A man a plan a canal Panama')"
      f" = {is_palindrome('A man a plan a canal Panama')}")
print(f"  celsius_to_fahrenheit(0)   = {celsius_to_fahrenheit(0)}")
print(f"  celsius_to_fahrenheit(100) = {celsius_to_fahrenheit(100)}")

# ===========================================================================
# 2. DEFAULT ARGUMENTS AND KEYWORD ARGUMENTS
# ===========================================================================
print("\n" + "=" * 55)
print("2. DEFAULT AND KEYWORD ARGUMENTS")
print("=" * 55)

def create_employee(name, department="Engineering", salary=50000, active=True):
    """Create an employee dict with sensible defaults."""
    return {
        "name":       name,
        "department": department,
        "salary":     salary,
        "active":     active,
    }

e1 = create_employee("Alice")                          # all defaults
e2 = create_employee("Bob", salary=70000)              # override one
e3 = create_employee("Carol", "Finance", 65000, False) # all supplied

for emp in [e1, e2, e3]:
    print(f"  {emp['name']:8} | {emp['department']:15}"
          f"| ${emp['salary']:,} | active={emp['active']}")

# ===========================================================================
# 3. *args AND **kwargs
# ===========================================================================
print("\n" + "=" * 55)
print("3. *args AND **kwargs")
print("=" * 55)

def summarise(*numbers):
    """Accept any number of positional arguments."""
    if not numbers:
        return "No numbers provided."
    return (f"count={len(numbers)}, sum={sum(numbers)}, "
            f"avg={sum(numbers)/len(numbers):.2f}, "
            f"min={min(numbers)}, max={max(numbers)}")

print(f"  summarise(10,20,30)         : {summarise(10, 20, 30)}")
print(f"  summarise(5)                : {summarise(5)}")
print(f"  summarise()                 : {summarise()}")

def display_info(**kwargs):
    """Print any key-value pairs passed as keyword arguments."""
    for key, value in kwargs.items():
        print(f"    {key}: {value}")

print("  display_info call:")
display_info(name="Dave", age=32, city="Mumbai", role="Intern")

# ===========================================================================
# 4. RETURNING MULTIPLE VALUES
# ===========================================================================
print("\n" + "=" * 55)
print("4. RETURNING MULTIPLE VALUES")
print("=" * 55)

def salary_stats(salaries):
    """Return min, max and average salary."""
    if not salaries:
        return None, None, None
    return min(salaries), max(salaries), sum(salaries) / len(salaries)

salaries = [48000, 72000, 55000, 65000, 90000]
low, high, avg = salary_stats(salaries)
print(f"  Salaries : {salaries}")
print(f"  Min      : ${low:,}")
print(f"  Max      : ${high:,}")
print(f"  Average  : ${avg:,.2f}")

# ===========================================================================
# 5. NESTED FUNCTIONS AND CLOSURES
# ===========================================================================
print("\n" + "=" * 55)
print("5. NESTED FUNCTIONS AND CLOSURES")
print("=" * 55)

def make_multiplier(factor):
    """Return a function that multiplies its argument by factor."""
    def multiply(number):
        return number * factor
    return multiply          # return the inner function itself

double  = make_multiplier(2)
triple  = make_multiplier(3)

print(f"  double(5)  = {double(5)}")
print(f"  triple(5)  = {triple(5)}")
print(f"  double(10) = {double(10)}")

# ===========================================================================
# 6. IMPORTING BUILT-IN MODULES
# ===========================================================================
print("\n" + "=" * 55)
print("6. BUILT-IN MODULES")
print("=" * 55)

# math module
print(f"  math.pi           = {math.pi:.6f}")
print(f"  math.sqrt(144)    = {math.sqrt(144)}")
print(f"  math.ceil(4.3)    = {math.ceil(4.3)}")
print(f"  math.floor(4.9)   = {math.floor(4.9)}")
print(f"  math.log(100, 10) = {math.log(100, 10)}")

# random module
random.seed(42)   # seed for reproducible results
print(f"  random.randint(1,10)  = {random.randint(1, 10)}")
sample = random.sample(range(1, 50), 5)
print(f"  random.sample(1-49,5) = {sample}")

# os module
cwd = os.getcwd()
print(f"  os.getcwd() = ...{cwd[-40:]}")  # last 40 chars
print(f"  os.path.sep = {repr(os.path.sep)}")

# datetime module
now = datetime.now()
print(f"  datetime.now()    = {now.strftime('%Y-%m-%d %H:%M:%S')}")
print(f"  Formatted date    = {now.strftime('%d %B %Y')}")

# json module
data = {"name": "Alice", "score": 95, "passed": True}
json_string = json.dumps(data, indent=2)
back_to_dict = json.loads(json_string)
print(f"  json.dumps -> {json_string.strip()}")
print(f"  json.loads -> {back_to_dict}")

# ===========================================================================
# 7. ORGANISING CODE INTO MODULES (explanation)
# ===========================================================================
print("\n" + "=" * 55)
print("7. HOW MODULES WORK")
print("=" * 55)

explanation = """
  A module is simply a .py file.
  When you write:  import mymodule
  Python looks for mymodule.py in sys.path.

  Common import styles:
    import math                    # use math.sqrt()
    from math import sqrt          # use sqrt() directly
    from math import sqrt, pi      # import multiple names
    import numpy as np             # alias (common for large libs)

  Organise related modules in a folder with an __init__.py
  file and that folder becomes a PACKAGE:
    mypackage/
        __init__.py
        utils.py
        models.py

  You can then do:  from mypackage import utils
"""
print(explanation)

print("functions.py completed successfully.")
