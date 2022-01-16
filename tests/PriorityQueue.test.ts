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

import PriorityQueue from '../src/PriorityQueue';

const data = [];
for (let i = 0; i < 100; i++) {
  data.push(Math.floor(100 * Math.random()));
}

const sorted = data.slice().sort((a, b) => a - b);

test('maintains a priority queue', () => {
  const queue = new PriorityQueue<number>();
  for (let i = 0; i < data.length; i++) queue.push(data[i]);

  expect(queue.peek()).toEqual(sorted[0]);

  const result = [];
  while (queue.length) result.push(queue.pop());

  expect(result).toEqual(sorted);
});

test('accepts data in constructor', () => {
  const queue = new PriorityQueue<number>(data.slice());

  const result = [];
  while (queue.length) result.push(queue.pop());

  expect(result).toEqual(sorted);
});

test('handles edge cases with few elements', () => {
  const queue = new PriorityQueue<number>();

  queue.push(2);
  queue.push(1);
  queue.pop();
  queue.pop();
  queue.pop();
  queue.push(2);
  queue.push(1);
  expect(queue.pop()).toBe(1);
  expect(queue.pop()).toBe(2);
  expect(queue.pop()).toBe(null);
});
