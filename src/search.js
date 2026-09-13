import { GRID_COLUMNS, GRID_ROWS } from './grid'
import PriorityQueue from './priorityQueue'

export const ALGORITHMS = {
  bfs: { name: 'Breadth-first search', description: 'Explores in layers and finds the fewest moves. Ignores weights when choosing a route.' },
  dfs: { name: 'Depth-first search', description: 'Explores one branch deeply before backtracking. Ignores weights and does not guarantee a shortest route.' },
  dijkstra: { name: 'Dijkstra', description: 'Explores the lowest accumulated cost first. Considers weights and guarantees a minimum-cost route.' },
  astar: { name: 'A* search', description: 'Combines accumulated cost with Manhattan distance to the target. Considers weights and guarantees a minimum-cost route.' },
  greedy: { name: 'Greedy best-first search', description: 'Explores the cell closest to the target by Manhattan distance. Ignores accumulated cost and weights; a shortest route is not guaranteed.' },
}

const entryCost = (board, cell) => board.weights.has(cell) ? 5 : 1
const distance = (a, b) => Math.abs(Math.floor(a / GRID_COLUMNS) - Math.floor(b / GRID_COLUMNS)) + Math.abs(a % GRID_COLUMNS - b % GRID_COLUMNS)

function success(board, parents, visitedOrder) {
  const path = reconstructPath(parents, board.targetIndex)
  return { visitedOrder, path, found: true, cost: path.slice(1).reduce((sum, cell) => sum + entryCost(board, cell), 0) }
}

function prioritySearch(board, algorithm) {
  const frontier = new PriorityQueue()
  const parents = new Map([[board.startIndex, null]])
  const costs = new Map([[board.startIndex, 0]])
  const closed = new Set()
  const visitedOrder = []
  frontier.push(board.startIndex, 0)
  while (frontier.size) {
    const cell = frontier.pop()
    if (closed.has(cell)) continue
    closed.add(cell)
    visitedOrder.push(cell)
    if (cell === board.targetIndex) return success(board, parents, visitedOrder)
    for (const next of getNeighbors(cell)) {
      if (board.walls.has(next) || closed.has(next)) continue
      const cost = costs.get(cell) + entryCost(board, next)
      if (algorithm === 'greedy' ? parents.has(next) : cost >= (costs.get(next) ?? Infinity)) continue
      parents.set(next, cell)
      costs.set(next, cost)
      const heuristic = distance(next, board.targetIndex)
      frontier.push(next, algorithm === 'greedy' ? heuristic : cost + (algorithm === 'astar' ? heuristic : 0))
    }
  }
  return { visitedOrder, path: [], found: false, cost: null }
}

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
  if (!Object.hasOwn(ALGORITHMS, algorithm)) throw new Error(`Unsupported algorithm: ${algorithm}`)
  if (['dijkstra', 'astar', 'greedy'].includes(algorithm)) return prioritySearch(board, algorithm)
  const queue = [board.startIndex]
  const parents = new Map([[board.startIndex, null]])
  const visitedOrder = []
  let head = 0
  while (algorithm === 'dfs' ? queue.length > 0 : head < queue.length) {
    const cell = algorithm === 'dfs' ? queue.pop() : queue[head++]
    visitedOrder.push(cell)
    if (cell === board.targetIndex) {
      return success(board, parents, visitedOrder)
    }
    const neighbors = getNeighbors(cell)
    // Push in reverse order so the stack processes up/right/down/left.
    for (const next of algorithm === 'dfs' ? neighbors.reverse() : neighbors) {
      if (!board.walls.has(next) && !parents.has(next)) {
        parents.set(next, cell)
        queue.push(next)
      }
    }
  }
  return { visitedOrder, path: [], found: false, cost: null }
}
