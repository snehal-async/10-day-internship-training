/**
 * Exercise 2: Palindrome Checker
 *
 * Problem Description:
 * Checks whether a given string is a palindrome (reads the same backwards as forwards).
 *
 * Treatment of Case & Special Characters:
 * - By default, this function is CASE-INSENSITIVE and IGNORES non-alphanumeric characters
 *   (e.g., spaces, punctuation), so that "A man, a plan, a canal: Panama" returns true.
 * - Callers can customize this behavior via the options object:
 *   - options.caseSensitive (boolean, default: false)
 *   - options.ignoreSpecial (boolean, default: true)
 *
 * Algorithm Explanation:
 * 1. Normalize the string based on the configured options (filtering non-alphanumeric characters
 *    and converting to lowercase if case-insensitive).
 * 2. Use a two-pointer technique: initialize one pointer at the start (0) and another at the end (length - 1).
 * 3. Compare characters at both pointers. If they differ, the string is not a palindrome.
 * 4. Move pointers inward until they meet or cross. If all match, return true.
 *
 * Complexity:
 * - Time Complexity: O(n), where n is the length of the string, since we traverse the string linearly.
 * - Space Complexity: O(n) for the normalized string.
 *
 * @param {string} str - The string to check.
 * @param {Object} [options] - Configuration options.
 * @param {boolean} [options.caseSensitive=false] - If true, uppercase and lowercase are distinct.
 * @param {boolean} [options.ignoreSpecial=true] - If true, spaces and punctuation are omitted.
 * @returns {boolean} True if the string is a palindrome, false otherwise.
 * @throws {TypeError} If the input is not a string.
 */
function isPalindrome(str, options = {}) {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string, but received ${typeof str}`);
  }

  const { caseSensitive = false, ignoreSpecial = true } = options;

  let processed = str;
  if (!caseSensitive) {
    processed = processed.toLowerCase();
  }

  if (ignoreSpecial) {
    // Retain only alphanumeric characters: a-z, 0-9
    let alphanumeric = '';
    for (let i = 0; i < processed.length; i++) {
      const char = processed[i];
      if ((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9') || (!caseSensitive && char >= 'A' && char <= 'Z')) {
        alphanumeric += char;
      }
    }
    processed = alphanumeric;
  }

  // Two-pointer check
  let left = 0;
  let right = processed.length - 1;

  while (left < right) {
    if (processed[left] !== processed[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

module.exports = { isPalindrome };
