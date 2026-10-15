/**
 * Exercise 5: Remove Duplicates Preserving Insertion Order
 *
 * Problem Description:
 * Removes duplicate values from an array while strictly preserving the order
 * of their first occurrences.
 *
 * Algorithm Explanation:
 * We maintain an auxiliary `Set` called `seen` to achieve O(1) constant-time membership lookups,
 * and a result array `uniqueElements`.
 * Iterate through the input array element by element:
 * - If the current element has not been encountered yet (not in `seen`), add it to `seen`
 *   and push it into `uniqueElements`.
 * - If it has already been encountered, skip it.
 * This guarantees linear O(n) performance while maintaining the original sequence order.
 *
 * Complexity:
 * - Time Complexity: O(n), where n is the length of the array, since each lookup and insertion in Set is O(1) on average.
 * - Space Complexity: O(n), to store the `seen` lookup structure and output array.
 *
 * @param {Array} arr - The array containing potentially duplicate values.
 * @returns {Array} A new array containing only first occurrences of each element.
 * @throws {TypeError} If the input is not an array.
 */
function removeDuplicates(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected an array, but received ${typeof arr}`);
  }

  const seen = new Set();
  const uniqueElements = [];

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!seen.has(item)) {
      seen.add(item);
      uniqueElements.push(item);
    }
  }

  return uniqueElements;
}

module.exports = { removeDuplicates };
