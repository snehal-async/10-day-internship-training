/**
 * Employee Management System - Persistence Store
 *
 * Handles resilient reading and writing of employee records to a local JSON file.
 * Protects existing data: If a data file is malformed or corrupted, it throws
 * an explicit error and refuses to silently overwrite the corrupted file.
 */

const fs = require('fs');
const path = require('path');

class EmployeeStore {
  /**
   * Initializes the store with a configurable file path.
   *
   * @param {string} [filePath] - Path to the JSON data file.
   */
  constructor(filePath) {
    this.filePath = filePath || path.join(__dirname, '..', 'data', 'employees.json');
  }

  /**
   * Ensures that the parent directory for the storage file exists.
   * @private
   */
  _ensureDirectoryExists() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Loads all employees from the JSON file.
   * - If the file does not exist, returns an empty array.
   * - If the file exists and is valid, returns the parsed array.
   * - If the file contains malformed JSON, throws an Error without modifying the file.
   *
   * @returns {Promise<Array<Object>>} List of employee records.
   */
  async load() {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }

    let raw;
    try {
      raw = await fs.promises.readFile(this.filePath, 'utf-8');
    } catch (err) {
      throw new Error(`Failed to read data file at "${this.filePath}": ${err.message}`);
    }

    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      return [];
    }

    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch (parseError) {
      throw new Error(
        `Data file at "${this.filePath}" contains malformed JSON. ` +
        `Refusing to overwrite to prevent data loss. Details: ${parseError.message}`
      );
    }

    if (!Array.isArray(parsed)) {
      throw new Error(
        `Data file at "${this.filePath}" must contain a JSON array, but found ${typeof parsed}.`
      );
    }

    return parsed;
  }

  /**
   * Synchronously loads all employees (useful for quick initialization or sync tests).
   *
   * @returns {Array<Object>} List of employee records.
   */
  loadSync() {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }

    const raw = fs.readFileSync(this.filePath, 'utf-8');
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      return [];
    }

    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch (parseError) {
      throw new Error(
        `Data file at "${this.filePath}" contains malformed JSON. Refusing to overwrite. Details: ${parseError.message}`
      );
    }

    if (!Array.isArray(parsed)) {
      throw new Error(`Data file at "${this.filePath}" must contain an array.`);
    }

    return parsed;
  }

  /**
   * Persists the given array of employees to the JSON file.
   *
   * @param {Array<Object>} employees - Array of employee records to persist.
   * @returns {Promise<void>}
   */
  async save(employees) {
    if (!Array.isArray(employees)) {
      throw new TypeError('Cannot save: employees must be an array.');
    }

    this._ensureDirectoryExists();

    const jsonString = JSON.stringify(employees, null, 2);
    await fs.promises.writeFile(this.filePath, jsonString, 'utf-8');
  }

  /**
   * Synchronously persists employees to the JSON file.
   *
   * @param {Array<Object>} employees - Array of employee records.
   */
  saveSync(employees) {
    if (!Array.isArray(employees)) {
      throw new TypeError('Cannot save: employees must be an array.');
    }

    this._ensureDirectoryExists();
    fs.writeFileSync(this.filePath, JSON.stringify(employees, null, 2), 'utf-8');
  }
}

module.exports = { EmployeeStore };
