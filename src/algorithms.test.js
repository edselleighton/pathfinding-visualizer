import { describe, expect, it } from 'vitest'
import { ALGORITHMS, getNeighbors, runSearch } from './search'
import { GRID_CELL_COUNT, createInitialBoard } from './grid'
import PriorityQueue from './priorityQueue'

const algorithms = Object.keys(ALGORITHMS)
const validatePath = (board, result) => {
  expect(result.found).toBe(true)
  expect(result.path[0]).toBe(board.startIndex)
  expect(result.path.at(-1)).toBe(board.targetIndex)
  expect(new Set(result.visitedOrder).size).toBe(result.visitedOrder.length)
  for (let i = 1; i < result.path.length; i += 1) {
    expect(getNeighbors(result.path[i - 1])).toContain(result.path[i])
    expect(board.walls.has(result.path[i])).toBe(false)
  }
  expect(result.cost).toBe(result.path.slice(1).reduce((sum, cell) => sum + (board.weights.has(cell) ? 5 : 1), 0))
}

describe.each(algorithms)('%s', (algorithm) => {
  it('finds valid routes through obstacles without changing the board', () => {
    const board = { ...createInitialBoard(), walls: new Set([181, 182, 183]), weights: new Set([155, 156]) }
    const before = structuredClone(board)
    const result = runSearch(board, algorithm)
    validatePath(board, result)
    expect(board).toEqual(before)
    expect(runSearch(board, algorithm)).toEqual(result)
  })
  it('terminates when unreachable and handles adjacent endpoints', () => {
    const board = { startIndex: 0, targetIndex: 1, walls: new Set(), weights: new Set() }
    validatePath(board, runSearch(board, algorithm))
    board.walls = new Set([1, 25])
    board.targetIndex = 2
    expect(runSearch(board, algorithm)).toEqual({ visitedOrder: [0], path: [], found: false, cost: null })
  })
})

it.each(['dijkstra', 'astar'])('%s finds the longer but cheaper route', (algorithm) => {
  const board = { startIndex: 0, targetIndex: 2, walls: new Set(), weights: new Set([1]) }
  const result = runSearch(board, algorithm)
  expect(result.cost).toBe(4)
  expect(result.path).toEqual([0, 25, 26, 27, 2])
  expect(runSearch(board, 'bfs').cost).toBe(6)
})

it('matches an independent relaxation oracle on varied weighted boards', () => {
  // Deliberately use repeated full-edge relaxation instead of the implementation's heap.
  for (let seed = 1; seed <= 8; seed += 1) {
    const board = createInitialBoard()
    let state = seed
    for (let i = 0; i < GRID_CELL_COUNT; i += 1) {
      state = (state * 1664525 + 1013904223) >>> 0
      if ([board.startIndex, board.targetIndex].includes(i)) continue
      if (state % 7 === 0) board.walls.add(i)
      else if (state % 3 === 0) board.weights.add(i)
    }
    const distances = Array(GRID_CELL_COUNT).fill(Infinity)
    distances[board.startIndex] = 0
    for (let pass = 0; pass < GRID_CELL_COUNT; pass += 1) {
      let changed = false
      for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
        if (board.walls.has(cell) || distances[cell] === Infinity) continue
        for (const next of getNeighbors(cell)) {
          const candidate = distances[cell] + (board.weights.has(next) ? 5 : 1)
          if (!board.walls.has(next) && candidate < distances[next]) { distances[next] = candidate; changed = true }
        }
      }
      if (!changed) break
    }
    const expected = distances[board.targetIndex] === Infinity ? null : distances[board.targetIndex]
    for (const algorithm of ['dijkstra', 'astar']) expect(runSearch(board, algorithm).cost).toBe(expected)
  }
})

it('pops stable priorities across interleaved heap operations', () => {
  const queue = new PriorityQueue()
  queue.push('last', 10); queue.push('first tie', 1); queue.push('second tie', 1)
  expect(queue.pop()).toBe('first tie')
  queue.push('urgent', 0)
  expect([queue.pop(), queue.pop(), queue.pop(), queue.pop()]).toEqual(['urgent', 'second tie', 'last', undefined])
})
