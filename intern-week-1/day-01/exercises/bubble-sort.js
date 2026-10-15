/**
 * Exercise 15: Bubble Sort (Ascending Order)
 *
 * Problem Description:
 * Implements the classic Bubble Sort algorithm without using Array.prototype.sort().
 * Returns a new sorted array in ascending order, preserving the original array.
 * Correctly handles positive numbers, negative numbers, zeros, and duplicate values.
 *
 * Algorithm Explanation:
 * 1. Clone the array to avoid mutating caller data.
 * 2. Traverse the array with nested loops:
 *    - In each pass of the outer loop, adjacent elements are compared in pairs (`j` and `j + 1`).
 *    - If `arr[j] > arr[j + 1]`, they are swapped so that the larger element "bubbles up"
 *      toward the end of the array.
 * 3. Early Termination Optimization:
 *    - Maintain a boolean flag `swapped`. If no swaps occur during an entire inner pass,
 *      the array is already completely sorted, and the algorithm terminates immediately.
 *
 * Complexity:
 * - Worst-Case Time: O(n^2), when elements are in reverse order.
 * - Average-Case Time: O(n^2).
 * - Best-Case Time: O(n), when the array is already sorted (due to early exit flag).
 * - Auxiliary Space Complexity: O(1) in-place swapping (O(n) for the return copy).
 *
 * @param {number[]} arr - Array of numbers to sort.
 * @returns {number[]} A new array sorted in ascending order.
 * @throws {TypeError} If the argument is not an array or contains non-numeric values.
 */
function bubbleSort(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected an array, but received ${typeof arr}`);
  }

  // Clone array
  const sorted = [...arr];
  const len = sorted.length;

  // Validate elements
  for (let idx = 0; idx < len; idx++) {
    if (typeof sorted[idx] !== 'number' || !Number.isFinite(sorted[idx])) {
      throw new TypeError(`Array must contain only finite numbers; invalid at index ${idx}: ${sorted[idx]}`);
    }
  }

  for (let i = 0; i < len - 1; i++) {
    let swapped = false;

    for (let j = 0; j < len - i - 1; j++) {
      if (sorted[j] > sorted[j + 1]) {
        // Swap adjacent elements
        const temp = sorted[j];
        sorted[j] = sorted[j + 1];
        sorted[j + 1] = temp;
        swapped = true;
      }
    }

    // If no swaps occurred, the array is already sorted
    if (!swapped) {
      break;
    }
  }

  return sorted;
}

module.exports = { bubbleSort };
