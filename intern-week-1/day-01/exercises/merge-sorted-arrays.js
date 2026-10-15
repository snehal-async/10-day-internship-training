/**
 * Exercise 10: Merge Two Sorted Arrays
 *
 * Problem Description:
 * Merges two already sorted numeric arrays into a single new sorted array.
 * Uses a classic two-pointer approach without relying on Array.prototype.sort().
 *
 * Algorithm Explanation:
 * 1. Initialize pointer `i = 0` for `arr1` and pointer `j = 0` for `arr2`.
 * 2. Create an empty result array `merged`.
 * 3. Loop while both pointers are within bounds:
 *    - Compare `arr1[i]` and `arr2[j]`.
 *    - Append the smaller (or equal) value to `merged` and advance that pointer.
 * 4. Once one array is exhausted, append the remaining elements of the other array.
 *
 * Complexity:
 * - Time Complexity: O(n + m), where n is the length of `arr1` and m is the length of `arr2`.
 * - Space Complexity: O(n + m), to store the merged result array.
 *
 * @param {number[]} arr1 - The first sorted array of numbers.
 * @param {number[]} arr2 - The second sorted array of numbers.
 * @returns {number[]} The merged sorted array.
 * @throws {TypeError} If either argument is not an array or contains non-numeric values.
 */
function mergeSortedArrays(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    throw new TypeError('Both arguments must be arrays');
  }

  // Validate elements
  for (let idx = 0; idx < arr1.length; idx++) {
    if (typeof arr1[idx] !== 'number' || !Number.isFinite(arr1[idx])) {
      throw new TypeError(`arr1 contains invalid number at index ${idx}: ${arr1[idx]}`);
    }
  }
  for (let idx = 0; idx < arr2.length; idx++) {
    if (typeof arr2[idx] !== 'number' || !Number.isFinite(arr2[idx])) {
      throw new TypeError(`arr2 contains invalid number at index ${idx}: ${arr2[idx]}`);
    }
  }

  const merged = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      merged.push(arr1[i]);
      i++;
    } else {
      merged.push(arr2[j]);
      j++;
    }
  }

  while (i < arr1.length) {
    merged.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    merged.push(arr2[j]);
    j++;
  }

  return merged;
}

module.exports = { mergeSortedArrays };
