/**
 * Exercise 7: Find Duplicate Numbers
 *
 * Problem Description:
 * Identifies duplicate numeric values in an array, returning each duplicate number
 * exactly once (i.e., without reporting the same duplicate repeatedly).
 *
 * Algorithm Explanation:
 * We use two auxiliary Sets:
 * 1. `seen`: Tracks all numbers encountered so far.
 * 2. `reported`: Tracks duplicate numbers already added to the result array.
 * As we iterate through the array:
 * - If the number is already in `seen` and has NOT yet been added to `reported`,
 *   we add it to `reported` and push it to the `duplicates` array.
 * - Otherwise, we add it to `seen`.
 * This guarantees linear O(n) execution without redundant reporting.
 *
 * Complexity:
 * - Time Complexity: O(n), where n is the number of elements in the array.
 * - Space Complexity: O(n), to maintain the `seen` and `reported` hash sets.
 *
 * @param {number[]} arr - An array of finite numbers.
 * @returns {number[]} An array of distinct numbers that appeared more than once.
 * @throws {TypeError} If the input is not an array or contains non-numeric values.
 */
function findDuplicates(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected an array, but received ${typeof arr}`);
  }

  const seen = new Set();
  const reported = new Set();
  const duplicates = [];

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    if (typeof num !== 'number' || !Number.isFinite(num)) {
      throw new TypeError(`Array must contain only finite numbers; invalid element at index ${i}: ${num}`);
    }

    if (seen.has(num)) {
      if (!reported.has(num)) {
        reported.add(num);
        duplicates.push(num);
      }
    } else {
      seen.add(num);
    }
  }

  return duplicates;
}

module.exports = { findDuplicates };
