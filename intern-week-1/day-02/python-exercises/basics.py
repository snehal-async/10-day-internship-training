"""
basics.py - Python Fundamentals
Covers: syntax, variables, data types, operators, conditionals, loops,
        functions, scope, lambda functions, and list comprehensions.

Run:  python basics.py
"""

# ===========================================================================
# 1. SYNTAX AND INDENTATION
# ===========================================================================
# Python uses indentation (4 spaces) instead of curly braces {}.
# A colon (:) always starts an indented block.
print("=" * 55)
print("1. SYNTAX AND INDENTATION")
print("=" * 55)
if True:
    print("  Inside if-block (indented by 4 spaces).")
    print("  Python enforces consistent indentation.")
print("  Outside the if-block (no indentation).")

# ===========================================================================
# 2. VARIABLES AND CONSTANTS
# ===========================================================================
print("\n" + "=" * 55)
print("2. VARIABLES AND CONSTANTS")
print("=" * 55)

# Variables - created on assignment, no keyword needed
employee_name = "Alice Johnson"
age = 28
salary = 75000.50
is_active = True

# Constants - written in ALL_CAPS by convention (not enforced by Python)
MAX_EMPLOYEES = 1000
DEFAULT_DEPARTMENT = "Engineering"

print(f"  Name       : {employee_name}")
print(f"  Age        : {age}")
print(f"  Salary     : ${salary:,.2f}")
print(f"  Active     : {is_active}")
print(f"  Max Emp    : {MAX_EMPLOYEES}")
print(f"  Default Dept: {DEFAULT_DEPARTMENT}")

# ===========================================================================
# 3. COMMON DATA TYPES
# ===========================================================================
print("\n" + "=" * 55)
print("3. COMMON DATA TYPES")
print("=" * 55)

text   = "Hello, Python!"               # str
number = 42                             # int
price  = 3.14                           # float
flag   = False                          # bool
items  = ["apple", "banana", "cherry"]  # list  - mutable, ordered
coords = (10.5, 20.3)                   # tuple - immutable, ordered
tags   = {"python", "intern", "day2"}   # set   - unique, unordered
person = {"name": "Bob", "age": 30}     # dict  - key-value pairs

for label, value in [
    ("str  ", text), ("int  ", number), ("float", price),
    ("bool ", flag), ("list ", items),  ("tuple", coords),
    ("set  ", tags), ("dict ", person),
]:
    print(f"  {label} -> {str(value):<40} type: {type(value).__name__}")

# ===========================================================================
# 4. OPERATORS
# ===========================================================================
print("\n" + "=" * 55)
print("4. OPERATORS")
print("=" * 55)

a, b = 10, 3
print(f"  a={a}, b={b}")
print(f"  a + b  = {a + b}   (addition)")
print(f"  a - b  = {a - b}   (subtraction)")
print(f"  a * b  = {a * b}   (multiplication)")
print(f"  a / b  = {a / b:.4f} (true division)")
print(f"  a // b = {a // b}   (floor division)")
print(f"  a % b  = {a % b}   (modulus / remainder)")
print(f"  a ** b = {a ** b}  (exponentiation)")
print()
print(f"  a == b -> {a == b}  (equal)")
print(f"  a != b -> {a != b}   (not equal)")
print(f"  a >  b -> {a > b}   (greater than)")
print(f"  a <= b -> {a <= b}  (less or equal)")
print()
print(f"  True and False -> {True and False}")
print(f"  True or  False -> {True or False}")
print(f"  not True       -> {not True}")

# ===========================================================================
# 5. CONDITIONAL STATEMENTS
# ===========================================================================
print("\n" + "=" * 55)
print("5. CONDITIONAL STATEMENTS")
print("=" * 55)

score = 72

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"  Score {score} -> Grade: {grade}")

# Ternary / conditional expression (one-liner if-else)
status = "Pass" if score >= 60 else "Fail"
print(f"  Result: {status}")

# ===========================================================================
# 6. LOOPS
# ===========================================================================
print("\n" + "=" * 55)
print("6. LOOPS")
print("=" * 55)

departments = ["HR", "Engineering", "Finance", "Marketing"]
print("  for loop - departments:")
for dept in departments:
    print(f"    - {dept}")

print("  for + range - squares 1-5:")
for i in range(1, 6):
    print(f"    {i}^2 = {i ** 2}")

print("  while loop - countdown:")
n = 3
while n > 0:
    print(f"    {n}...")
    n -= 1
print("    Launch!")

print("  break / continue (odd numbers, stop before 9):")
for x in range(1, 11):
    if x % 2 == 0:
        continue    # skip even
    if x == 9:
        break       # stop loop
    print(f"    {x}", end=" ")
print()

# ===========================================================================
# 7. FUNCTIONS
# ===========================================================================
print("\n" + "=" * 55)
print("7. FUNCTIONS")
print("=" * 55)

def greet(name, greeting="Hello"):
    """Return a greeting string. 'greeting' has a default value."""
    return f"{greeting}, {name}!"

print(f"  {greet('Alice')}")
print(f"  {greet('Bob', 'Good morning')}")

def divide(a, b):
    """Returns (quotient, remainder) as a tuple."""
    if b == 0:
        raise ValueError("Cannot divide by zero.")
    return a // b, a % b

q, r = divide(17, 5)
print(f"  17 / 5 -> quotient={q}, remainder={r}")

def total(*numbers, label="Sum"):
    """Accepts any number of arguments with *args."""
    return f"{label}: {sum(numbers)}"

print(f"  {total(10, 20, 30)}")
print(f"  {total(5, 5, 5, label='Total')}")

# ===========================================================================
# 8. SCOPE - LOCAL vs GLOBAL
# ===========================================================================
print("\n" + "=" * 55)
print("8. SCOPE")
print("=" * 55)

count = 0          # global variable

def increment():
    global count   # explicitly reference the global variable
    count += 1

def show_local():
    local_msg = "I exist only inside this function"
    print(f"  Inside: {local_msg}")

increment()
increment()
increment()
print(f"  Global count after 3 increments: {count}")
show_local()
# print(local_msg)   # <- NameError: local_msg does not exist here

# ===========================================================================
# 9. LAMBDA FUNCTIONS
# ===========================================================================
print("\n" + "=" * 55)
print("9. LAMBDA FUNCTIONS")
print("=" * 55)

# lambda creates a small anonymous function
square = lambda x: x ** 2
is_even = lambda x: x % 2 == 0
print(f"  square(9)    = {square(9)}")
print(f"  is_even(4)   = {is_even(4)}")
print(f"  is_even(7)   = {is_even(7)}")

employees = [
    {"name": "Carol", "salary": 55000},
    {"name": "Dave",  "salary": 72000},
    {"name": "Eve",   "salary": 48000},
]
by_salary = sorted(employees, key=lambda e: e["salary"])
print("  Sorted by salary (lambda as key):")
for e in by_salary:
    print(f"    {e['name']:8} -> ${e['salary']:,}")

salaries = [48000, 55000, 72000]
raised = list(map(lambda s: int(s * 1.10), salaries))
print(f"  After 10% raise: {raised}")

high = list(filter(lambda s: s > 50000, salaries))
print(f"  High earners (>50k): {high}")

# ===========================================================================
# 10. LIST COMPREHENSIONS
# ===========================================================================
print("\n" + "=" * 55)
print("10. LIST COMPREHENSIONS")
print("=" * 55)

# [expression for item in iterable if condition]
squares = [x ** 2 for x in range(1, 8)]
evens   = [x for x in range(20) if x % 2 == 0]
upper   = [w.upper() for w in ["hello", "world", "python"]]

print(f"  Squares 1-7  : {squares}")
print(f"  Even 0-19    : {evens}")
print(f"  Upper        : {upper}")

# Dict comprehension
lengths = {w: len(w) for w in ["intern", "python", "training"]}
print(f"  Word lengths : {lengths}")

# Set comprehension
vowels = {ch for ch in "the quick brown fox" if ch in "aeiou"}
print(f"  Unique vowels: {sorted(vowels)}")

print("\n" + "=" * 55)
print("EXERCISES - Try these yourself!")
print("=" * 55)
print("  1. Write celsius_to_fahrenheit(c) function.")
print("  2. Use comprehension to get odd numbers 1-30.")
print("  3. Fibonacci sequence up to 100 using while loop.")
print("  4. Lambda that returns True if a string is a palindrome.")
print("  5. Function that counts vowels in a string.")
print("\nbatics.py completed successfully.")
