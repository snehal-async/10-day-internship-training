"""
Unit tests for JSON Storage handler with file-corruption safety.
"""
import unittest
import tempfile
import os
import shutil
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from storage import Storage, StorageError


class TestStorage(unittest.TestCase):

    def setUp(self):
        self.test_dir = tempfile.mkdtemp()
        self.file_path = os.path.join(self.test_dir, "employees.json")
        self.storage = Storage(self.file_path)

    def tearDown(self):
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def test_missing_file_returns_empty_list(self):
        # File does not exist yet
        self.assertFalse(os.path.exists(self.file_path))
        data = self.storage.load()
        self.assertEqual(data, [])

    def test_save_and_load_persistence(self):
        records = [
            {"id": "EMP1", "name": "Alice", "department": "IT", "salary": 70000.0},
            {"id": "EMP2", "name": "Bob", "department": "HR", "salary": 50000.0}
        ]
        self.storage.save(records)
        self.assertTrue(os.path.exists(self.file_path))

        loaded = self.storage.load()
        self.assertEqual(loaded, records)

    def test_malformed_json_raises_error_without_overwriting(self):
        corrupted_text = '{"id": "EMP1", INVALID_JSON_DATA...'
        with open(self.file_path, "w", encoding="utf-8") as f:
            f.write(corrupted_text)

        # Loading should raise StorageError
        with self.assertRaises(StorageError):
            self.storage.load()

        # Verify corrupted content was preserved and not deleted or overwritten
        with open(self.file_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertEqual(content, corrupted_text)


if __name__ == "__main__":
    unittest.main()