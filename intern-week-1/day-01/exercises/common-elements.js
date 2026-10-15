/**
 * Exercise 11: Common Elements of Two Arrays
 *
 * Problem Description:
 * Finds elements that appear in both input arrays.
 *
 * Treatment of Duplicates:
 * - By default (`retainDuplicates: false`), the function computes a mathematical SET INTERSECTION.
 *   Each common element appears exactly once in the output, regardless of how many times it appeared
 *   in the source arrays.
 * - If `retainDuplicates: true` is passed in options, the function computes a MULTISET INTERSECTION,
 *   retaining duplicate pairs (matching counts from both arrays).
 *
 * Algorithm Explanation:
 * 1. For standard set intersection (default):
 *    - Convert `arr1` into a Set `set1`.
 *    - Iterate through `arr2`. If an element exists in `set1`, add it to a result `commonSet`.
 *    - Convert `commonSet` to an array.
 * 2. For multiset intersection:
 *    - Build a frequency map of `arr1`.
 *    - Iterate through `arr2`; if an item has remaining count > 0 in the map, append to result and decrement count.
 *
 * Complexity:
 * - Time Complexity: O(n + m), where n and m are lengths of `arr1` and `arr2`.
 * - Space Complexity: O(min(n, m)), to store the hash set / map of elements.
 *
 * @param {Array} arr1 - First array.
 * @param {Array} arr2 - Second array.
 * @param {Object} [options] - Configuration options.
 * @param {boolean} [options.retainDuplicates=false] - If true, preserves duplicate occurrences.
 * @returns {Array} Array of common elements.
 * @throws {TypeError} If either argument is not an array.
 */
function findCommonElements(arr1, arr2, options = {}) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    throw new TypeError('Both arguments must be arrays');
  }

  const { retainDuplicates = false } = options;

  if (retainDuplicates) {
    // Multiset intersection
    const freq = new Map();
    for (const item of arr1) {
      freq.set(item, (freq.get(item) || 0) + 1);
    }

    const result = [];
    for (const item of arr2) {
      const count = freq.get(item) || 0;
      if (count > 0) {
        result.push(item);
        freq.set(item, count - 1);
      }
    }
    return result;
  }

  // Default: Unique set intersection
  const set1 = new Set(arr1);
  const commonSet = new Set();

  for (let i = 0; i < arr2.length; i++) {
    const item = arr2[i];
    if (set1.has(item)) {
      commonSet.add(item);
    }
  }

  return Array.from(commonSet);
}

module.exports = { findCommonElements };
