class SimpleQueue<T> {
  private _head: QueueNode<T>;
  private _tail: QueueNode<T>;
  private _size: number;

  constructor() {
    this.clear();
  }

  enqueue(value: T): void {
    const node = new QueueNode<T>(value);

    if (this._head) {
      this._tail.next = node;
      this._tail = node;
    } else {
      this._head = node;
      this._tail = node;
    }

    this._size++;
  }

  dequeue(): T | null {
    const current = this._head;
    if (!current) {
      return null;
    }

    this._head = this._head.next;
    this._size--;
    return current.value;
  }

  clear() {
    this._head = undefined;
    this._tail = undefined;
    this._size = 0;
  }

  get size() {
    return this._size;
  }

  get tail() {
    return this._tail;
  }

  get head() {
    return this._head;
  }

  *[Symbol.iterator]() {
    let current = this.head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }

  toArray() {
    const results = [];
    for (const value of this) {
      results.push(value);
    }
    return results;
  }
}

class QueueNode<T> {
  constructor(public value: T, public next: QueueNode<T> = null) {}
}
