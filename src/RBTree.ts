/**
From https://github.com/vadimg/js_bintrees

Copyright (C) 2011 by Vadim Graboys

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

class TreeBase<T> {
  constructor(
    protected _comparator,
    protected _root = null as TreeNode<T>,
    public size = 0,
  ) { }

  // removes all nodes from the tree
  clear() {
    this._root = null;
    this.size = 0;
  }

  // returns node data if found, null otherwise
  find(data) {
    let res = this._root;

    while (res !== null) {
      const c = this._comparator(data, res.data);
      if (c === 0) {
        return res.data;
      } else {
        res = res.get_child(c > 0);
      }
    }

    return null;
  }

  // returns iterator to node if found, null otherwise
  findIter(data) {
    let res = this._root;
    const iter = this.iterator();

    while (res !== null) {
      const c = this._comparator(data, res.data);
      if (c === 0) {
        iter.cursor = res;
        return iter;
      } else {
        iter.ancestors.push(res);
        res = res.get_child(c > 0);
      }
    }

    return null;
  }

  // Returns an iterator to the tree node at or immediately after the item
  lowerBound(item) {
    let cur = this._root;
    const iter = this.iterator();
    const cmp = this._comparator;

    while (cur !== null) {
      const c = cmp(item, cur.data);
      if (c === 0) {
        iter.cursor = cur;
        return iter;
      }
      iter.ancestors.push(cur);
      cur = cur.get_child(c > 0);
    }

    for (let i = iter.ancestors.length - 1; i >= 0; --i) {
      cur = iter.ancestors[i];
      if (cmp(item, cur.data) < 0) {
        iter.cursor = cur;
        iter.ancestors.length = i;
        return iter;
      }
    }

    iter.ancestors.length = 0;
    return iter;
  }

  // Returns an iterator to the tree node immediately after the item
  upperBound(item) {
    const iter = this.lowerBound(item);
    const cmp = this._comparator;

    while (iter.data() !== null && cmp(iter.data(), item) === 0) {
      iter.next();
    }

    return iter;
  }

  // returns null if tree is empty
  min() {
    let res = this._root;
    if (res === null) {
      return null;
    }

    while (res.left !== null) {
      res = res.left;
    }

    return res.data;
  }

  // returns null if tree is empty
  max() {
    let res = this._root;
    if (res === null) {
      return null;
    }

    while (res.right !== null) {
      res = res.right;
    }

    return res.data;
  }

  // returns a null iterator
  // call next() or prev() to point to an element
  iterator() {
    return new Iterator(this);
  }

  // calls cb on each node's data, in order
  each(cb) {
    const it = this.iterator();
    let data;
    while ((data = it.next()) !== null) {
      if (cb(data) === false) {
        return;
      }
    }
  }

  // calls cb on each node's data, in reverse order
  reach(cb) {
    const it = this.iterator();
    let data;
    while ((data = it.prev()) !== null) {
      if (cb(data) === false) {
        return;
      }
    }
  }
}

class Iterator {
  public ancestors = [];
  public cursor = null;

  constructor(private _tree) {}

  data() {
    return this.cursor !== null ? this.cursor.data : null;
  }

  // if null-iterator, returns first node
  // otherwise, returns next node
  next() {
    if (this.cursor === null) {
      const root = this._tree._root;
      if (root !== null) {
        this._minNode(root);
      }
    } else {
      if (this.cursor.right === null) {
        // no greater node in subtree, go up to parent
        // if coming from a right child, continue up the stack
        let save;
        do {
          save = this.cursor;
          if (this.ancestors.length) {
            this.cursor = this.ancestors.pop();
          } else {
            this.cursor = null;
            break;
          }
        } while (this.cursor.right === save);
      } else {
        // get the next node from the subtree
        this.ancestors.push(this.cursor);
        this._minNode(this.cursor.right);
      }
    }
    return this.cursor !== null ? this.cursor.data : null;
  }

  // if null-iterator, returns last node
  // otherwise, returns previous node
  prev() {
    if (this.cursor === null) {
      const root = this._tree._root;
      if (root !== null) {
        this._maxNode(root);
      }
    } else {
      if (this.cursor.left === null) {
        let save;
        do {
          save = this.cursor;
          if (this.ancestors.length) {
            this.cursor = this.ancestors.pop();
          } else {
            this.cursor = null;
            break;
          }
        } while (this.cursor.left === save);
      } else {
        this.ancestors.push(this.cursor);
        this._maxNode(this.cursor.left);
      }
    }
    return this.cursor !== null ? this.cursor.data : null;
  }

  private _minNode(start) {
    while (start.left !== null) {
      this.ancestors.push(start);
      start = start.left;
    }
    this.cursor = start;
  }

  private _maxNode(start) {
    while (start.right !== null) {
      this.ancestors.push(start);
      start = start.right;
    }
    this.cursor = start;
  }
}

class TreeNode<T> {
  constructor(
    public data: T,
    public left: TreeNode<T> = null,
    public right: TreeNode<T> = null,
    public red = true,
  ) {}

  get_child(dir: boolean) {
    return dir ? this.right : this.left;
  }

  set_child(dir: boolean, val: TreeNode<T>) {
    if (dir) {
      this.right = val;
    } else {
      this.left = val;
    }
  }
}

export class RBTree<T> extends TreeBase<T> {
  constructor(_comparator) {
    super(_comparator);
  }

  insert(data: T) {
    let ret = false;

    if (this._root === null) {
      // empty tree
      this._root = new TreeNode(data);
      ret = true;
      this.size++;
    } else {
      const head = new TreeNode(null as T); // fake tree root

      let dir = false;
      let last = false;

      // setup
      let gp = null; // grandparent
      let ggp = head; // grand-grand-parent
      let p = null; // parent
      let node = this._root;
      ggp.right = this._root;

      // search down
      while (true) {
        if (node === null) {
          // insert new node at the bottom
          node = new TreeNode(data);
          p.set_child(dir, node);
          ret = true;
          this.size++;
        } else if (this.is_red(node.left) && this.is_red(node.right)) {
          // color flip
          node.red = true;
          node.left.red = false;
          node.right.red = false;
        }

        // fix red violation
        if (this.is_red(node) && this.is_red(p)) {
          const dir2 = ggp.right === gp;

          if (node === p.get_child(last)) {
            ggp.set_child(dir2, this.single_rotate(gp, !last));
          } else {
            ggp.set_child(dir2, this.double_rotate(gp, !last));
          }
        }

        const cmp = this._comparator(node.data, data);

        // stop if found
        if (cmp === 0) {
          break;
        }

        last = dir;
        dir = cmp < 0;

        // update helpers
        if (gp !== null) {
          ggp = gp;
        }
        gp = p;
        p = node;
        node = node.get_child(dir);
      }

      // update root
      this._root = head.right;
    }

    // make root black
    this._root.red = false;

    return ret;
  }

  // returns true if removed, false if not found
  remove(data: T): boolean {
    if (this._root === null) {
      return false;
    }

    const head = new TreeNode(null as T); // fake tree root
    let node = head;
    node.right = this._root;
    let p = null; // parent
    let gp = null; // grand parent
    let found = null; // found item
    let dir = true;

    while (node.get_child(dir) !== null) {
      const last = dir;

      // update helpers
      gp = p;
      p = node;
      node = node.get_child(dir);

      const cmp = this._comparator(data, node.data);

      dir = cmp > 0;

      // save found node
      if (cmp === 0) {
        found = node;
      }

      // push the red node down
      if (!this.is_red(node) && !this.is_red(node.get_child(dir))) {
        if (this.is_red(node.get_child(!dir))) {
          const sr = this.single_rotate(node, dir);
          p.set_child(last, sr);
          p = sr;
        } else if (!this.is_red(node.get_child(!dir))) {
          const sibling = p.get_child(!last);
          if (sibling !== null) {
            if (
              !this.is_red(sibling.get_child(!last)) &&
              !this.is_red(sibling.get_child(last))
            ) {
              // color flip
              p.red = false;
              sibling.red = true;
              node.red = true;
            } else {
              const dir2 = gp.right === p;

              if (this.is_red(sibling.get_child(last))) {
                gp.set_child(dir2, this.double_rotate(p, last));
              } else if (this.is_red(sibling.get_child(!last))) {
                gp.set_child(dir2, this.single_rotate(p, last));
              }

              // ensure correct coloring
              const gpc = gp.get_child(dir2);
              gpc.red = true;
              node.red = true;
              gpc.left.red = false;
              gpc.right.red = false;
            }
          }
        }
      }
    }

    // replace and remove if found
    if (found !== null) {
      found.data = node.data;
      p.set_child(p.right === node, node.get_child(node.left === null));
      this.size--;
    }

    // update root and make it black
    this._root = head.right;
    if (this._root !== null) {
      this._root.red = false;
    }

    return found !== null;
  }

  private is_red(node) {
    return node !== null && node.red;
  }

  private single_rotate(root, dir) {
    const save = root.get_child(!dir);

    root.set_child(!dir, save.get_child(dir));
    save.set_child(dir, root);

    root.red = true;
    save.red = false;

    return save;
  }

  private double_rotate(root, dir) {
    root.set_child(!dir, this.single_rotate(root.get_child(!dir), !dir));
    return this.single_rotate(root, dir);
  }
}
