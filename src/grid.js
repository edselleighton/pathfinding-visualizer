export const GRID_COLUMNS = 25
export const GRID_ROWS = 15
export const GRID_CELL_COUNT = GRID_COLUMNS * GRID_ROWS

const DEFAULT_START_INDEX = 7 * GRID_COLUMNS + 5
const DEFAULT_TARGET_INDEX = 7 * GRID_COLUMNS + 19

export function createInitialBoard() {
  return {
    startIndex: DEFAULT_START_INDEX,
    targetIndex: DEFAULT_TARGET_INDEX,
    walls: new Set(),
    weights: new Set(),
  }
}

export function getCellType(board, index) {
  if (index === board.startIndex) return 'start'
  if (index === board.targetIndex) return 'target'
  if (board.walls.has(index)) return 'wall'
  if (board.weights.has(index)) return 'weight'
  return 'empty'
}

export function applyTool(board, index, tool) {
  if (!Number.isInteger(index) || index < 0 || index >= GRID_CELL_COUNT) {
    return board
  }

  if (tool === 'start' || tool === 'target') {
    const otherEndpoint = tool === 'start' ? board.targetIndex : board.startIndex
    const currentEndpoint = tool === 'start' ? board.startIndex : board.targetIndex

    if (index === otherEndpoint || index === currentEndpoint) return board

    const walls = new Set(board.walls)
    const weights = new Set(board.weights)
    walls.delete(index)
    weights.delete(index)

    return {
      ...board,
      [tool === 'start' ? 'startIndex' : 'targetIndex']: index,
      walls,
      weights,
    }
  }

  if (index === board.startIndex || index === board.targetIndex) return board

  if (tool === 'wall') {
    const walls = new Set(board.walls)
    const weights = new Set(board.weights)

    if (walls.has(index)) {
      walls.delete(index)
    } else {
      walls.add(index)
      weights.delete(index)
    }

    return { ...board, walls, weights }
  }

  if (tool === 'weight') {
    const walls = new Set(board.walls)
    const weights = new Set(board.weights)

    if (weights.has(index)) {
      weights.delete(index)
    } else {
      weights.add(index)
      walls.delete(index)
    }

    return { ...board, walls, weights }
  }

  if (tool === 'erase') {
    if (!board.walls.has(index) && !board.weights.has(index)) return board

    const walls = new Set(board.walls)
    const weights = new Set(board.weights)
    walls.delete(index)
    weights.delete(index)
    return { ...board, walls, weights }
  }

  return board
}

// A drag stroke sets a fixed terrain state instead of toggling each crossing.
export function paintCell(board, index, tool, remove = false) {
  if (tool === 'erase' || remove) return applyTool(board, index, 'erase')
  if ((tool === 'wall' && board.walls.has(index)) || (tool === 'weight' && board.weights.has(index))) return board
  return applyTool(board, index, tool)
}
