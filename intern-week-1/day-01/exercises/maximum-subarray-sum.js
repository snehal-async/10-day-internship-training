/**
 * Exercise 14: Maximum Subarray Sum (Kadane's Algorithm)
 *
 * Problem Description:
 * Computes the maximum possible sum of a contiguous non-empty subarray within a given
 * array of numbers. Fully supports arrays containing negative numbers.
 *
 * Algorithm Explanation (Kadane's Algorithm):
 * At each position `i` in the array, the maximum contiguous subarray sum ending at `i` is either:
 *   1. Just the element `arr[i]` itself (starting a new contiguous subarray), or
 *   2. `currentSum + arr[i]` (extending the contiguous subarray that ended at `i - 1`).
 * Thus: `currentSum = Math.max(arr[i], currentSum + arr[i])`.
 * The overall `maxSum` is the maximum `currentSum` observed across all positions.
 * This handles arrays with all negative numbers correctly by picking the least negative single element.
 *
 * Complexity:
 * - Time Complexity: O(n), where n is the number of elements in the array (single linear pass).
 * - Space Complexity: O(1), constant auxiliary memory (only requires two accumulator variables).
 *
 * @param {number[]} arr - Non-empty array of finite numbers.
 * @returns {number} The maximum contiguous subarray sum.
 * @throws {TypeError} If input is not an array or contains non-numeric values.
 * @throws {RangeError} If the array is empty.
 */
function maxSubarraySum(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected an array, but received ${typeof arr}`);
  }

  if (arr.length === 0) {
    throw new RangeError('Cannot calculate maximum subarray sum of an empty array');
  }

  const first = arr[0];
  if (typeof first !== 'number' || !Number.isFinite(first)) {
    throw new TypeError(`Array elements must be finite numbers; invalid at index 0: ${first}`);
  }

  let currentSum = first;
  let maxSum = first;

  for (let i = 1; i < arr.length; i++) {
    const val = arr[i];
    if (typeof val !== 'number' || !Number.isFinite(val)) {
      throw new TypeError(`Array elements must be finite numbers; invalid at index ${i}: ${val}`);
    }

    currentSum = Math.max(val, currentSum + val);
    if (currentSum > maxSum) {
      maxSum = currentSum;
    }
  }

  return maxSum;
}

module.exports = { maxSubarraySum };
