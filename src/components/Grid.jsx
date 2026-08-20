const GRID_CELL_COUNT = 25 * 15

export default function Grid() {
  return (
    <div className="grid-panel">
      <div className="grid" aria-hidden="true">
        {Array.from({ length: GRID_CELL_COUNT }, (_, index) => (
          <div className="grid-cell" key={index} />
        ))}
      </div>
    </div>
  )
}
