/**
 * Exercise 6: Missing Number in Sequence 1..n
 *
 * Problem Description:
 * Given an array containing distinct integers from the sequence 1 through n,
 * with exactly one number missing, finds and returns the missing number.
 * Validates input assumptions (all positive integers, no duplicates, within valid range).
 *
 * Algorithm Explanation:
 * If the array contains m elements, the complete sequence must have had n = m + 1 elements.
 * Using Gauss's formula, the sum of numbers from 1 to n is:
 *   expectedSum = (n * (n + 1)) / 2
 * We compute the sum of all elements currently present in the array (actualSum).
 * The missing integer is simply:
 *   missingNumber = expectedSum - actualSum
 *
 * Validation:
 * - Checks that the input is an array of length >= 1.
 * - Confirms each element is an integer in the valid range [1, n].
 * - Ensures there are no duplicate numbers in the input array.
 *
 * Complexity:
 * - Time Complexity: O(n), where n is the sequence length (single pass to validate and sum).
 * - Space Complexity: O(n), for the uniqueness validation set (or O(1) auxiliary if input is guaranteed valid).
 *
 * @param {number[]} arr - An array of distinct integers from 1..n with one missing.
 * @returns {number} The missing integer.
 * @throws {TypeError} If input is not an array or elements are not valid integers.
 * @throws {RangeError} If array is empty or elements fall outside the valid [1, n] range.
 * @throws {Error} If duplicate elements are detected.
 */
function findMissingNumber(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected an array, but received ${typeof arr}`);
  }

  if (arr.length === 0) {
    throw new RangeError('Array must contain at least one element');
  }

  const n = arr.length + 1;
  const expectedSum = (n * (n + 1)) / 2;

  let actualSum = 0;
  const seen = new Set();

  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];

    if (typeof val !== 'number' || !Number.isInteger(val)) {
      throw new TypeError(`All elements must be integers; invalid element at index ${i}: ${val}`);
    }

    if (val < 1 || val > n) {
      throw new RangeError(`Element ${val} at index ${i} is out of the expected range [1, ${n}]`);
    }

    if (seen.has(val)) {
      throw new Error(`Duplicate value detected: ${val}`);
    }

    seen.add(val);
    actualSum += val;
  }

  return expectedSum - actualSum;
}

module.exports = { findMissingNumber };
