# Day 02 - Python Fundamentals Exercises

This directory contains standalone, fully runnable Python scripts demonstrating key Python fundamentals, object-oriented programming, data structures, functional patterns, exception handling, and file operations.

---

## Exercise Catalog

| Script | Concepts Demonstrated | Execution Command |
|---|---|---|
| `basics.py` | Variables, primitive types, operators, conditionals, while/for loops, type conversions | `python basics.py` |
| `data-structures.py` | Lists, tuples, dictionaries, sets, common operations, nesting, slicing | `python data-structures.py` |
| `functions.py` | Positional/keyword arguments, `*args`/`**kwargs`, default values, lambda functions, docstrings, scope | `python functions.py` |
| `comprehensions.py` | List comprehensions, dict comprehensions, set comprehensions, generator expressions | `python comprehensions.py` |
| `exception-handling.py` | `try`/`except`/`else`/`finally`, custom exception classes, raising exceptions, chained exceptions | `python exception-handling.py` |
| `file-handling.py` | Context managers (`with`), reading/writing text files, JSON serialization/deserialization, error resilience | `python file-handling.py` |
| `object-oriented-programming.py` | Classes, `__init__`, encapsulation, inheritance, polymorphism, `@property`, class/static methods | `python object-oriented-programming.py` |

---

## Running the Automated Test Suite

A batch runner script is included to execute all 7 exercises in sequence and report status:

```bash
python run-exercises.py
```

### Expected Output
```text
============================================================
   PYTHON EXERCISES RUNNER - Day 02
============================================================
  Python: C:\Users\LENOVO\anaconda3\python.exe
  Dir   : ...\intern-week-1\day-02\python-exercises

  Running basics.py ... PASS
  Running data-structures.py ... PASS
  Running functions.py ... PASS
  Running comprehensions.py ... PASS
  Running exception-handling.py ... PASS
  Running file-handling.py ... PASS
  Running object-oriented-programming.py ... PASS

============================================================
  Results: 7/7 passed
  All exercises completed successfully!
============================================================
```

---

## Environment & Compatibility
- **Tested on:** Python 3.12 (Windows 10/11)
- **Standard Library Only:** Zero external dependencies required.