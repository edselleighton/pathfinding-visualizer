import { expect, it } from 'vitest'
import { createInitialBoard, GRID_CELL_COUNT, paintCell } from './grid'
import { generateMaze } from './maze'

it('generates random walls with the specified threshold and preserves endpoints', () => {
  const board = { ...createInitialBoard(), weights: new Set([0]), walls: new Set([2]) }
  const before = structuredClone(board)
  expect(generateMaze(board, 'random', () => 0.249).walls.size).toBe(GRID_CELL_COUNT - 2)
  const empty = generateMaze(board, 'random', () => 0.25)
  expect(empty.walls.size).toBe(0)
  expect(empty.weights.size).toBe(0)
  expect(empty.startIndex).toBe(board.startIndex)
  expect(empty.targetIndex).toBe(board.targetIndex)
  expect(board).toEqual(before)
})

it('builds reproducible recursive divisions with passages and valid terrain', () => {
  for (const value of [0, 0.25, 0.5, 0.99]) {
    const board = createInitialBoard()
    const result = generateMaze(board, 'recursive-division', () => value)
    expect(result).toEqual(generateMaze(board, 'recursive-division', () => value))
    expect(result.walls.size).toBeGreaterThan(50)
    expect(result.walls.size).toBeLessThan(GRID_CELL_COUNT - 2)
    expect(result.walls.has(board.startIndex)).toBe(false)
    expect(result.walls.has(board.targetIndex)).toBe(false)
    expect([...result.walls].every((index) => Number.isInteger(index) && index >= 0 && index < GRID_CELL_COUNT)).toBe(true)
  }
})

it('does nothing for None and rejects unknown maze patterns', () => {
  const board = createInitialBoard()
  expect(generateMaze(board, 'none')).toBe(board)
  expect(() => generateMaze(board, 'unknown')).toThrow('Unknown maze')
})

it('paints idempotently, erases consistently and protects endpoints', () => {
  const original = createInitialBoard()
  const wall = paintCell(original, 0, 'wall')
  expect(paintCell(wall, 0, 'wall')).toBe(wall)
  const weight = paintCell(wall, 0, 'weight')
  expect(weight.walls.has(0)).toBe(false)
  expect(weight.weights.has(0)).toBe(true)
  expect(paintCell(weight, 0, 'wall', true).weights.size).toBe(0)
  expect(paintCell(original, original.startIndex, 'wall')).toBe(original)
})
