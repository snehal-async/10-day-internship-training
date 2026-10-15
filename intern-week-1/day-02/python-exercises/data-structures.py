"""
data-structures.py - Python Data Structures
Covers: lists, tuples, sets, dictionaries and when to use each.

Run:  python data-structures.py
"""

# ===========================================================================
# 1. LISTS - mutable, ordered, allows duplicates
# ===========================================================================
print("=" * 55)
print("1. LISTS")
print("=" * 55)

# Create
fruits = ["apple", "banana", "cherry"]
print(f"  Original   : {fruits}")

# Access by index (0-based, negative counts from end)
print(f"  First      : {fruits[0]}")
print(f"  Last       : {fruits[-1]}")
print(f"  Slice [1:] : {fruits[1:]}")

# Add
fruits.append("date")           # add to end
fruits.insert(1, "avocado")     # add at position 1
print(f"  After add  : {fruits}")

# Update
fruits[0] = "apricot"
print(f"  After update[0]: {fruits}")

# Remove
fruits.remove("banana")         # by value
popped = fruits.pop()           # remove and return last
print(f"  After remove/pop: {fruits}  (popped: {popped})")

# Iterate
print("  Iterating:")
for i, fruit in enumerate(fruits):
    print(f"    [{i}] {fruit}")

# Useful list methods
numbers = [5, 2, 8, 1, 9, 3, 7, 4, 6]
numbers.sort()
print(f"  Sorted     : {numbers}")
numbers.reverse()
print(f"  Reversed   : {numbers}")
print(f"  Length     : {len(numbers)}")
print(f"  Sum        : {sum(numbers)}")
print(f"  Min/Max    : {min(numbers)} / {max(numbers)}")

# ===========================================================================
# 2. TUPLES - immutable, ordered, allows duplicates
# ===========================================================================
print("\n" + "=" * 55)
print("2. TUPLES")
print("=" * 55)

# Tuples cannot be changed after creation - use for fixed data
point = (10.5, 20.3)
rgb   = (255, 128, 0)
single = (42,)          # single-element tuple needs trailing comma

print(f"  Point      : {point}")
print(f"  RGB        : {rgb}")
print(f"  X coord    : {point[0]}")
print(f"  Slice [1:] : {point[1:]}")
print(f"  Length     : {len(rgb)}")

# Unpacking - assign tuple values to variables
x, y = point
r, g, b = rgb
print(f"  Unpacked point: x={x}, y={y}")
print(f"  Unpacked rgb  : r={r}, g={g}, b={b}")

# Tuple in a list - common pattern for records
employees = [
    ("E001", "Alice",   "Engineering", 72000),
    ("E002", "Bob",     "HR",          55000),
    ("E003", "Charlie", "Finance",     65000),
]
print("  Employee records:")
for emp_id, name, dept, sal in employees:
    print(f"    {emp_id} | {name:10} | {dept:15} | ${sal:,}")

# ===========================================================================
# 3. SETS - unordered, unique values only
# ===========================================================================
print("\n" + "=" * 55)
print("3. SETS")
print("=" * 55)

skills_alice = {"Python", "SQL", "Excel", "Python"}   # duplicate removed
skills_bob   = {"SQL", "Java", "Excel", "Git"}

print(f"  Alice skills : {skills_alice}")
print(f"  Bob skills   : {skills_bob}")

# Set operations
print(f"  Union (both)          : {skills_alice | skills_bob}")
print(f"  Intersection (common) : {skills_alice & skills_bob}")
print(f"  Difference A-B        : {skills_alice - skills_bob}")
print(f"  Difference B-A        : {skills_bob - skills_alice}")
print(f"  Symmetric diff        : {skills_alice ^ skills_bob}")

# Membership test is O(1) - very fast
print(f"  'Python' in Alice? {('Python' in skills_alice)}")
print(f"  'Java'   in Alice? {('Java' in skills_alice)}")

# Remove duplicates from a list using set
with_dupes = [1, 2, 3, 2, 4, 3, 5, 1]
unique = list(set(with_dupes))
unique.sort()
print(f"  Deduplicated list: {unique}")

# ===========================================================================
# 4. DICTIONARIES - key-value pairs, ordered (Python 3.7+)
# ===========================================================================
print("\n" + "=" * 55)
print("4. DICTIONARIES")
print("=" * 55)

# Create
employee = {
    "id":         "E001",
    "name":       "Alice Johnson",
    "department": "Engineering",
    "salary":     72000,
    "skills":     ["Python", "SQL"],
}
print(f"  Employee dict: {employee}")

# Access
print(f"  Name      : {employee['name']}")
print(f"  Dept      : {employee.get('department', 'Unknown')}")
print(f"  Missing   : {employee.get('email', 'N/A')}")  # safe access

# Update / add
employee["email"]  = "alice@company.com"
employee["salary"] = 78000                # update existing
print(f"  After update: {employee}")

# Delete
del employee["email"]
removed = employee.pop("skills")
print(f"  After delete: {employee}  (removed skills: {removed})")

# Iterate
print("  Iterating dict:")
for key, value in employee.items():
    print(f"    {key:12} : {value}")

# Dictionary of dicts - a simple in-memory store
registry = {
    "E001": {"name": "Alice", "salary": 78000},
    "E002": {"name": "Bob",   "salary": 55000},
}
print("  Registry lookup:")
for emp_id, data in registry.items():
    print(f"    {emp_id} -> {data['name']} earns ${data['salary']:,}")

# Useful methods
print(f"  Keys   : {list(employee.keys())}")
print(f"  Values : {list(employee.values())}")
print(f"  'id' in dict? {'id' in employee}")

# ===========================================================================
# 5. CHOOSING THE RIGHT DATA STRUCTURE
# ===========================================================================
print("\n" + "=" * 55)
print("5. WHEN TO USE WHICH DATA STRUCTURE")
print("=" * 55)

guide = {
    "list ": "Ordered collection that changes (add/remove items).",
    "tuple": "Fixed collection - coordinates, DB rows, function returns.",
    "set  ": "Unique values, fast membership tests, set operations.",
    "dict ": "Key-value lookup, named fields, records and mappings.",
}
for ds, usage in guide.items():
    print(f"  {ds}: {usage}")

print("\ndata-structures.py completed successfully.")
