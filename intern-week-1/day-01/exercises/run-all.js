/**
 * Exercise Runner: Demonstration of all 15 DSA Exercises
 *
 * Executes representative test inputs across all 15 exercises and outputs
 * structured, readable results to the terminal.
 */

const { reverseString } = require('./reverse-string');
const { isPalindrome } = require('./palindrome');
const { findLargestNumber } = require('./largest-number');
const { findSecondLargest } = require('./second-largest');
const { removeDuplicates } = require('./remove-duplicates');
const { findMissingNumber } = require('./missing-number');
const { findDuplicates } = require('./find-duplicates');
const { countCharacterFrequency } = require('./character-frequency');
const { findFirstNonRepeatingCharacter } = require('./first-non-repeating');
const { mergeSortedArrays } = require('./merge-sorted-arrays');
const { findCommonElements } = require('./common-elements');
const { Stack } = require('./stack');
const { Queue } = require('./queue');
const { maxSubarraySum } = require('./maximum-subarray-sum');
const { bubbleSort } = require('./bubble-sort');

function printHeader(title) {
  console.log(`\n======================================================================`);
  console.log(` ${title}`);
  console.log(`======================================================================`);
}

function runAll() {
  console.log('Starting Day 1: 15 Data Structures & Algorithms Demonstrations...\n');

  // Exercise 1
  printHeader('Exercise 1: Reverse String');
  const ex1Input = 'JavaScript Intern 2026';
  console.log(`Input: "${ex1Input}"`);
  console.log(`Output: "${reverseString(ex1Input)}"`);

  // Exercise 2
  printHeader('Exercise 2: Palindrome Checker');
  const ex2Inputs = ['Racecar', 'A man, a plan, a canal: Panama', 'Hello World'];
  ex2Inputs.forEach(str => {
    console.log(`Input: "${str}" -> Palindrome: ${isPalindrome(str)}`);
  });

  // Exercise 3
  printHeader('Exercise 3: Largest Number');
  const ex3Input = [14, 52, 98, -12, 45, 98, 7];
  console.log(`Input: [${ex3Input.join(', ')}]`);
  console.log(`Largest: ${findLargestNumber(ex3Input)}`);

  // Exercise 4
  printHeader('Exercise 4: Second-Largest Distinct Number');
  const ex4Inputs = [
    [10, 5, 20, 20, 8],
    [5, 5, 5],
    [-15, -3, -8, -1]
  ];
  ex4Inputs.forEach(arr => {
    console.log(`Input: [${arr.join(', ')}] -> Second Largest: ${findSecondLargest(arr)}`);
  });

  // Exercise 5
  printHeader('Exercise 5: Remove Duplicates (Preserving Order)');
  const ex5Input = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
  console.log(`Input: [${ex5Input.join(', ')}]`);
  console.log(`Deduplicated: [${removeDuplicates(ex5Input).join(', ')}]`);

  // Exercise 6
  printHeader('Exercise 6: Missing Number in Sequence 1..n');
  const ex6Input = [1, 2, 4, 5, 6, 7];
  console.log(`Input: [${ex6Input.join(', ')}] (Length: 6, Sequence: 1..7)`);
  console.log(`Missing Number: ${findMissingNumber(ex6Input)}`);

  // Exercise 7
  printHeader('Exercise 7: Find Duplicate Numbers');
  const ex7Input = [4, 3, 2, 7, 8, 2, 3, 1, 4, 4];
  console.log(`Input: [${ex7Input.join(', ')}]`);
  console.log(`Duplicates: [${findDuplicates(ex7Input).join(', ')}]`);

  // Exercise 8
  printHeader('Exercise 8: Character Frequency');
  const ex8Input = 'Engineering Excellence';
  console.log(`Input: "${ex8Input}" (case-sensitive, with spaces)`);
  console.log('Frequency Map:', countCharacterFrequency(ex8Input));

  // Exercise 9
  printHeader('Exercise 9: First Non-Repeating Character');
  const ex9Inputs = ['swiss', 'stress', 'aabbcc'];
  ex9Inputs.forEach(str => {
    console.log(`Input: "${str}" -> First Unique: ${findFirstNonRepeatingCharacter(str)}`);
  });

  // Exercise 10
  printHeader('Exercise 10: Merge Two Sorted Arrays');
  const arrA = [1, 3, 7, 12, 19];
  const arrB = [2, 4, 8, 11, 15, 22];
  console.log(`Array 1: [${arrA.join(', ')}]`);
  console.log(`Array 2: [${arrB.join(', ')}]`);
  console.log(`Merged:  [${mergeSortedArrays(arrA, arrB).join(', ')}]`);

  // Exercise 11
  printHeader('Exercise 11: Common Elements');
  const setA = [1, 2, 2, 3, 4, 5];
  const setB = [2, 4, 4, 6, 8];
  console.log(`Array 1: [${setA.join(', ')}]`);
  console.log(`Array 2: [${setB.join(', ')}]`);
  console.log(`Common (Unique Set): [${findCommonElements(setA, setB).join(', ')}]`);
  console.log(`Common (Multiset):   [${findCommonElements(setA, setB, { retainDuplicates: true }).join(', ')}]`);

  // Exercise 12
  printHeader('Exercise 12: Stack (LIFO)');
  const stack = new Stack();
  console.log(`Stack initialized. isEmpty: ${stack.isEmpty()}`);
  stack.push('Task 1');
  stack.push('Task 2');
  stack.push('Task 3');
  console.log(`Pushed 3 tasks. Size: ${stack.size()}, Peek top: "${stack.peek()}"`);
  console.log(`Popped: "${stack.pop()}"`);
  console.log(`New top: "${stack.peek()}", Current elements: [${stack.toArray().join(', ')}]`);

  // Exercise 13
  printHeader('Exercise 13: Queue (FIFO)');
  const queue = new Queue();
  console.log(`Queue initialized. isEmpty: ${queue.isEmpty()}`);
  queue.enqueue('Customer A');
  queue.enqueue('Customer B');
  queue.enqueue('Customer C');
  console.log(`Enqueued 3 customers. Size: ${queue.size()}, Front: "${queue.front()}"`);
  console.log(`Dequeued: "${queue.dequeue()}"`);
  console.log(`New front: "${queue.front()}", Current elements: [${queue.toArray().join(', ')}]`);

  // Exercise 14
  printHeader('Exercise 14: Maximum Subarray Sum (Kadane\'s Algorithm)');
  const ex14Inputs = [
    [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    [-5, -2, -8, -1, -9],
    [5, 4, -1, 7, 8]
  ];
  ex14Inputs.forEach(arr => {
    console.log(`Input: [${arr.join(', ')}] -> Max Subarray Sum: ${maxSubarraySum(arr)}`);
  });

  // Exercise 15
  printHeader('Exercise 15: Bubble Sort (Ascending)');
  const ex15Input = [64, -5, 25, 12, 22, -5, 11, 90, 0];
  console.log(`Original: [${ex15Input.join(', ')}]`);
  console.log(`Sorted:   [${bubbleSort(ex15Input).join(', ')}]`);

  printHeader('All 15 Exercises Executed Successfully!');
}

if (require.main === module) {
  runAll();
}

module.exports = { runAll };
