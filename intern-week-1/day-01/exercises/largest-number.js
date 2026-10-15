/**
 * Exercise 3: Largest Number
 *
 * Problem Description:
 * Finds the largest number in a non-empty numeric array without using Math.max(...arr).
 *
 * Algorithm Explanation:
 * Initialize a variable `largest` with the first element of the array.
 * Iterate through the array from the second element onward. At each step, compare
 * the current element with `largest`. If the current element is greater, update `largest`.
 *
 * Complexity:
 * - Time Complexity: O(n), where n is the number of elements in the array (single pass).
 * - Space Complexity: O(1), requiring only a constant amount of additional memory.
 *
 * @param {number[]} arr - An array of finite numbers.
 * @returns {number} The maximum numeric value.
 * @throws {TypeError} If input is not an array or contains non-numeric/non-finite values.
 * @throws {RangeError} If the array is empty.
 */
function findLargestNumber(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected an array, but received ${typeof arr}`);
  }

  if (arr.length === 0) {
    throw new RangeError('Cannot find the largest number of an empty array');
  }

  let largest = arr[0];
  if (typeof largest !== 'number' || !Number.isFinite(largest)) {
    throw new TypeError(`Array must contain only finite numbers; invalid element at index 0: ${largest}`);
  }

  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    if (typeof current !== 'number' || !Number.isFinite(current)) {
      throw new TypeError(`Array must contain only finite numbers; invalid element at index ${i}: ${current}`);
    }

    if (current > largest) {
      largest = current;
    }
  }

  return largest;
}

module.exports = { findLargestNumber };
