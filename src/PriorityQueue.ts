/**
 * https://github.com/mourner/tinyqueue
 *
 * ISC License
 * Copyright (c) 2017, Vladimir Agafonkin
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
 * THIS SOFTWARE.
 */

export default class PriorityQueue<T> {
  public length: number;

  constructor(
    private _data: T[] = [],
    private _compare: (a: T, b: T) => number = (a, b) => a < b ? -1 : 1,
  ) {
    this.length = _data.length;

    if (this.length > 0) {
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
    }
  }

  push(item: T): void {
    this._data.push(item);
    this._up(this.length++);
  }

  pop(): T | null {
    if (this.length === 0) return null;

    const top = this._data[0];
    const bottom = this._data.pop();

    if (--this.length > 0) {
      this._data[0] = bottom;
      this._down(0);
    }

    return top;
  }

  peek(): T | null {
    if (this.length === 0) return null;

    return this._data[0];
  }

  toArray(): Array<T> {
    return this._data;
  }

  private _up(pos): void {
    const {_data, _compare} = this;
    const item = _data[pos];

    while (pos > 0) {
      const parent = (pos - 1) >> 1;
      const current = _data[parent];
      if (_compare(item, current) >= 0) break;
      _data[pos] = current;
      pos = parent;
    }

    _data[pos] = item;
  }

  private _down(pos): void {
    const {_data, _compare} = this;
    const halfLength = this.length >> 1;
    const item = _data[pos];

    while (pos < halfLength) {
      let bestChild = (pos << 1) + 1; // initially it is the left child
      const right = bestChild + 1;

      if (right < this.length && _compare(_data[right], _data[bestChild]) < 0) {
        bestChild = right;
      }
      if (_compare(_data[bestChild], item) >= 0) break;

      _data[pos] = _data[bestChild];
      pos = bestChild;
    }

    _data[pos] = item;
  }
}

// TODO: Add function to print the pq. https://github.com/vovazolotoy/TypeScript-STL/blob/master/Datastructures/Heap.ts
