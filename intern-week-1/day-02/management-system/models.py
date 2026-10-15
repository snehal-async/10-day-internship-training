"""
models.py - Employee domain model.
"""
from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class Employee:
    """Represents an employee record in the management system."""
    id: str
    name: str
    department: str
    salary: float

    def to_dict(self) -> Dict[str, Any]:
        """Convert employee instance to a JSON-serializable dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "department": self.department,
            "salary": float(self.salary)
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Employee":
        """Instantiate an Employee from a dictionary record."""
        return cls(
            id=str(data["id"]).strip(),
            name=str(data["name"]).strip(),
            department=str(data["department"]).strip(),
            salary=float(data["salary"])
        )

    def __str__(self) -> str:
        return f"[{self.id}] {self.name} | Dept: {self.department} | Salary: ${self.salary:,.2f}"