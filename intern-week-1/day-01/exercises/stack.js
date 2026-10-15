/**
 * Exercise 12: Stack (LIFO - Last In First Out) Data Structure
 *
 * Problem Description:
 * Implements a Stack with `push`, `pop`, `peek`, `isEmpty`, and `size` operations.
 * Demonstrates Object-Oriented Programming (encapsulation via private class fields `#items`)
 * and handles stack underflow error when removing from an empty stack.
 *
 * Algorithm Explanation:
 * Elements are pushed onto the top of the stack and popped from the top of the stack.
 * The internal representation is encapsulated so external consumers cannot mutate
 * the underlying storage directly.
 * - Underflow protection: Calling `pop()` or `peek()` on an empty stack throws a descriptive Error.
 *
 * Complexity:
 * - push(item): O(1) amortized
 * - pop(): O(1)
 * - peek(): O(1)
 * - isEmpty(): O(1)
 * - size(): O(1)
 * - Space Complexity: O(n), where n is the number of stored elements.
 */
class Stack {
  /** @type {Array<any>} Private storage for stack elements */
  #items;

  constructor() {
    this.#items = [];
  }

  /**
   * Pushes a new element onto the top of the stack.
   * @param {*} element - The element to add.
   * @returns {number} The new size of the stack.
   */
  push(element) {
    if (element === undefined) {
      throw new TypeError('Cannot push undefined to the stack');
    }
    this.#items.push(element);
    return this.#items.length;
  }

  /**
   * Removes and returns the top element of the stack.
   * @returns {*} The element removed from the top.
   * @throws {RangeError} If the stack is empty (Stack Underflow).
   */
  pop() {
    if (this.isEmpty()) {
      throw new RangeError('Stack Underflow: Cannot pop from an empty stack');
    }
    return this.#items.pop();
  }

  /**
   * Returns the top element without removing it.
   * @returns {*} The top element.
   * @throws {RangeError} If the stack is empty.
   */
  peek() {
    if (this.isEmpty()) {
      throw new RangeError('Cannot peek an empty stack');
    }
    return this.#items[this.#items.length - 1];
  }

  /**
   * Checks whether the stack contains zero elements.
   * @returns {boolean} True if empty, false otherwise.
   */
  isEmpty() {
    return this.#items.length === 0;
  }

  /**
   * Returns the current number of elements in the stack.
   * @returns {number} The stack size.
   */
  size() {
    return this.#items.length;
  }

  /**
   * Clears all elements from the stack.
   */
  clear() {
    this.#items = [];
  }

  /**
   * Returns a copy of the stack elements as an array (bottom to top).
   * @returns {Array} Array copy of elements.
   */
  toArray() {
    return [...this.#items];
  }
}

module.exports = { Stack };
