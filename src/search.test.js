import { describe, expect, it } from 'vitest'
import { applyTool, createInitialBoard, GRID_CELL_COUNT } from './grid'
import { getNeighbors, runSearch } from './search'

describe('BFS', () => {
  it('finds the shortest empty-board route without mutating terrain', () => {
    const board = createInitialBoard()
    const before = structuredClone(board)
    const result = runSearch(board)
    expect(result.found).toBe(true)
    expect(result.path).toEqual(Array.from({ length: 15 }, (_, i) => 180 + i))
    expect(result.cost).toBe(14)
    expect(new Set(result.visitedOrder).size).toBe(result.visitedOrder.length)
    expect(board).toEqual(before)
  })
  it('routes around walls through adjacent cells', () => {
    const board = { startIndex: 0, targetIndex: 2, walls: new Set([1]), weights: new Set() }
    const result = runSearch(board)
    expect(result.path).toEqual([0, 25, 26, 27, 2])
    expect(result.cost).toBe(4)
    expect(result.visitedOrder).not.toContain(1)
  })
  it('handles blocked targets and isolated starts', () => {
    const board = { startIndex: 0, targetIndex: 26, walls: new Set([1, 25, 27, 51]), weights: new Set() }
    expect(runSearch(board)).toEqual({ visitedOrder: [0], path: [], found: false, cost: null })
  })
  it('visits an adjacent target and includes both endpoints', () => {
    const result = runSearch({ startIndex: 0, targetIndex: 1, walls: new Set(), weights: new Set() })
    expect(result).toEqual({ visitedOrder: [0, 1], path: [0, 1], found: true, cost: 1 })
  })
  it('never wraps across rows or leaves grid bounds', () => {
    expect(getNeighbors(0)).toEqual([1, 25])
    expect(getNeighbors(24)).toEqual([49, 23])
    expect(getNeighbors(GRID_CELL_COUNT - 1)).toEqual([349, 373])
  })
  it('selects fewest moves even when a longer route costs less', () => {
    const board = { startIndex: 0, targetIndex: 2, walls: new Set(), weights: new Set([1]) }
    expect(runSearch(board).path).toEqual([0, 1, 2])
    expect(runSearch(board).cost).toBe(6)
    expect(runSearch(board)).toEqual(runSearch(board))
  })
  it('rejects unsupported algorithms', () => {
    expect(() => runSearch(createInitialBoard(), 'unknown')).toThrow('Unsupported algorithm')
  })
})

describe('board editing', () => {
  it('protects endpoints and rejects out-of-range indexes', () => {
    const board = createInitialBoard()
    for (const index of [-1, GRID_CELL_COUNT, 1.5, board.startIndex, board.targetIndex]) {
      expect(applyTool(board, index, 'wall')).toBe(board)
    }
    expect(applyTool(board, board.targetIndex, 'start')).toBe(board)
  })
  it('keeps weights and walls exclusive, supports erase and endpoint moves', () => {
    const original = createInitialBoard()
    let board = applyTool(original, 0, 'wall')
    board = applyTool(board, 0, 'weight')
    expect(board.walls.has(0)).toBe(false)
    expect(board.weights.has(0)).toBe(true)
    expect(applyTool(board, 0, 'erase').weights.size).toBe(0)
    board = applyTool(board, 0, 'start')
    expect(board.startIndex).toBe(0)
    expect(board.weights.size).toBe(0)
    expect(original.startIndex).toBe(180)
    expect(original.walls.size).toBe(0)
  })
})
