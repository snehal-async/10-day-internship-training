"""
analyzer.py - Core data analysis engine for employee datasets (CSV & JSON).
"""
import csv
import json
import math
import os
from typing import Dict, List, Any, Optional, Tuple


REQUIRED_COLUMNS = ["id", "name", "department", "salary"]


class AnalysisError(Exception):
    """Raised when dataset cannot be opened or parsed."""
    pass


class CSVAnalyzer:
    """Performs data validation, quality auditing, and statistical analysis on CSV/JSON files."""

    def __init__(self, file_path: str):
        self.file_path = file_path
        self.total_rows: int = 0
        self.valid_records: List[Dict[str, Any]] = []
        self.missing_field_rows: List[Dict[str, Any]] = []
        self.duplicate_records: List[Dict[str, Any]] = []
        self.invalid_salary_rows: List[Dict[str, Any]] = []
        self.columns_found: List[str] = []

    def run_analysis(self) -> Dict[str, Any]:
        """
        Execute full pipeline:
        1. Read and parse CSV
        2. Validate headers
        3. Identify missing fields, duplicates, and salary issues
        4. Calculate summary metrics
        """
        if not os.path.exists(self.file_path):
            raise AnalysisError(f"Data file '{self.file_path}' does not exist.")

        try:
            with open(self.file_path, "r", encoding="utf-8-sig", newline="") as f:
                reader = csv.reader(f)
                try:
                    header = next(reader)
                except StopIteration:
                    # Empty file
                    return self._empty_result(reason="File is completely empty.")

                # Normalize headers
                cleaned_headers = [h.strip().lower() for h in header]
                self.columns_found = cleaned_headers

                # Check required columns
                missing_cols = [c for c in REQUIRED_COLUMNS if c not in cleaned_headers]
                if missing_cols:
                    raise AnalysisError(
                        f"Missing required column(s): {', '.join(missing_cols)}. "
                        f"Found: {', '.join(cleaned_headers)}"
                    )

                seen_ids: set = set()
                row_idx = 1  # 1-indexed (header is row 1, data starts at row 2)

                for row in reader:
                    row_idx += 1
                    # Skip completely empty blank lines
                    if not row or not any(field.strip() for field in row):
                        continue

                    self.total_rows += 1
                    row_dict = {
                        cleaned_headers[i]: row[i].strip() if i < len(row) else ""
                        for i in range(len(cleaned_headers))
                    }

                    # 1. Check for missing required values
                    emp_id = row_dict.get("id", "")
                    name = row_dict.get("name", "")
                    dept = row_dict.get("department", "")
                    salary_str = row_dict.get("salary", "")

                    missing_fields = []
                    if not emp_id:
                        missing_fields.append("id")
                    if not name:
                        missing_fields.append("name")
                    if not dept:
                        missing_fields.append("department")
                    if not salary_str:
                        missing_fields.append("salary")

                    if missing_fields:
                        self.missing_field_rows.append({
                            "row_number": row_idx,
                            "record": row_dict,
                            "missing": missing_fields
                        })
                        continue

                    # 2. Check for duplicate ID
                    is_duplicate = emp_id in seen_ids
                    if is_duplicate:
                        self.duplicate_records.append({
                            "row_number": row_idx,
                            "id": emp_id,
                            "name": name,
                            "record": row_dict,
                            "reason": f"Employee ID '{emp_id}' already appeared in an earlier row."
                        })
                    seen_ids.add(emp_id)

                    # 3. Check and parse salary
                    try:
                        salary_num = float(salary_str)
                        if not math.isfinite(salary_num) or salary_num <= 0:
                            raise ValueError("Salary must be positive and finite")
                    except (ValueError, TypeError):
                        self.invalid_salary_rows.append({
                            "row_number": row_idx,
                            "id": emp_id,
                            "name": name,
                            "raw_salary": salary_str
                        })
                        continue

                    # Only consider rows without critical data faults as clean/valid
                    if not is_duplicate:
                        self.valid_records.append({
                            "id": emp_id,
                            "name": name,
                            "department": dept,
                            "salary": salary_num
                        })

        except OSError as err:
            raise AnalysisError(f"I/O error while reading '{self.file_path}': {err}") from err

        return self.get_summary()

    def _empty_result(self, reason: str = "") -> Dict[str, Any]:
        return {
            "file_name": os.path.basename(self.file_path),
            "status": "EMPTY",
            "message": reason,
            "total_rows": 0,
            "valid_records_count": 0,
            "missing_fields_count": 0,
            "duplicates_count": 0,
            "invalid_salary_count": 0,
            "salary_statistics": {
                "count": 0,
                "average": 0.0,
                "minimum": 0.0,
                "maximum": 0.0
            },
            "department_counts": {}
        }

    def get_summary(self) -> Dict[str, Any]:
        """Aggregate computed metrics into structured dictionary."""
        salaries = [r["salary"] for r in self.valid_records]
        dept_counts: Dict[str, int] = {}
        for r in self.valid_records:
            d = r["department"]
            dept_counts[d] = dept_counts.get(d, 0) + 1

        salary_stats = {
            "count": len(salaries),
            "average": round(sum(salaries) / len(salaries), 2) if salaries else 0.0,
            "minimum": round(min(salaries), 2) if salaries else 0.0,
            "maximum": round(max(salaries), 2) if salaries else 0.0
        }

        return {
            "file_name": os.path.basename(self.file_path),
            "status": "SUCCESS",
            "total_rows": self.total_rows,
            "valid_records_count": len(self.valid_records),
            "missing_fields_count": len(self.missing_field_rows),
            "duplicates_count": len(self.duplicate_records),
            "invalid_salary_count": len(self.invalid_salary_rows),
            "missing_details": self.missing_field_rows,
            "duplicate_details": self.duplicate_records,
            "invalid_salary_details": self.invalid_salary_rows,
            "salary_statistics": salary_stats,
            "department_counts": dept_counts
        }

    def format_terminal_report(self, summary: Dict[str, Any]) -> str:
        """Render human-readable text report."""
        lines = []
        lines.append("=" * 65)
        lines.append("         EMPLOYEE DATA ANALYSIS & AUDIT REPORT")
        lines.append("=" * 65)
        lines.append(f"  Target File           : {summary.get('file_name')}")
        lines.append(f"  Total Rows Evaluated  : {summary.get('total_rows')}")
        lines.append(f"  Clean / Valid Records : {summary.get('valid_records_count')}")
        lines.append(f"  Missing Value Rows    : {summary.get('missing_fields_count')}")
        lines.append(f"  Duplicate ID Rows     : {summary.get('duplicates_count')}")
        lines.append(f"  Invalid Salary Rows   : {summary.get('invalid_salary_count')}")
        lines.append("-" * 65)

        lines.append("  [SALARY STATISTICS (Clean Records)]")
        stats = summary.get("salary_statistics", {})
        lines.append(f"    - Sample Size : {stats.get('count', 0)}")
        lines.append(f"    - Average     : ${stats.get('average', 0.0):,.2f}")
        lines.append(f"    - Minimum     : ${stats.get('minimum', 0.0):,.2f}")
        lines.append(f"    - Maximum     : ${stats.get('maximum', 0.0):,.2f}")
        lines.append("-" * 65)

        lines.append("  [DEPARTMENT DISTRIBUTION]")
        depts = summary.get("department_counts", {})
        if depts:
            for d, count in sorted(depts.items()):
                lines.append(f"    - {d:<22}: {count} employee(s)")
        else:
            lines.append("    (No clean department records)")

        if summary.get("missing_details"):
            lines.append("-" * 65)
            lines.append("  [DATA QUALITY: Missing Values]")
            for item in summary["missing_details"]:
                lines.append(f"    Row {item['row_number']}: Missing field(s) {item['missing']}")

        if summary.get("duplicate_details"):
            lines.append("-" * 65)
            lines.append("  [DATA QUALITY: Duplicate Records]")
            for item in summary["duplicate_details"]:
                lines.append(f"    Row {item['row_number']}: {item['reason']} (Name: {item['name']})")

        if summary.get("invalid_salary_details"):
            lines.append("-" * 65)
            lines.append("  [DATA QUALITY: Invalid Salaries]")
            for item in summary["invalid_salary_details"]:
                lines.append(f"    Row {item['row_number']}: ID {item['id']} has invalid value '{item['raw_salary']}'")

        lines.append("=" * 65)
        return "\n".join(lines)

    def save_report(self, summary: Dict[str, Any], output_dir: str) -> Tuple[str, str]:
        """
        Save analysis report as both JSON and formatted text in output_dir.
        Returns paths of created files.
        """
        os.makedirs(output_dir, exist_ok=True)
        base_name = os.path.splitext(os.path.basename(self.file_path))[0]

        json_path = os.path.join(output_dir, f"{base_name}_report.json")
        txt_path = os.path.join(output_dir, f"{base_name}_report.txt")

        # Save JSON
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2)

        # Save text
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(self.format_terminal_report(summary))

        return json_path, txt_path