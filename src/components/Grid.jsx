const GRID_COLUMNS = 25
const GRID_ROWS = 15
const GRID_CELL_COUNT = GRID_COLUMNS * GRID_ROWS
const START_CELL_INDEX = 7 * GRID_COLUMNS + 5
const TARGET_CELL_INDEX = 7 * GRID_COLUMNS + 19

function getCellClassName(index) {
  if (index === START_CELL_INDEX) return 'grid-cell cell-start'
  if (index === TARGET_CELL_INDEX) return 'grid-cell cell-target'
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
