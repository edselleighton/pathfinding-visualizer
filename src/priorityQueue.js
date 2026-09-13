// Binary min-heap; insertion order resolves equal priorities deterministically.
export default class PriorityQueue {
  items = []
  sequence = 0

  get size() { return this.items.length }

  before(a, b) {
    return a.priority < b.priority || (a.priority === b.priority && a.order < b.order)
  }

  push(value, priority) {
    const item = { value, priority, order: this.sequence++ }
    this.items.push(item)
    let index = this.items.length - 1
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      if (!this.before(item, this.items[parent])) break
      this.items[index] = this.items[parent]
      index = parent
    }
    this.items[index] = item
  }

  pop() {
    if (!this.size) return undefined
    const first = this.items[0]
    const last = this.items.pop()
    if (this.size) {
      let index = 0
      while (index * 2 + 1 < this.size) {
        let child = index * 2 + 1
        if (child + 1 < this.size && this.before(this.items[child + 1], this.items[child])) child += 1
        if (!this.before(this.items[child], last)) break
        this.items[index] = this.items[child]
        index = child
      }
      this.items[index] = last
    }
    return first.value
  }
}
