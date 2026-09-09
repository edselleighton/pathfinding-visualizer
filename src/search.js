import { GRID_COLUMNS, GRID_ROWS } from './grid'

export function getNeighbors(index) {
  const row = Math.floor(index / GRID_COLUMNS)
  const col = index % GRID_COLUMNS
  return [row > 0 ? index - GRID_COLUMNS : null,
    col < GRID_COLUMNS - 1 ? index + 1 : null,
    row < GRID_ROWS - 1 ? index + GRID_COLUMNS : null,
    col > 0 ? index - 1 : null].filter((cell) => cell !== null)
}

export function reconstructPath(parents, target) {
  const path = []
  for (let cell = target; cell !== null; cell = parents.get(cell)) path.push(cell)
  return path.reverse()
}

export function runSearch(board, algorithm = 'bfs') {
  if (algorithm !== 'bfs') throw new Error(`Unsupported algorithm: ${algorithm}`)
  const queue = [board.startIndex]
  const parents = new Map([[board.startIndex, null]])
  const visitedOrder = []
  for (let head = 0; head < queue.length; head += 1) {
    const cell = queue[head]
    visitedOrder.push(cell)
    if (cell === board.targetIndex) {
      const path = reconstructPath(parents, cell)
      const cost = path.slice(1).reduce((sum, index) => sum + (board.weights.has(index) ? 5 : 1), 0)
      return { visitedOrder, path, found: true, cost }
    }
    for (const next of getNeighbors(cell)) {
      if (!board.walls.has(next) && !parents.has(next)) {
        parents.set(next, cell)
        queue.push(next)
      }
    }
  }
  return { visitedOrder, path: [], found: false, cost: null }
}
