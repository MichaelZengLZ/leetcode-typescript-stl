import * as fs from 'fs';
import _ from 'underscore';

export function load(filename) {
  const ret: number[] = [];
  const nums: string[] = fs.readFileSync(filename, 'ascii').split('\n');
  nums.forEach(function(s) {
    if (s.length) {
      const n = parseInt(s, 10);
      ret.push(n);
    }
  });

  return ret;
}

export function getInserts(tests) {
  return _.select(tests, function(n) {
    return n > 0;
  });
}

export function getRemoves(tests) {
  return _.select(tests, function(n) {
    return n < 0;
  });
}

export function newTree(TreeType) {
  return new TreeType(function(a, b) {
    return a - b;
  });
}

export function buildTree(treeType, inserts) {
  const tree = newTree(treeType);

  inserts.forEach(function(n) {
    tree.insert(n);
  });

  return tree;
}

export function loadTree(treeType, filename) {
  const tests = load(filename);
  const inserts = getInserts(tests);
  return buildTree(treeType, inserts);
}

// module.exports = {
//   load: load,
//   get_removes: getRemoves,
//   new_tree: newTree,
//   load_tree: loadTree,
// };
