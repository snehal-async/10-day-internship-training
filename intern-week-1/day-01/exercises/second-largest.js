/**
 * Exercise 4: Second-Largest Distinct Number
 *
 * Problem Description:
 * Finds the second-largest distinct numeric value in an array.
 * If the array contains fewer than two distinct numbers (e.g., all elements are identical,
 * or array has fewer than two elements), the function returns null.
 *
 * Algorithm Explanation:
 * Maintain two variables: `first` and `second`, both initialized to -Infinity.
 * Iterate through the array in a single pass:
 * - If the current element is strictly greater than `first`, update `second = first`
 *   and `first = current`.
 * - Else if the current element is strictly less than `first` but strictly greater than `second`,
 *   update `second = current`.
 * After traversing the entire array, if `second` remains -Infinity, it means fewer than
 * two distinct values were present, so return `null`. Otherwise, return `second`.
 *
 * Complexity:
 * - Time Complexity: O(n), where n is the number of elements in the array (single pass).
 * - Space Complexity: O(1), constant auxiliary space without sorting or full deduplication sets.
 *
 * @param {number[]} arr - An array of finite numbers.
 * @returns {number|null} The second-largest distinct number, or null if fewer than two distinct values exist.
 * @throws {TypeError} If input is not an array or contains non-finite numbers.
 */
function findSecondLargest(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected an array, but received ${typeof arr}`);
  }

  let first = -Infinity;
  let second = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    if (typeof num !== 'number' || !Number.isFinite(num)) {
      throw new TypeError(`Array must contain only finite numbers; invalid element at index ${i}: ${num}`);
    }

    if (num > first) {
      second = first;
      first = num;
    } else if (num < first && num > second) {
      second = num;
    }
  }

  return second === -Infinity ? null : second;
}

module.exports = { findSecondLargest };
