"""
object-oriented-programming.py - OOP in Python
Covers: classes, objects, __init__, instance attributes/methods,
        encapsulation, and inheritance.

Run:  python object-oriented-programming.py
"""

# ===========================================================================
# 1. CLASSES AND OBJECTS
# ===========================================================================
print("=" * 55)
print("1. CLASSES AND OBJECTS")
print("=" * 55)
print("""
  A CLASS is a blueprint that defines attributes (data) and
  methods (behaviour).  An OBJECT is a specific instance of a class.
""")

class Employee:
    """Represents a single employee record."""

    # Class-level variable shared by ALL instances
    company_name = "TechCorp India"
    _next_id = 1         # used to auto-generate IDs

    def __init__(self, name, department, salary):
        """
        Constructor - called automatically when you create an object.
        self refers to the specific instance being created.
        """
        # Instance attributes - unique to each object
        self.employee_id = f"E{Employee._next_id:03d}"
        Employee._next_id += 1
        self.name       = name.strip()
        self.department = department.strip()
        self.salary     = float(salary)
        self._reviews   = []       # private by convention (underscore)

    # ── Instance methods ──────────────────────────────────────────────────

    def get_info(self):
        """Return a formatted summary string."""
        return (f"[{self.employee_id}] {self.name:20} "
                f"| {self.department:15} | ${self.salary:,.2f}")

    def give_raise(self, percentage):
        """Increase salary by the given percentage."""
        if percentage <= 0:
            raise ValueError("Raise percentage must be positive.")
        self.salary *= (1 + percentage / 100)
        return self.salary

    def add_review(self, review_text):
        """Add a performance review (stored privately)."""
        self._reviews.append(review_text)

    def review_count(self):
        """Return number of reviews (controlled access to private data)."""
        return len(self._reviews)

    def __str__(self):
        """Human-readable representation (used by print())."""
        return self.get_info()

    def __repr__(self):
        """Developer representation."""
        return (f"Employee(name={self.name!r}, "
                f"department={self.department!r}, salary={self.salary})")


# Creating objects
alice = Employee("Alice Johnson", "Engineering", 72000)
bob   = Employee("Bob Smith",    "HR",          55000)
carol = Employee("Carol Davis",  "Finance",     65000)

print("  Created employees:")
for emp in [alice, bob, carol]:
    print(f"    {emp}")     # calls __str__

print(f"\n  Company: {Employee.company_name}")  # class attribute

# ===========================================================================
# 2. INSTANCE ATTRIBUTES AND METHODS
# ===========================================================================
print("\n" + "=" * 55)
print("2. ATTRIBUTES AND METHODS")
print("=" * 55)

print(f"  alice.name       = {alice.name}")
print(f"  alice.salary     = ${alice.salary:,.2f}")
print(f"  alice.employee_id= {alice.employee_id}")

new_salary = alice.give_raise(10)      # 10% raise
print(f"  After 10% raise  : ${new_salary:,.2f}")

alice.add_review("Excellent performance this quarter.")
alice.add_review("Led the onboarding of 3 new team members.")
print(f"  alice reviews    : {alice.review_count()}")

# ===========================================================================
# 3. ENCAPSULATION
# ===========================================================================
print("\n" + "=" * 55)
print("3. ENCAPSULATION")
print("=" * 55)
print("""
  Encapsulation = controlling access to internal data.
  Python uses NAMING CONVENTIONS:
    self.name    -> public    (anyone can read/write)
    self._name   -> protected (convention: don't access from outside)
    self.__name  -> private   (Python name-mangles it)
""")

# Direct access to private list is possible but discouraged
print(f"  alice._reviews (accessed directly): {alice._reviews}")
print(f"  Better: alice.review_count()      : {alice.review_count()}")

# Property for controlled salary access
class EmployeeWithProperty:
    """Demonstrates property decorators for controlled attribute access."""

    def __init__(self, name, salary):
        self.name    = name
        self._salary = 0
        self.salary  = salary      # uses the setter

    @property
    def salary(self):
        """Getter - accessed like an attribute: emp.salary"""
        return self._salary

    @salary.setter
    def salary(self, value):
        """Setter - validates before storing."""
        if not isinstance(value, (int, float)) or value <= 0:
            raise ValueError(f"Salary must be a positive number, got {value!r}.")
        self._salary = float(value)

emp = EmployeeWithProperty("Dave", 60000)
print(f"\n  emp.salary (property) = ${emp.salary:,.2f}")

try:
    emp.salary = -100
except ValueError as err:
    print(f"  Setting salary=-100 raises ValueError: {err}")

# ===========================================================================
# 4. INHERITANCE
# ===========================================================================
print("\n" + "=" * 55)
print("4. INHERITANCE")
print("=" * 55)
print("""
  Inheritance: a child class inherits all attributes and methods
  of its parent class, and can add or override behaviour.
""")

class Manager(Employee):
    """A Manager is an Employee with an extra team and bonus."""

    def __init__(self, name, department, salary, team_size=0):
        super().__init__(name, department, salary)   # call parent __init__
        self.team_size = team_size
        self._bonus_pct = 15.0   # managers get a 15% bonus

    def calculate_bonus(self):
        """Return the annual bonus amount."""
        return self.salary * self._bonus_pct / 100

    def get_info(self):
        """Override parent method to include manager-specific info."""
        base = super().get_info()
        return f"{base} | Team: {self.team_size} | Bonus: ${self.calculate_bonus():,.2f}"

    def add_team_member(self):
        self.team_size += 1

class Intern(Employee):
    """An Intern is an Employee with a fixed stipend and duration."""

    def __init__(self, name, department, stipend, duration_months=6):
        super().__init__(name, department, stipend)
        self.duration_months = duration_months

    def get_info(self):
        base = super().get_info()
        return f"{base} | Duration: {self.duration_months}m"

mgr    = Manager("Eve Wilson",     "Engineering", 95000, team_size=5)
intern = Intern("Frank Lee",       "HR",          18000, duration_months=3)

print("  Polymorphism - same get_info() call, different output:")
for person in [alice, bob, mgr, intern]:
    print(f"    {person.get_info()}")

print(f"\n  isinstance(mgr, Employee) = {isinstance(mgr, Employee)}")
print(f"  isinstance(mgr, Manager)  = {isinstance(mgr, Manager)}")
print(f"  isinstance(alice, Manager)= {isinstance(alice, Manager)}")

# ===========================================================================
# 5. CLASS METHODS AND STATIC METHODS
# ===========================================================================
print("\n" + "=" * 55)
print("5. CLASS AND STATIC METHODS")
print("=" * 55)

class MathHelper:
    """Demonstrates @classmethod and @staticmethod."""

    default_precision = 2

    @classmethod
    def set_precision(cls, precision):
        """Class method - receives the class (cls) not the instance."""
        cls.default_precision = precision

    @staticmethod
    def format_currency(amount):
        """Static method - no access to class or instance, just a helper."""
        return f"${amount:,.{MathHelper.default_precision}f}"

print(f"  format_currency(72000)   = {MathHelper.format_currency(72000)}")
MathHelper.set_precision(0)
print(f"  After set_precision(0)   = {MathHelper.format_currency(72000)}")

print("\nobject-oriented-programming.py completed successfully.")
