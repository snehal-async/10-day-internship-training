"""
comprehensions.py - List, Dict and Set Comprehensions
Covers: list comprehensions, nested comprehensions, dict comprehensions,
        set comprehensions, and generator expressions.

Run:  python comprehensions.py
"""

# ===========================================================================
# 1. LIST COMPREHENSIONS
# ===========================================================================
print("=" * 55)
print("1. LIST COMPREHENSIONS")
print("=" * 55)
print("  Syntax: [expression  for  item  in  iterable  if  condition]")

squares  = [x ** 2 for x in range(1, 11)]
evens    = [x for x in range(30) if x % 2 == 0]
positives= [x for x in [-3, -1, 0, 2, 5, -2, 8] if x > 0]
words    = ["hello", "world", "python", "intern"]
upper    = [w.upper() for w in words]
lengths  = [len(w) for w in words]

print(f"  Squares 1-10  : {squares}")
print(f"  Evens 0-29    : {evens}")
print(f"  Positives     : {positives}")
print(f"  Upper words   : {upper}")
print(f"  Word lengths  : {lengths}")

# Equivalent for-loop for comparison
print("\n  Equivalent for-loop (same result as squares above):")
result = []
for x in range(1, 11):
    result.append(x ** 2)
print(f"  {result}")

# ===========================================================================
# 2. LIST COMPREHENSION WITH FUNCTION CALL
# ===========================================================================
print("\n" + "=" * 55)
print("2. COMPREHENSIONS WITH FUNCTIONS")
print("=" * 55)

def is_valid_salary(value):
    """Return True if salary is a positive finite number."""
    try:
        s = float(value)
        return s > 0 and s != float("inf")
    except (TypeError, ValueError):
        return False

raw_salaries = [55000, -100, "N/A", 72000, 0, 48000, float("inf"), 65000]
valid = [s for s in raw_salaries if is_valid_salary(s)]
invalid = [s for s in raw_salaries if not is_valid_salary(s)]

print(f"  Raw data     : {raw_salaries}")
print(f"  Valid        : {valid}")
print(f"  Invalid      : {invalid}")

avg = sum(valid) / len(valid)
print(f"  Average valid salary: ${avg:,.2f}")

# ===========================================================================
# 3. NESTED LIST COMPREHENSIONS
# ===========================================================================
print("\n" + "=" * 55)
print("3. NESTED LIST COMPREHENSIONS")
print("=" * 55)

# Flatten a 2D list
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat   = [cell for row in matrix for cell in row]
print(f"  Matrix : {matrix}")
print(f"  Flat   : {flat}")

# Multiplication table (5x5)
table  = [[row * col for col in range(1, 6)] for row in range(1, 6)]
print("  5x5 multiplication table:")
for row in table:
    print("    " + "  ".join(f"{n:3}" for n in row))

# ===========================================================================
# 4. DICT COMPREHENSIONS
# ===========================================================================
print("\n" + "=" * 55)
print("4. DICT COMPREHENSIONS")
print("=" * 55)
print("  Syntax: {key_expr: value_expr for item in iterable if condition}")

employees = [
    {"id": "E001", "name": "Alice", "salary": 72000},
    {"id": "E002", "name": "Bob",   "salary": 55000},
    {"id": "E003", "name": "Carol", "salary": 65000},
]

# Map employee ID to name
id_to_name = {e["id"]: e["name"] for e in employees}
print(f"  ID -> Name   : {id_to_name}")

# Map name to salary
name_to_sal = {e["name"]: e["salary"] for e in employees}
print(f"  Name -> Salary: {name_to_sal}")

# Only high earners
high_earners = {e["name"]: e["salary"] for e in employees if e["salary"] > 60000}
print(f"  High earners : {high_earners}")

# Apply 10% raise using dict comprehension
raised = {name: int(sal * 1.10) for name, sal in name_to_sal.items()}
print(f"  After 10% raise: {raised}")

# ===========================================================================
# 5. SET COMPREHENSIONS
# ===========================================================================
print("\n" + "=" * 55)
print("5. SET COMPREHENSIONS")
print("=" * 55)
print("  Syntax: {expression for item in iterable if condition}")

departments = [e["id"][:1] for e in employees] + ["E", "E", "F", "H"]
dept_letters = {d for d in departments}
print(f"  Unique dept letters: {dept_letters}")

sentence = "the quick brown fox jumps over the lazy dog"
unique_vowels = {ch for ch in sentence if ch in "aeiou"}
print(f"  Unique vowels in pangram: {sorted(unique_vowels)}")

# ===========================================================================
# 6. GENERATOR EXPRESSIONS
# ===========================================================================
print("\n" + "=" * 55)
print("6. GENERATOR EXPRESSIONS (memory-efficient)")
print("=" * 55)

# Same syntax as list comprehension but with () instead of []
# Generators compute values lazily - one at a time - saving memory.

gen = (x ** 2 for x in range(1, 6))
print(f"  Generator object : {gen}")
print(f"  Values (list)    : {list(gen)}")

# Using sum/max/min directly with a generator (no list created)
total  = sum(x ** 2 for x in range(1, 101))
big_sq = max(x ** 2 for x in range(1, 11))
print(f"  Sum of squares 1-100 : {total}")
print(f"  Largest square 1-10  : {big_sq}")

print("\ncomprehensions.py completed successfully.")
