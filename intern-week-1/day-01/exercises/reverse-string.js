/**
 * Exercise 1: Reverse a String
 *
 * Problem Description:
 * Reverses a given string without using JavaScript's built-in Array.prototype.reverse() method.
 *
 * Algorithm Explanation:
 * We iterate through the input string starting from the last index (length - 1)
 * down to index 0, appending each character to a new result string.
 * This directly demonstrates loop manipulation and string indexing.
 *
 * Complexity:
 * - Time Complexity: O(n), where n is the length of the string, as each character is visited once.
 * - Space Complexity: O(n), to store the newly constructed reversed string.
 *
 * @param {string} str - The string to reverse.
 * @returns {string} The reversed string.
 * @throws {TypeError} If the argument is not a string.
 */
function reverseString(str) {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string, but received ${typeof str}`);
  }

  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }

  return reversed;
}

module.exports = { reverseString };
