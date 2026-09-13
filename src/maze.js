import { GRID_COLUMNS, GRID_ROWS, GRID_CELL_COUNT } from './grid'

export function generateMaze(board, pattern, random = Math.random) {
  if (pattern === 'none') return board
  if (!['random', 'recursive-division'].includes(pattern)) throw new Error('Unknown maze pattern')
  const walls = new Set()
  if (pattern === 'random') {
    for (let index = 0; index < GRID_CELL_COUNT; index += 1) {
      if (index !== board.startIndex && index !== board.targetIndex && random() < 0.25) walls.add(index)
    }
  } else {
    const choose = (items) => items[Math.floor(random() * items.length)]
    const positions = (from, to, parity) => {
      const result = []
      for (let n = from; n <= to; n += 1) if (n % 2 === parity) result.push(n)
      return result
    }
    function divide(left, top, right, bottom) {
      if (right - left < 2 || bottom - top < 2) return
      const horizontal = bottom - top > right - left || (bottom - top === right - left && random() < 0.5)
      if (horizontal) {
        const row = choose(positions(top + 1, bottom - 1, 1))
        const gap = choose(positions(left, right, 0))
        for (let col = left; col <= right; col += 1) if (col !== gap) walls.add(row * GRID_COLUMNS + col)
        divide(left, top, right, row - 1)
        divide(left, row + 1, right, bottom)
      } else {
        const col = choose(positions(left + 1, right - 1, 1))
        const gap = choose(positions(top, bottom, 0))
        for (let row = top; row <= bottom; row += 1) if (row !== gap) walls.add(row * GRID_COLUMNS + col)
        divide(left, top, col - 1, bottom)
        divide(col + 1, top, right, bottom)
      }
    }
    divide(0, 0, GRID_COLUMNS - 1, GRID_ROWS - 1)
  }
  walls.delete(board.startIndex)
  walls.delete(board.targetIndex)
  return { ...board, walls, weights: new Set() }
}
