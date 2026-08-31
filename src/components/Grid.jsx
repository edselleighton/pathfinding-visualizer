import { GRID_CELL_COUNT, GRID_COLUMNS, getCellType } from '../grid'

function getCellClassName(board, index) {
  const cellType = getCellType(board, index)
  return cellType === 'empty' ? 'grid-cell' : `grid-cell cell-${cellType}`
}

function getCellLabel(board, index) {
  const row = Math.floor(index / GRID_COLUMNS) + 1
  const column = (index % GRID_COLUMNS) + 1
  return `Row ${row}, column ${column}: ${getCellType(board, index)}`
}

export default function Grid({ board, onCellClick }) {
  return (
    <div className="grid-panel">
      <div className="grid" role="group" aria-label="Pathfinding grid">
        {Array.from({ length: GRID_CELL_COUNT }, (_, index) => (
          <button
            type="button"
            className={getCellClassName(board, index)}
            aria-label={getCellLabel(board, index)}
            onClick={() => onCellClick(index)}
            key={index}
          />
        ))}
      </div>
    </div>
  )
}
