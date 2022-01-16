import * as _ from 'lodash';
import {load, buildTree, getInserts, newTree} from './loaderUtil';
import {RBTree} from '../src/RBTree';

const SAMPLE_FILE = __dirname + '/samples/10k';

describe('Test RBTree API', () => {
  test('clear()', () => {
    const inserts = getInserts(load(SAMPLE_FILE));
    const tree = buildTree(RBTree, inserts);
    tree.clear();
    inserts.forEach(function(data) {
      expect(tree.find(data)).toBe(null);
    });
  });

  test('dup', () => {
    const tree = newTree(RBTree);

    expect(tree.insert(100)).toBe(true);
    expect(tree.insert(101)).toBe(true);
    expect(tree.insert(101)).toBe(false);
    expect(tree.insert(100)).toBe(false);
    tree.remove(100);
    expect(tree.insert(100)).toBe(true);
    expect(tree.insert(100)).toBe(false);
  });

  test('nonexist()', () => {
    const tree = newTree(RBTree);
    expect(tree.remove(100)).toBe(false);
    tree.insert(100);
    expect(tree.remove(101)).toBe(false);
    expect(tree.remove(100)).toBe(true);
  });

  test('min()', () => {
    let tree = newTree(RBTree);
    expect(tree.min()).toEqual(null);

    const inserts = getInserts(load(SAMPLE_FILE));
    tree = buildTree(RBTree, inserts);

    expect(tree.min()).toEqual(_.min(inserts));
  });

  test('max()', () => {
    let tree = newTree(RBTree);
    expect(tree.max()).toEqual(null);

    const inserts = getInserts(load(SAMPLE_FILE));
    tree = buildTree(RBTree, inserts);

    expect(tree.max()).toEqual(_.max(inserts));
  });

  test('forwardIt()', () => {
    const inserts = getInserts(load(SAMPLE_FILE));
    const tree = buildTree(RBTree, inserts);

    let items = [];
    const it = tree.iterator();
    let data;
    while ((data = it.next()) !== null) {
      items.push(data);
    }

    inserts.sort(function(a, b) {
      return a - b;
    });

    expect(items).toEqual(inserts);

    items = [];
    tree.each(function(data) {
      items.push(data);
    });

    expect(items).toEqual(inserts);
  });

  test('forwardItBreak()', () => {
    const inserts = getInserts(load(SAMPLE_FILE));
    const tree = buildTree(RBTree, inserts);

    let items = [];
    const it = tree.iterator();
    let data;
    while ((data = it.next()) !== null) {
      items.push(data);
    }

    inserts.sort(function(a, b) {
      return a - b;
    });

    expect(items).toEqual(inserts);

    items = [];
    let i = 0;
    tree.each(function(data) {
      items.push(data);
      if (i === 3) {
        return false;
      }
      i++;
    });

    expect(items.length).toBe(4);
  });

  test('reverseIt()', () => {
    const inserts = getInserts(load(SAMPLE_FILE));
    const tree = buildTree(RBTree, inserts);

    let items = [];

    const it = tree.iterator();
    let data;
    while ((data = it.prev()) !== null) {
      items.push(data);
    }

    inserts.sort(function(a, b) {
      return b - a;
    });

    expect(items).toEqual(inserts);

    items = [];
    tree.reach(function(data) {
      items.push(data);
    });

    expect(items).toEqual(inserts);
  });

  test('reverseItBreak()', () => {
    const inserts = getInserts(load(SAMPLE_FILE));
    const tree = buildTree(RBTree, inserts);

    let items = [];

    const it = tree.iterator();
    let data;
    while ((data = it.prev()) !== null) {
      items.push(data);
    }

    inserts.sort(function(a, b) {
      return b - a;
    });

    expect(items).toEqual(inserts);

    items = [];
    let i = 0;
    tree.reach(function(data) {
      items.push(data);
      if (i === 3) {
        return false;
      }
      i++;
    });

    expect(items.length).toBe(4);
  });

  test('switchIt()', () => {
    const inserts = getInserts(load(SAMPLE_FILE));
    const tree = buildTree(RBTree, inserts);

    inserts.sort(function(a, b) {
      return a - b;
    });

    function doSwitch(after) {
      const items = [];
      const it = tree.iterator();
      for (let i = 0; i < after; i++) {
        items.push(it.next());
      }

      let data;
      while ((data = it.prev()) !== null) {
        items.push(data);
      }

      const forward = inserts.slice(0, after);
      const reverse = inserts.slice(0, after - 1).reverse();
      const all = forward.concat(reverse);

      expect(items).toEqual(all);
    }

    doSwitch(1);
    doSwitch(10);
    // doSwitch(1000);
    // doSwitch(9000);
  });

  test('emptyIt()', () => {
    const tree = newTree(RBTree);

    let it = tree.iterator();
    expect(it.next()).toBe(null);

    it = tree.iterator();
    expect(it.prev()).toBe(null);
  });

  test('lowerBound()', () => {
    const inserts = getInserts(load(SAMPLE_FILE));
    const tree = buildTree(RBTree, inserts);

    inserts.sort(function(a, b) {
      return a - b;
    });

    for (let i = 1; i < inserts.length - 1; ++i) {
      const item = inserts[i];

      const iter = tree.lowerBound(item);
      expect(iter.data()).toEqual(item);
      expect(iter.prev()).toEqual(inserts[i - 1]);
      iter.next();
      expect(iter.next()).toEqual(inserts[i + 1]);

      const prev = tree.lowerBound(item - 0.1);
      expect(prev.data()).toEqual(inserts[i]);

      const next = tree.lowerBound(item + 0.1);
      expect(next.data()).toEqual(inserts[i + 1]);
    }

    // test edges
    let iter = tree.lowerBound(-1);
    expect(iter.data()).toEqual(inserts[0]);
    const last = inserts[inserts.length - 1];
    iter = tree.lowerBound(last);
    expect(iter.data()).toEqual(last);
    iter = tree.lowerBound(last + 1);
    expect(iter.data()).toEqual(null);
  });

  test('upperBound()', () => {
    const inserts = getInserts(load(SAMPLE_FILE));
    const tree = buildTree(RBTree, inserts);

    inserts.sort(function(a, b) {
      return a - b;
    });

    for (let i = 0; i < inserts.length - 2; ++i) {
      const item = inserts[i];

      const iter = tree.upperBound(item);
      expect(iter.data()).toEqual(inserts[i + 1]);
      expect(iter.prev()).toEqual(inserts[i]);
      iter.next();
      expect(iter.next()).toEqual(inserts[i + 2]);

      const prev = tree.upperBound(item - 0.1);
      expect(prev.data()).toEqual(inserts[i]);

      const next = tree.upperBound(item + 0.1);
      expect(next.data()).toEqual(inserts[i + 1]);
    }

    // test edges
    let iter = tree.upperBound(-1);
    expect(iter.data()).toEqual(inserts[0]);
    const last = inserts[inserts.length - 1];
    iter = tree.upperBound(last);
    expect(iter.data()).toEqual(null);
    iter = tree.upperBound(last + 1);
    expect(iter.data()).toEqual(null);

    // test empty
    const empty = new RBTree(function(a, b) {
      return a.val - b.val;
    });
    iter = empty.upperBound({val: 0});
    expect(iter.data()).toEqual(null);
  });

  test('find', () => {
    const inserts = getInserts(load(SAMPLE_FILE));
    const tree = buildTree(RBTree, inserts);

    for (let i = 1; i < inserts.length - 1; ++i) {
      const item = inserts[i];

      expect(tree.find(item)).toEqual(item);
      expect(tree.find(item + 0.1)).toEqual(null);
    }
  });

  test('findIter()', () => {
    const inserts = getInserts(load(SAMPLE_FILE));
    const tree = buildTree(RBTree, inserts);

    inserts.sort(function(a, b) {
      return a - b;
    });

    for (let i = 1; i < inserts.length - 1; ++i) {
      const item = inserts[i];

      const iter = tree.findIter(item);
      expect(iter.data()).toEqual(item);
      expect(iter.prev()).toEqual(inserts[i - 1]);
      iter.next();
      expect(iter.next()).toEqual(inserts[i + 1]);

      expect(tree.findIter(item + 0.1)).toEqual(null);
    }
  });
});

describe('Test RBTree Correctness', () => {
  test('Correctness Validation', () => {
    const tree = newTree(RBTree);
    const tests = load(SAMPLE_FILE);

    let elems = 0;
    tests.forEach(function(n) {
      if (n > 0) {
        // insert
        expect(tree.insert(n)).toBe(true);
        expect(tree.find(n)).toBe(n);
        elems++;
      } else {
        // remove
        n = -n;
        expect(tree.remove(n)).toBe(true);
        expect(tree.find(n)).toBe(null);
        elems--;
      }
      expect(tree.size).toEqual(elems);
      expect(rbAssert(tree._root, tree._comparator));
    });
  });
});

function isRed(node) {
  return node !== null && node.red;
}

function rbAssert(root, comparator) {
  if (root === null) {
    return 1;
  } else {
    const ln = root.left;
    const rn = root.right;

    // red violation
    if (isRed(root)) {
      expect(isRed(ln) || isRed(rn)).toBe(false);
    }

    const lh = rbAssert(ln, comparator);
    const rh = rbAssert(rn, comparator);

    // invalid binary search tree
    expect((ln !== null && comparator(ln.data, root.data) >= 0) ||
      (rn !== null && comparator(rn.data, root.data) <= 0)).toBe(false);

    // black height mismatch
    expect(lh !== 0 && rh !== 0 && lh !== rh).toBe(false);

    // count black links
    if (lh !== 0 && rh !== 0) {
      return isRed(root) ? lh : lh + 1;
    } else {
      return 0;
    }
  }
}
