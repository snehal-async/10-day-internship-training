"""
file-handling.py - File Handling in Python
Covers: reading/writing text files, JSON files, CSV files,
        safe file paths, and using the `with` statement.

Run:  python file-handling.py
Uses a temporary directory so no leftover files pollute the project.
"""

import json
import csv
import os
import tempfile

# We write all demo files to a temporary directory so nothing is left behind.
TEMP_DIR = tempfile.mkdtemp(prefix="pyfile_demo_")
print(f"Working in temp dir: {TEMP_DIR}\n")

def demo_path(filename):
    """Return a safe path inside the temporary demo directory."""
    return os.path.join(TEMP_DIR, filename)

# ===========================================================================
# 1. WRITING AND READING TEXT FILES
# ===========================================================================
print("=" * 55)
print("1. TEXT FILES")
print("=" * 55)

text_path = demo_path("notes.txt")

# Writing
print("  Writing notes.txt ...")
with open(text_path, "w", encoding="utf-8") as f:
    f.write("Day 2 - Python File Handling\n")
    f.write("Topic: Reading and writing files safely.\n")
    f.write("Status: In progress\n")
# File is automatically closed when the `with` block ends.

# Reading entire file
print("  Reading entire file:")
with open(text_path, "r", encoding="utf-8") as f:
    content = f.read()
print(content)

# Reading line by line
print("  Reading line by line:")
with open(text_path, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f, start=1):
        print(f"    Line {line_num}: {line.rstrip()}")

# Appending to a file
with open(text_path, "a", encoding="utf-8") as f:
    f.write("Status: Completed\n")
print("  After append, last line added: 'Status: Completed'")

# ===========================================================================
# 2. FILE PATHS - CROSS-PLATFORM
# ===========================================================================
print("\n" + "=" * 55)
print("2. FILE PATHS")
print("=" * 55)
print("""
  Always use os.path.join() or pathlib.Path() for file paths.
  NEVER hardcode paths like 'C:\\Users\\me\\file.txt'.

  Good:  path = os.path.join("data", "employees.json")
  Bad:   path = "data/employees.json"  (breaks on Windows)
  Also good: from pathlib import Path; path = Path("data") / "employees.json"

  Useful os.path functions:
""")
sample = demo_path("sample.txt")
open(sample, "w").close()          # create empty file
print(f"  os.path.exists  : {os.path.exists(sample)}")
print(f"  os.path.isfile  : {os.path.isfile(sample)}")
print(f"  os.path.dirname : {os.path.dirname(sample)}")
print(f"  os.path.basename: {os.path.basename(sample)}")
print(f"  os.path.splitext: {os.path.splitext(sample)}")
os.remove(sample)

# ===========================================================================
# 3. JSON FILES
# ===========================================================================
print("\n" + "=" * 55)
print("3. JSON FILES")
print("=" * 55)

json_path = demo_path("employees.json")

employees = [
    {"id": "E001", "name": "Alice Johnson", "department": "Engineering",
     "salary": 72000, "active": True},
    {"id": "E002", "name": "Bob Smith",     "department": "HR",
     "salary": 55000, "active": True},
    {"id": "E003", "name": "Carol Davis",   "department": "Finance",
     "salary": 65000, "active": False},
]

# Writing JSON
print(f"  Writing {len(employees)} employees to JSON ...")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(employees, f, indent=2, ensure_ascii=False)
print("  Done.")

# Reading JSON
print("  Reading JSON back:")
with open(json_path, "r", encoding="utf-8") as f:
    loaded = json.load(f)

for emp in loaded:
    print(f"    {emp['id']} | {emp['name']:15} | "
          f"{emp['department']:15} | ${emp['salary']:,}")

# Handling malformed JSON safely
bad_path = demo_path("bad.json")
with open(bad_path, "w") as f:
    f.write("{ this is not valid json }")

print("\n  Attempting to load malformed JSON:")
try:
    with open(bad_path, "r") as f:
        json.load(f)
except json.JSONDecodeError as err:
    print(f"  JSONDecodeError caught: {err}")
    print("  Original file was NOT overwritten - data is safe.")

# ===========================================================================
# 4. CSV FILES
# ===========================================================================
print("\n" + "=" * 55)
print("4. CSV FILES")
print("=" * 55)

csv_path = demo_path("employees.csv")

# Writing CSV
print(f"  Writing CSV to {os.path.basename(csv_path)} ...")
fieldnames = ["id", "name", "department", "salary", "active"]
with open(csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(employees)
print("  Done.")

# Reading CSV with DictReader
print("  Reading CSV back (DictReader):")
with open(csv_path, "r", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    rows = list(reader)

for row in rows:
    print(f"    {row['id']} | {row['name']:15} | {row['salary']}")

# Checking for missing/empty fields
print("\n  Checking for missing fields:")
for row in rows:
    missing = [col for col in fieldnames if not row.get(col, "").strip()]
    if missing:
        print(f"    {row['id']}: missing {missing}")
    else:
        print(f"    {row['id']}: all fields present")

# ===========================================================================
# 5. CHECKING IF FILE EXISTS BEFORE READING
# ===========================================================================
print("\n" + "=" * 55)
print("5. SAFE FILE ACCESS")
print("=" * 55)

def load_json_safely(path):
    """Load JSON from path, returning empty list if file is missing."""
    if not os.path.exists(path):
        print(f"  File not found: {path}. Starting fresh.")
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as err:
        print(f"  Malformed JSON in {path}: {err}")
        print("  Returning empty list. Original file is untouched.")
        return []

missing_path = demo_path("nonexistent.json")
result = load_json_safely(missing_path)
print(f"  Loaded from missing file: {result}")

result2 = load_json_safely(json_path)
print(f"  Loaded from valid JSON: {len(result2)} records")

result3 = load_json_safely(bad_path)
print(f"  Loaded from bad JSON: {result3}")

# Cleanup temp files
import shutil
shutil.rmtree(TEMP_DIR)
print(f"\n  Cleaned up temp dir: {TEMP_DIR}")

print("\nfile-handling.py completed successfully.")
