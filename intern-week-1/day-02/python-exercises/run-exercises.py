"""
Run all Python exercises in sequence and report pass/fail.

Run:  python run-exercises.py
"""
import subprocess
import sys
import os

PYTHON = sys.executable
EXERCISES_DIR = os.path.dirname(os.path.abspath(__file__))

SCRIPTS = [
    "basics.py",
    "data-structures.py",
    "functions.py",
    "comprehensions.py",
    "exception-handling.py",
    "file-handling.py",
    "object-oriented-programming.py",
]

print("=" * 60)
print("   PYTHON EXERCISES RUNNER - Day 02")
print("=" * 60)
print(f"  Python: {PYTHON}")
print(f"  Dir   : {EXERCISES_DIR}\n")

passed, failed = 0, []

for script in SCRIPTS:
    path = os.path.join(EXERCISES_DIR, script)
    print(f"  Running {script} ...", end=" ", flush=True)
    try:
        result = subprocess.run(
            [PYTHON, path],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            print("PASS")
            passed += 1
        else:
            print("FAIL")
            print(f"    STDERR: {result.stderr.strip()[:200]}")
            failed.append(script)
    except subprocess.TimeoutExpired:
        print("TIMEOUT")
        failed.append(script)
    except Exception as err:
        print(f"ERROR: {err}")
        failed.append(script)

print()
print("=" * 60)
print(f"  Results: {passed}/{len(SCRIPTS)} passed")
if failed:
    print(f"  FAILED : {', '.join(failed)}")
else:
    print("  All exercises completed successfully!")
print("=" * 60)
sys.exit(0 if not failed else 1)