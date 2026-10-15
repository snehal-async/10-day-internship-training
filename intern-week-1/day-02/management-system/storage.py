"""
storage.py - File storage handler for persisting Employee records as JSON.
"""
import json
import os
from typing import List, Dict, Any


class StorageError(Exception):
    """Raised for persistence failures, including malformed JSON data."""
    pass


class Storage:
    """Manages saving and loading employee records from a JSON file."""

    def __init__(self, file_path: str = None):
        if file_path is None:
            # Default to data/employees.json relative to this file
            base_dir = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(base_dir, "data", "employees.json")
        self.file_path = file_path

    def load(self) -> List[Dict[str, Any]]:
        """
        Load records from JSON file.
        If file does not exist, return an empty list safely.
        If JSON is malformed, raise StorageError WITHOUT modifying the file.
        """
        if not os.path.exists(self.file_path):
            return []

        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    return []
                data = json.loads(content)
        except json.JSONDecodeError as err:
            raise StorageError(
                f"Data file '{self.file_path}' contains malformed JSON and could not be loaded: {err}. "
                "The file has NOT been overwritten to prevent data loss."
            ) from err
        except OSError as err:
            raise StorageError(f"Error accessing storage file '{self.file_path}': {err}") from err

        if not isinstance(data, list):
            raise StorageError(f"Invalid format in '{self.file_path}': expected a JSON list of employees.")

        return data

    def save(self, records: List[Dict[str, Any]]) -> None:
        """
        Save records to the JSON file.
        Creates parent directory if necessary.
        """
        try:
            dir_name = os.path.dirname(self.file_path)
            if dir_name and not os.path.exists(dir_name):
                os.makedirs(dir_name, exist_ok=True)

            # Write to a temporary file first, then replace for atomic-like safety
            temp_path = self.file_path + ".tmp"
            with open(temp_path, "w", encoding="utf-8") as f:
                json.dump(records, f, indent=2, ensure_ascii=False)
            
            if os.path.exists(self.file_path):
                os.replace(temp_path, self.file_path)
            else:
                os.rename(temp_path, self.file_path)
        except OSError as err:
            raise StorageError(f"Failed to save records to '{self.file_path}': {err}") from err