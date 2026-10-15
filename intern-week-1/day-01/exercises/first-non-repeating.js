/**
 * Exercise 9: First Non-Repeating Character
 *
 * Problem Description:
 * Finds and returns the first character in a string that appears exactly once.
 * If all characters repeat, or the string is empty, returns null.
 *
 * Algorithm Explanation:
 * We use a two-pass linear time algorithm:
 * 1. First Pass: Traverse the string and build a frequency map recording the occurrence
 *    count of each character.
 * 2. Second Pass: Traverse the original string character-by-character from left to right.
 *    The first character whose count in the frequency map is 1 is immediately returned.
 * 3. If the loop completes without finding any character with a count of 1, return null.
 *
 * Complexity:
 * - Time Complexity: O(n), where n is the length of the string (two linear passes).
 * - Space Complexity: O(k), where k is the number of distinct characters in the string.
 *
 * @param {string} str - The input string to inspect.
 * @param {Object} [options] - Options for matching.
 * @param {boolean} [options.caseSensitive=true] - Whether character case is distinguished.
 * @returns {string|null} The first unique character, or null if no unique character exists.
 * @throws {TypeError} If the input is not a string.
 */
function findFirstNonRepeatingCharacter(str, options = {}) {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string, but received ${typeof str}`);
  }

  if (str.length === 0) {
    return null;
  }

  const { caseSensitive = true } = options;
  const lookupStr = caseSensitive ? str : str.toLowerCase();
  const freq = new Map();

  // First pass: count frequencies
  for (let i = 0; i < lookupStr.length; i++) {
    const char = lookupStr[i];
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // Second pass: identify first character with frequency === 1
  for (let i = 0; i < str.length; i++) {
    const lookupChar = lookupStr[i];
    if (freq.get(lookupChar) === 1) {
      return str[i];
    }
  }

  return null;
}

module.exports = { findFirstNonRepeatingCharacter };
