const GRID_COLUMNS = 25
const GRID_ROWS = 15
const GRID_CELL_COUNT = GRID_COLUMNS * GRID_ROWS
const START_CELL_INDEX = 7 * GRID_COLUMNS + 5
const TARGET_CELL_INDEX = 7 * GRID_COLUMNS + 19
const WALL_CELL_INDICES = new Set(
  [3, 4, 5, 6, 8, 9, 10, 11].map((row) => row * GRID_COLUMNS + 12),
)

function getCellClassName(index) {
  if (index === START_CELL_INDEX) return 'grid-cell cell-start'
  if (index === TARGET_CELL_INDEX) return 'grid-cell cell-target'
  if (WALL_CELL_INDICES.has(index)) return 'grid-cell cell-wall'
  return 'grid-cell'
}

export default function Grid() {
  return (
    <div className="grid-panel">
      <div className="grid" aria-hidden="true">
        {Array.from({ length: GRID_CELL_COUNT }, (_, index) => (
          <div className={getCellClassName(index)} key={index} />
        ))}
      </div>
    </div>
  )
}
