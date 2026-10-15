/**
 * Exercise 13: Queue (FIFO - First In First Out) Data Structure
 *
 * Problem Description:
 * Implements a Queue with `enqueue`, `dequeue`, `front`, `isEmpty`, and `size` operations.
 * Demonstrates Object-Oriented encapsulation via private class fields `#items` and `#headIndex`.
 * Safely handles Queue Underflow when attempting to dequeue or view front on an empty queue.
 *
 * Algorithm Explanation:
 * Elements enter at the back (enqueue) and leave from the front (dequeue).
 * To achieve true O(1) amortized dequeue time without the O(n) performance penalty
 * of standard Array.prototype.shift(), we maintain a private `#headIndex` pointer.
 * Storage is periodically compacted when the number of freed slots exceeds a threshold.
 *
 * Complexity:
 * - enqueue(item): O(1)
 * - dequeue(): O(1) amortized
 * - front(): O(1)
 * - isEmpty(): O(1)
 * - size(): O(1)
 * - Space Complexity: O(n), where n is the number of active elements.
 */
class Queue {
  /** @type {Array<any>} Internal storage */
  #items;
  /** @type {number} Index pointing to the front element */
  #headIndex;

  constructor() {
    this.#items = [];
    this.#headIndex = 0;
  }

  /**
   * Adds an element to the back of the queue.
   * @param {*} element - The element to enqueue.
   * @returns {number} The updated size of the queue.
   */
  enqueue(element) {
    if (element === undefined) {
      throw new TypeError('Cannot enqueue undefined to the queue');
    }
    this.#items.push(element);
    return this.size();
  }

  /**
   * Removes and returns the front element of the queue.
   * @returns {*} The front element.
   * @throws {RangeError} If the queue is empty (Queue Underflow).
   */
  dequeue() {
    if (this.isEmpty()) {
      throw new RangeError('Queue Underflow: Cannot dequeue from an empty queue');
    }

    const item = this.#items[this.#headIndex];
    this.#items[this.#headIndex] = null; // Help garbage collection
    this.#headIndex++;

    // Compact storage when uncompacted space exceeds 100 items and half the array
    if (this.#headIndex > 100 && this.#headIndex * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#headIndex);
      this.#headIndex = 0;
    }

    return item;
  }

  /**
   * Returns the front element without removing it.
   * @returns {*} The front element.
   * @throws {RangeError} If the queue is empty.
   */
  front() {
    if (this.isEmpty()) {
      throw new RangeError('Cannot view front of an empty queue');
    }
    return this.#items[this.#headIndex];
  }

  /**
   * Checks whether the queue contains zero elements.
   * @returns {boolean} True if empty, false otherwise.
   */
  isEmpty() {
    return this.size() === 0;
  }

  /**
   * Returns the count of active elements in the queue.
   * @returns {number} Number of elements.
   */
  size() {
    return this.#items.length - this.#headIndex;
  }

  /**
   * Resets the queue to an empty state.
   */
  clear() {
    this.#items = [];
    this.#headIndex = 0;
  }

  /**
   * Returns an array representation of active queue elements in FIFO order.
   * @returns {Array} Array of elements from front to back.
   */
  toArray() {
    return this.#items.slice(this.#headIndex);
  }
}

module.exports = { Queue };
