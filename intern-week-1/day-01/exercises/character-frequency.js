/**
 * Exercise 8: Character Frequency Counter
 *
 * Problem Description:
 * Counts the occurrences of each character in a string and returns a frequency map.
 *
 * Treatment of Case & Spaces:
 * - By default, this function is CASE-SENSITIVE (`caseSensitive: true`), meaning 'A' and 'a'
 *   are counted as distinct entries.
 * - By default, spaces ARE INCLUDED (`ignoreSpaces: false`) and counted like any other character.
 * - Callers can modify this behavior via options:
 *   - `options.caseSensitive` (boolean, default: true)
 *   - `options.ignoreSpaces` (boolean, default: false)
 *
 * Algorithm Explanation:
 * 1. Normalize the string if case insensitivity is requested.
 * 2. Initialize an empty frequency dictionary (plain object).
 * 3. Iterate through each character of the string.
 * 4. If `ignoreSpaces` is enabled and the character is a space, skip it.
 * 5. Increment the count for that character in the dictionary.
 *
 * Complexity:
 * - Time Complexity: O(n), where n is the length of the string (single pass).
 * - Space Complexity: O(k), where k <= n is the number of distinct characters in the alphabet.
 *
 * @param {string} str - The input string.
 * @param {Object} [options] - Configuration options.
 * @param {boolean} [options.caseSensitive=true] - Whether to distinguish upper and lower case.
 * @param {boolean} [options.ignoreSpaces=false] - Whether to skip whitespace characters.
 * @returns {Record<string, number>} A frequency map of character occurrences.
 * @throws {TypeError} If the input is not a string.
 */
function countCharacterFrequency(str, options = {}) {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string, but received ${typeof str}`);
  }

  const { caseSensitive = true, ignoreSpaces = false } = options;
  const frequencyMap = {};

  const targetStr = caseSensitive ? str : str.toLowerCase();

  for (let i = 0; i < targetStr.length; i++) {
    const char = targetStr[i];

    if (ignoreSpaces && char === ' ') {
      continue;
    }

    frequencyMap[char] = (frequencyMap[char] || 0) + 1;
  }

  return frequencyMap;
}

module.exports = { countCharacterFrequency };
