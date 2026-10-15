"""
Unit tests for CSVAnalyzer.
"""
import unittest
import tempfile
import os
import shutil
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from analyzer import CSVAnalyzer, AnalysisError


class TestCSVAnalyzer(unittest.TestCase):

    def setUp(self):
        self.test_dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def _create_csv(self, content: str) -> str:
        file_path = os.path.join(self.test_dir, "test.csv")
        with open(file_path, "w", encoding="utf-8", newline="") as f:
            f.write(content)
        return file_path

    def test_clean_dataset_analysis(self):
        data = (
            "id,name,department,salary\n"
            "E1,Alice,Engineering,80000\n"
            "E2,Bob,Finance,60000\n"
            "E3,Charlie,Engineering,100000\n"
        )
        csv_path = self._create_csv(data)
        analyzer = CSVAnalyzer(csv_path)
        summary = analyzer.run_analysis()

        self.assertEqual(summary["status"], "SUCCESS")
        self.assertEqual(summary["total_rows"], 3)
        self.assertEqual(summary["valid_records_count"], 3)
        self.assertEqual(summary["missing_fields_count"], 0)
        self.assertEqual(summary["duplicates_count"], 0)
        self.assertEqual(summary["invalid_salary_count"], 0)

        # Statistics
        stats = summary["salary_statistics"]
        self.assertEqual(stats["count"], 3)
        self.assertEqual(stats["average"], 80000.0)
        self.assertEqual(stats["minimum"], 60000.0)
        self.assertEqual(stats["maximum"], 100000.0)

        # Department counts
        self.assertEqual(summary["department_counts"], {"Engineering": 2, "Finance": 1})

    def test_missing_required_values_detection(self):
        data = (
            "id,name,department,salary\n"
            "E1,Alice,,80000\n"
            "E2,,Finance,60000\n"
        )
        csv_path = self._create_csv(data)
        analyzer = CSVAnalyzer(csv_path)
        summary = analyzer.run_analysis()

        self.assertEqual(summary["missing_fields_count"], 2)
        self.assertEqual(summary["valid_records_count"], 0)

    def test_duplicate_detection(self):
        data = (
            "id,name,department,salary\n"
            "E1,Alice,Engineering,80000\n"
            "E1,Alice Duplicate,Engineering,80000\n"
        )
        csv_path = self._create_csv(data)
        analyzer = CSVAnalyzer(csv_path)
        summary = analyzer.run_analysis()

        self.assertEqual(summary["duplicates_count"], 1)
        self.assertEqual(summary["valid_records_count"], 1)

    def test_invalid_salary_detection(self):
        data = (
            "id,name,department,salary\n"
            "E1,Alice,Engineering,NOT_NUMERIC\n"
            "E2,Bob,Finance,-5000\n"
            "E3,Charlie,IT,75000\n"
        )
        csv_path = self._create_csv(data)
        analyzer = CSVAnalyzer(csv_path)
        summary = analyzer.run_analysis()

        self.assertEqual(summary["invalid_salary_count"], 2)
        self.assertEqual(summary["valid_records_count"], 1)
        self.assertEqual(summary["salary_statistics"]["average"], 75000.0)

    def test_empty_csv_file(self):
        csv_path = self._create_csv("")
        analyzer = CSVAnalyzer(csv_path)
        summary = analyzer.run_analysis()

        self.assertEqual(summary["status"], "EMPTY")
        self.assertEqual(summary["total_rows"], 0)

    def test_missing_required_columns_raises_error(self):
        data = "id,name,title\nE1,Alice,Manager\n"
        csv_path = self._create_csv(data)
        analyzer = CSVAnalyzer(csv_path)

        with self.assertRaises(AnalysisError):
            analyzer.run_analysis()

    def test_report_generation(self):
        data = (
            "id,name,department,salary\n"
            "E1,Alice,Engineering,90000\n"
        )
        csv_path = self._create_csv(data)
        analyzer = CSVAnalyzer(csv_path)
        summary = analyzer.run_analysis()

        reports_dir = os.path.join(self.test_dir, "reports")
        json_path, txt_path = analyzer.save_report(summary, reports_dir)

        self.assertTrue(os.path.exists(json_path))
        self.assertTrue(os.path.exists(txt_path))

        with open(txt_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("EMPLOYEE DATA ANALYSIS & AUDIT REPORT", content)
        self.assertIn("Engineering", content)


if __name__ == "__main__":
    unittest.main()