export class DoubleEndedQueue<T> {
  private linkedList = new DoublyLinkedList<T>();

  public addLast(value: T) {
    return this.linkedList.push(value);
  }

  public addFront(value: T) {
    return this.linkedList.unshift(value);
  }

  public removeLast(): T | null {
    return this.linkedList.pop();
  }

  public removeFront(): T | null {
    return this.linkedList.shift();
  }

  public front(): T | null {
    return this.linkedList.bottom();
  }

  public last(): T | null {
    return this.linkedList.top();
  }

  get size(): number {
    return this.linkedList.count();
  }

  public toString(): string {
    return '{' + this.linkedList.toArray().join('->') + '}';
  }
}

/**
 * The DoublyLinkedList class provides
 * the main functionality of a doubly linked list.
 *
 * @class DoublyLinkedList
 */
class DoublyLinkedList<T> {
  /**
   * Count of elements in list
   *
   * @property _length
   * @type number
   * @private
   */
  private _length = 0;

  /**
   * Iteration pointer
   *
   * @property _key
   * @type number
   * @private
   */
  private _key = 0;

  /**
   * Reference to head(first) element in list
   *
   * @property _head
   * @type DoublyLinkedListNode
   * @private
   */
  private _head: DoublyLinkedListNode<T> = null;

  /**
   * Reference to tail(last) element in list
   *
   * @property _tail
   * @type DoublyLinkedListNode
   * @private
   */
  private _tail: DoublyLinkedListNode<T> = null;

  /**
   * Reference to iterated element in list
   *
   * @property _current
   * @type DoublyLinkedListNode
   * @private
   */
  private _current: DoublyLinkedListNode<T> = null;

  /**
   * Insert a new value at the specified index
   *
   * @method add
   * @param index The index where the new value is to be inserted.
   * @param value The new value for the index.
   * @return void
   */
  public add(index: number, value: T): void {
    if (index < 0 || index >= this._length) {
      throw new Error('Out of bounds');
    }

    let i = 0;
    let current = this._head;
    while (i < index) {
      current = current.next;
      i++;
    }

    current.value = value;
  }

  /**
   * Pops a node from the end of the doubly linked list
   *
   * @method pop
   * @return T  The value of the popped node.
   */
  public pop(): T {
    if (this._length === 0) {
      throw new Error(`Can't pop from an empty data structure`);
    }

    const value = this._tail.value;

    this._tail = this._tail.prev;
    if (this._tail) {
      delete this._tail.next;
      this._tail.next = null;
    }

    this._length--;

    if (this._length === 0) {
      delete this._head;
      this._head = null;
    }

    return value;
  }

  /**
   * Shifts a node from the beginning of the doubly linked list
   *
   * @method shift
   * @return T  The value of the shifted node.
   */
  public shift(): T {
    if (this._length === 0) {
      throw new Error(`Can't shift from an empty data structure`);
    }

    const value = this._head.value;

    this._head = this._head.next;
    if (this._head) {
      delete this._head.prev;
      this._head.prev = null;
    }

    this._length--;

    return value;
  }

  /**
   * Pushes an element at the end of the doubly linked list
   *
   * @method push
   * @param value The value to push.
   * @return void
   */
  public push(value: T): void {
    // allocate new node
    const node: DoublyLinkedListNode<T> = {
      value: value,
      prev: this._tail,
      next: null,
    };

    if (this._length === 0) {
      this._head = this._tail = node;
    } else {
      this._tail.next = node;
      this._tail = this._tail.next;
    }

    this._length++;
  }

  /**
   * Prepends the doubly linked list with an element
   *
   * @method unshift
   * @param value The value to unshift.
   * @return void
   */
  public unshift(value: T): void {
    // allocate new node
    const node: DoublyLinkedListNode<T> = {
      value: value,
      prev: null,
      next: this._head,
    };

    if (this._length === 0) {
      this._head = this._tail = node;
    } else {
      this._head.prev = node;
      this._head = this._head.prev;
    }

    this._length++;
  }

  /**
   * Peeks at the node from the end of the doubly linked list
   *
   * @method top
   * @return T  The value of the last node.
   */
  public top(): T {
    if (this._tail) return this._tail.value;
  }

  /**
   * Peeks at the node from the beginning of the doubly linked list
   *
   * @method bottom
   * @return T  The value of the first node.
   */
  public bottom(): T {
    if (this._head) return this._head.value;
  }

  /**
   * Counts the number of elements in the doubly linked list
   *
   * @method count
   * @return number the number of elements in the doubly linked list.
   */
  public count(): number {
    return this._length;
  }

  /**
   * Checks whether the doubly linked list is empty
   *
   * @method isEmpty
   * @return boolean whether the doubly linked list is empty.
   */
  public isEmpty(): boolean {
    return this._length === 0;
  }

  /**
   * Rewind iterator back to the start
   *
   * @method rewind
   * @return void
   */
  public rewind(): void {
    this._key = 0;
    this._current = this._head;
  }

  /**
   * Return current list entry
   *
   * @method current
   * @return T  The current node value.
   */
  public current(): T {
    if (this._current) {
      return this._current.value;
    }
    return null;
  }

  /**
   * Return current node index
   *
   * @method key
   * @return T  The current node index.
   */
  public key(): number {
    return this._key;
  }

  /**
   * Move to next entry
   *
   * @method next
   * @return void
   */
  public next(): void {
    this._current = this._current.next;
    this._key++;
  }

  /**
   * Move to previous entry
   *
   * @method prev
   * @return void
   */
  public prev(): void {
    this._current = this._current.prev;
    this._key--;
  }

  /**
   * Check whether the doubly linked list contains more nodes
   *
   * @method valid
   * @return boolean true if the doubly linked
   * list contains T more nodes, false otherwise.
   */
  public valid(): boolean {
    return this._key >= 0 && this._key < this._length;
  }

  /**
   * Export the list to array
   *
   * @method toArray
   * @return Array   The exported array
   */
  public toArray(): Array<T> {
    const list = [];
    let current = this._head;
    while (current) {
      list.push(current.value);
      current = current.next;
    }
    return list;
  }

  /**
   * Serializes the list to string
   *
   * @method toString
   * @return string   The serialized string.
   */
  public toString(): string {
    return '{' + this.toArray().join('->') + '}';
  }
}

/**
 * DoublyLinkedList element
 * @interface
 */
interface DoublyLinkedListNode<T> {
  value: T;
  prev: DoublyLinkedListNode<T>;
  next: DoublyLinkedListNode<T>;
}
