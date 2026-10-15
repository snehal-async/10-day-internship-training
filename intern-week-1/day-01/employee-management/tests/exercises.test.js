/**
 * Automated Test Suite: 15 Data Structures & Algorithms Exercises
 *
 * Built with Node.js native test runner (node:test) and assertions (node:assert/strict).
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { reverseString } = require('../../exercises/reverse-string');
const { isPalindrome } = require('../../exercises/palindrome');
const { findLargestNumber } = require('../../exercises/largest-number');
const { findSecondLargest } = require('../../exercises/second-largest');
const { removeDuplicates } = require('../../exercises/remove-duplicates');
const { findMissingNumber } = require('../../exercises/missing-number');
const { findDuplicates } = require('../../exercises/find-duplicates');
const { countCharacterFrequency } = require('../../exercises/character-frequency');
const { findFirstNonRepeatingCharacter } = require('../../exercises/first-non-repeating');
const { mergeSortedArrays } = require('../../exercises/merge-sorted-arrays');
const { findCommonElements } = require('../../exercises/common-elements');
const { Stack } = require('../../exercises/stack');
const { Queue } = require('../../exercises/queue');
const { maxSubarraySum } = require('../../exercises/maximum-subarray-sum');
const { bubbleSort } = require('../../exercises/bubble-sort');

describe('Exercise 1: Reverse String', () => {
  it('should reverse a standard ASCII string', () => {
    assert.strictEqual(reverseString('hello'), 'olleh');
  });

  it('should reverse a string with spaces and punctuation', () => {
    assert.strictEqual(reverseString('Hello, World!'), '!dlroW ,olleH');
  });

  it('should handle single-character strings', () => {
    assert.strictEqual(reverseString('x'), 'x');
  });

  it('should handle empty strings', () => {
    assert.strictEqual(reverseString(''), '');
  });

  it('should throw TypeError on invalid inputs', () => {
    assert.throws(() => reverseString(12345), TypeError);
    assert.throws(() => reverseString(null), TypeError);
    assert.throws(() => reverseString(undefined), TypeError);
  });
});

describe('Exercise 2: Palindrome Checker', () => {
  it('should identify basic palindromes', () => {
    assert.strictEqual(isPalindrome('racecar'), true);
    assert.strictEqual(isPalindrome('madam'), true);
  });

  it('should identify non-palindromes', () => {
    assert.strictEqual(isPalindrome('hello'), false);
    assert.strictEqual(isPalindrome('internship'), false);
  });

  it('should handle phrases with punctuation and mixed case by default', () => {
    assert.strictEqual(isPalindrome('A man, a plan, a canal: Panama'), true);
    assert.strictEqual(isPalindrome('Was it a car or a cat I saw?'), true);
  });

  it('should respect caseSensitive option', () => {
    assert.strictEqual(isPalindrome('Racecar', { caseSensitive: true }), false);
    assert.strictEqual(isPalindrome('racecar', { caseSensitive: true }), true);
  });

  it('should respect ignoreSpecial: false option', () => {
    assert.strictEqual(isPalindrome('race car', { ignoreSpecial: false }), false);
  });

  it('should treat empty string and single character as palindromes', () => {
    assert.strictEqual(isPalindrome(''), true);
    assert.strictEqual(isPalindrome('a'), true);
  });

  it('should throw TypeError for non-string inputs', () => {
    assert.throws(() => isPalindrome(12321), TypeError);
  });
});

describe('Exercise 3: Largest Number', () => {
  it('should find the largest in a typical array', () => {
    assert.strictEqual(findLargestNumber([3, 7, 2, 9, 4]), 9);
  });

  it('should find the largest in an array of all negative numbers', () => {
    assert.strictEqual(findLargestNumber([-10, -50, -3, -22]), -3);
  });

  it('should handle a single-element array', () => {
    assert.strictEqual(findLargestNumber([42]), 42);
  });

  it('should handle arrays with duplicate maximum values', () => {
    assert.strictEqual(findLargestNumber([10, 50, 50, 20]), 50);
  });

  it('should throw RangeError on empty array', () => {
    assert.throws(() => findLargestNumber([]), RangeError);
  });

  it('should throw TypeError on invalid or non-numeric arrays', () => {
    assert.throws(() => findLargestNumber('not-an-array'), TypeError);
    assert.throws(() => findLargestNumber([1, 2, 'three']), TypeError);
    assert.throws(() => findLargestNumber([1, NaN, 3]), TypeError);
  });
});

describe('Exercise 4: Second-Largest Distinct Number', () => {
  it('should find second largest in distinct numbers', () => {
    assert.strictEqual(findSecondLargest([10, 20, 30, 40, 50]), 40);
  });

  it('should correctly ignore duplicate highest values', () => {
    assert.strictEqual(findSecondLargest([10, 5, 20, 20, 8]), 10);
  });

  it('should handle negative numbers correctly', () => {
    assert.strictEqual(findSecondLargest([-10, -5, -20, -1]), -5);
  });

  it('should return null when fewer than two distinct values exist', () => {
    assert.strictEqual(findSecondLargest([5, 5, 5, 5]), null);
    assert.strictEqual(findSecondLargest([42]), null);
    assert.strictEqual(findSecondLargest([]), null);
  });

  it('should throw TypeError on invalid inputs', () => {
    assert.throws(() => findSecondLargest('invalid'), TypeError);
    assert.throws(() => findSecondLargest([1, 2, null]), TypeError);
  });
});

describe('Exercise 5: Remove Duplicates', () => {
  it('should remove duplicates and preserve first appearance order', () => {
    const input = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
    assert.deepStrictEqual(removeDuplicates(input), [3, 1, 4, 5, 9, 2, 6]);
  });

  it('should handle arrays with no duplicates', () => {
    assert.deepStrictEqual(removeDuplicates([1, 2, 3]), [1, 2, 3]);
  });

  it('should handle arrays where all elements are identical', () => {
    assert.deepStrictEqual(removeDuplicates([7, 7, 7, 7]), [7]);
  });

  it('should handle empty arrays', () => {
    assert.deepStrictEqual(removeDuplicates([]), []);
  });

  it('should work with string arrays', () => {
    assert.deepStrictEqual(removeDuplicates(['a', 'b', 'a', 'c', 'b']), ['a', 'b', 'c']);
  });

  it('should throw TypeError on non-array input', () => {
    assert.throws(() => removeDuplicates(null), TypeError);
  });
});

describe('Exercise 6: Missing Number', () => {
  it('should find missing number in the middle of sequence 1..n', () => {
    assert.strictEqual(findMissingNumber([1, 2, 4, 5, 6]), 3);
  });

  it('should find missing number at the beginning (1)', () => {
    assert.strictEqual(findMissingNumber([2, 3, 4, 5]), 1);
  });

  it('should find missing number at the end (n)', () => {
    assert.strictEqual(findMissingNumber([1, 2, 3, 4]), 5);
  });

  it('should handle single-element array (missing 1 or 2)', () => {
    assert.strictEqual(findMissingNumber([2]), 1);
    assert.strictEqual(findMissingNumber([1]), 2);
  });

  it('should reject empty arrays', () => {
    assert.throws(() => findMissingNumber([]), RangeError);
  });

  it('should reject duplicate numbers', () => {
    assert.throws(() => findMissingNumber([1, 2, 2, 4]), Error);
  });

  it('should reject numbers outside valid 1..n range', () => {
    assert.throws(() => findMissingNumber([1, 2, 99]), RangeError);
  });

  it('should throw TypeError on non-integer inputs', () => {
    assert.throws(() => findMissingNumber([1, 2.5, 3]), TypeError);
  });
});

describe('Exercise 7: Find Duplicate Numbers', () => {
  it('should return all duplicates without repeated reporting', () => {
    const input = [1, 2, 3, 2, 1, 4, 1, 5, 2];
    assert.deepStrictEqual(findDuplicates(input), [2, 1]);
  });

  it('should return empty array when no duplicates exist', () => {
    assert.deepStrictEqual(findDuplicates([1, 2, 3, 4, 5]), []);
  });

  it('should handle negative numbers as duplicates', () => {
    assert.deepStrictEqual(findDuplicates([-1, -2, -1, 3, -2]), [-1, -2]);
  });

  it('should handle empty array', () => {
    assert.deepStrictEqual(findDuplicates([]), []);
  });

  it('should throw TypeError on non-array or non-numeric inputs', () => {
    assert.throws(() => findDuplicates('test'), TypeError);
    assert.throws(() => findDuplicates([1, 'two', 3]), TypeError);
  });
});

describe('Exercise 8: Character Frequency', () => {
  it('should count character frequency accurately', () => {
    const freq = countCharacterFrequency('hello');
    assert.deepStrictEqual(freq, { h: 1, e: 1, l: 2, o: 1 });
  });

  it('should distinguish case by default', () => {
    const freq = countCharacterFrequency('Aa');
    assert.strictEqual(freq['A'], 1);
    assert.strictEqual(freq['a'], 1);
  });

  it('should support case-insensitive counting', () => {
    const freq = countCharacterFrequency('Aa', { caseSensitive: false });
    assert.strictEqual(freq['a'], 2);
    assert.strictEqual(freq['A'], undefined);
  });

  it('should include spaces by default', () => {
    const freq = countCharacterFrequency('a b');
    assert.strictEqual(freq[' '], 1);
  });

  it('should omit spaces when ignoreSpaces: true', () => {
    const freq = countCharacterFrequency('a b', { ignoreSpaces: true });
    assert.strictEqual(freq[' '], undefined);
  });

  it('should handle empty strings', () => {
    assert.deepStrictEqual(countCharacterFrequency(''), {});
  });

  it('should throw TypeError on invalid input', () => {
    assert.throws(() => countCharacterFrequency(42), TypeError);
  });
});

describe('Exercise 9: First Non-Repeating Character', () => {
  it('should find the first unique character in a string', () => {
    assert.strictEqual(findFirstNonRepeatingCharacter('swiss'), 'w');
    assert.strictEqual(findFirstNonRepeatingCharacter('leetcode'), 'l');
  });

  it('should return null when all characters repeat', () => {
    assert.strictEqual(findFirstNonRepeatingCharacter('aabbcc'), null);
  });

  it('should return null for empty strings', () => {
    assert.strictEqual(findFirstNonRepeatingCharacter(''), null);
  });

  it('should respect case sensitivity', () => {
    // 'S' and 's' are distinct when caseSensitive: true
    assert.strictEqual(findFirstNonRepeatingCharacter('sS', { caseSensitive: true }), 's');
    // 'S' and 's' are considered duplicates when caseSensitive: false
    assert.strictEqual(findFirstNonRepeatingCharacter('sS', { caseSensitive: false }), null);
  });

  it('should throw TypeError on non-string input', () => {
    assert.throws(() => findFirstNonRepeatingCharacter(null), TypeError);
  });
});

describe('Exercise 10: Merge Sorted Arrays', () => {
  it('should merge two sorted arrays of equal size', () => {
    assert.deepStrictEqual(mergeSortedArrays([1, 3, 5], [2, 4, 6]), [1, 2, 3, 4, 5, 6]);
  });

  it('should merge arrays of different lengths with duplicate values', () => {
    assert.deepStrictEqual(mergeSortedArrays([1, 2, 2, 7], [2, 3, 8, 9, 10]), [1, 2, 2, 2, 3, 7, 8, 9, 10]);
  });

  it('should handle when one array is empty', () => {
    assert.deepStrictEqual(mergeSortedArrays([], [1, 2, 3]), [1, 2, 3]);
    assert.deepStrictEqual(mergeSortedArrays([4, 5], []), [4, 5]);
  });

  it('should handle both arrays empty', () => {
    assert.deepStrictEqual(mergeSortedArrays([], []), []);
  });

  it('should handle negative numbers', () => {
    assert.deepStrictEqual(mergeSortedArrays([-5, -1, 3], [-10, 0, 4]), [-10, -5, -1, 0, 3, 4]);
  });

  it('should throw TypeError on invalid arguments', () => {
    assert.throws(() => mergeSortedArrays('a', [1, 2]), TypeError);
    assert.throws(() => mergeSortedArrays([1, 'two'], [3, 4]), TypeError);
  });
});

describe('Exercise 11: Common Elements', () => {
  it('should return unique common elements by default (set intersection)', () => {
    const arr1 = [1, 2, 2, 3, 4];
    const arr2 = [2, 2, 4, 6];
    assert.deepStrictEqual(findCommonElements(arr1, arr2), [2, 4]);
  });

  it('should preserve duplicate common pairs when retainDuplicates: true', () => {
    const arr1 = [1, 2, 2, 2, 3];
    const arr2 = [2, 2, 4];
    assert.deepStrictEqual(findCommonElements(arr1, arr2, { retainDuplicates: true }), [2, 2]);
  });

  it('should return empty array when there are no common elements', () => {
    assert.deepStrictEqual(findCommonElements([1, 2, 3], [4, 5, 6]), []);
  });

  it('should handle empty arrays', () => {
    assert.deepStrictEqual(findCommonElements([], [1, 2]), []);
    assert.deepStrictEqual(findCommonElements([], []), []);
  });

  it('should throw TypeError on invalid input', () => {
    assert.throws(() => findCommonElements({}, []), TypeError);
  });
});

describe('Exercise 12: Stack (LIFO)', () => {
  it('should correctly push, peek, pop and track size', () => {
    const stack = new Stack();
    assert.strictEqual(stack.isEmpty(), true);
    assert.strictEqual(stack.size(), 0);

    stack.push(10);
    stack.push(20);
    assert.strictEqual(stack.size(), 2);
    assert.strictEqual(stack.peek(), 20);
    assert.strictEqual(stack.isEmpty(), false);

    const popped = stack.pop();
    assert.strictEqual(popped, 20);
    assert.strictEqual(stack.size(), 1);
    assert.strictEqual(stack.peek(), 10);
  });

  it('should throw RangeError on stack underflow (pop on empty)', () => {
    const stack = new Stack();
    assert.throws(() => stack.pop(), RangeError);
  });

  it('should throw RangeError on peek on empty stack', () => {
    const stack = new Stack();
    assert.throws(() => stack.peek(), RangeError);
  });

  it('should clear all items', () => {
    const stack = new Stack();
    stack.push('a');
    stack.push('b');
    stack.clear();
    assert.strictEqual(stack.size(), 0);
    assert.strictEqual(stack.isEmpty(), true);
  });

  it('should return array snapshot without leaking internal reference', () => {
    const stack = new Stack();
    stack.push(1);
    stack.push(2);
    const arr = stack.toArray();
    assert.deepStrictEqual(arr, [1, 2]);
    arr.push(99);
    assert.strictEqual(stack.size(), 2); // Internal state unpolluted
  });
});

describe('Exercise 13: Queue (FIFO)', () => {
  it('should correctly enqueue, view front, dequeue and track size', () => {
    const queue = new Queue();
    assert.strictEqual(queue.isEmpty(), true);
    assert.strictEqual(queue.size(), 0);

    queue.enqueue('first');
    queue.enqueue('second');
    assert.strictEqual(queue.size(), 2);
    assert.strictEqual(queue.front(), 'first');

    const dequeued = queue.dequeue();
    assert.strictEqual(dequeued, 'first');
    assert.strictEqual(queue.front(), 'second');
    assert.strictEqual(queue.size(), 1);
  });

  it('should throw RangeError on queue underflow (dequeue on empty)', () => {
    const queue = new Queue();
    assert.throws(() => queue.dequeue(), RangeError);
  });

  it('should throw RangeError on front on empty queue', () => {
    const queue = new Queue();
    assert.throws(() => queue.front(), RangeError);
  });

  it('should clear all items', () => {
    const queue = new Queue();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.clear();
    assert.strictEqual(queue.size(), 0);
    assert.strictEqual(queue.isEmpty(), true);
  });

  it('should compact storage cleanly over many dequeue cycles', () => {
    const queue = new Queue();
    for (let i = 0; i < 200; i++) {
      queue.enqueue(i);
    }
    for (let i = 0; i < 150; i++) {
      assert.strictEqual(queue.dequeue(), i);
    }
    assert.strictEqual(queue.size(), 50);
    assert.strictEqual(queue.front(), 150);
  });
});

describe('Exercise 14: Maximum Subarray Sum (Kadane)', () => {
  it('should find maximum subarray sum with mixed positive and negative numbers', () => {
    const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    assert.strictEqual(maxSubarraySum(arr), 6); // [4, -1, 2, 1]
  });

  it('should correctly handle all negative numbers by picking least negative', () => {
    const arr = [-5, -2, -8, -1, -9];
    assert.strictEqual(maxSubarraySum(arr), -1);
  });

  it('should handle all positive numbers by summing entire array', () => {
    const arr = [1, 2, 3, 4, 5];
    assert.strictEqual(maxSubarraySum(arr), 15);
  });

  it('should handle single-element array', () => {
    assert.strictEqual(maxSubarraySum([-42]), -42);
    assert.strictEqual(maxSubarraySum([100]), 100);
  });

  it('should throw RangeError on empty array', () => {
    assert.throws(() => maxSubarraySum([]), RangeError);
  });

  it('should throw TypeError on invalid or non-numeric arrays', () => {
    assert.throws(() => maxSubarraySum('invalid'), TypeError);
    assert.throws(() => maxSubarraySum([1, 'two', 3]), TypeError);
  });
});

describe('Exercise 15: Bubble Sort', () => {
  it('should sort unsorted array in ascending order', () => {
    const input = [64, 34, 25, 12, 22, 11, 90];
    const sorted = bubbleSort(input);
    assert.deepStrictEqual(sorted, [11, 12, 22, 25, 34, 64, 90]);
    // Ensure original array was not mutated
    assert.strictEqual(input[0], 64);
  });

  it('should handle negative numbers and zeros', () => {
    const input = [0, -5, 12, -20, 8, -1];
    assert.deepStrictEqual(bubbleSort(input), [-20, -5, -1, 0, 8, 12]);
  });

  it('should handle duplicates correctly', () => {
    const input = [5, 1, 5, 3, 1, 2];
    assert.deepStrictEqual(bubbleSort(input), [1, 1, 2, 3, 5, 5]);
  });

  it('should handle already sorted array with early exit', () => {
    const input = [1, 2, 3, 4, 5];
    assert.deepStrictEqual(bubbleSort(input), [1, 2, 3, 4, 5]);
  });

  it('should handle single-element and empty arrays', () => {
    assert.deepStrictEqual(bubbleSort([42]), [42]);
    assert.deepStrictEqual(bubbleSort([]), []);
  });

  it('should throw TypeError on invalid input or non-numeric values', () => {
    assert.throws(() => bubbleSort('not-an-array'), TypeError);
    assert.throws(() => bubbleSort([1, 2, NaN]), TypeError);
  });
});
