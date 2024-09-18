class ZilNumMinPriorityQueue {
  heap: number[];
  constructor() {
    this.heap = [];
  }

  enHeap(item: number) {
    const length = this.heap.length;
    let added = false;

    if (length === 0) {
      this.heap.push(item);
    } else {
      if (this.heap.includes(item)) return;

      for (let i = 0; i < length; i++) {
        if (this.heap[i] > item) {
          this.heap.splice(i, 0, item);
          added = true;
          break;
        }
      }
    }

    if (!added) this.heap.push(item);
  }

  deHeap() {
    return this.heap.shift();
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }
}

export default ZilNumMinPriorityQueue;
