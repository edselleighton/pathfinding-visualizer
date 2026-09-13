import { useEffect, useRef, useState } from 'react'
import { GRID_CELL_COUNT, GRID_COLUMNS, getCellType } from '../grid'

function getCellClassName(board, index, playback) {
  const cellType = getCellType(board, index)
  if (cellType !== 'start' && cellType !== 'target') {
    if (playback.path.has(index)) return 'grid-cell cell-path'
    if (playback.visited.has(index)) return 'grid-cell cell-visited'
  }
  return cellType === 'empty' ? 'grid-cell' : `grid-cell cell-${cellType}`
}

function getCellLabel(board, index) {
  const row = Math.floor(index / GRID_COLUMNS) + 1
  const column = (index % GRID_COLUMNS) + 1
  return `Row ${row}, column ${column}: ${getCellType(board, index)}`
}

export default function Grid({ board, onCellClick, playback, selectedTool, onPaint }) {
  const [focused, setFocused] = useState(board.startIndex)
  const cells = useRef([])
  const stroke = useRef(null)
  const suppressClick = useRef(false)

  useEffect(() => {
    const end = () => { stroke.current = null }
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    window.addEventListener('blur', end)
    return () => {
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
      window.removeEventListener('blur', end)
    }
  }, [])

  useEffect(() => { stroke.current = null }, [selectedTool, playback.locked])

  function begin(event, index) {
    suppressClick.current = false
    if (playback.locked || event.button !== 0 || event.pointerType === 'touch' || !['wall', 'weight', 'erase'].includes(selectedTool)) return
    event.preventDefault()
    // Pen input can implicitly capture the pointer, which would hide cell enters.
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    cells.current[index]?.focus()
    const remove = selectedTool === 'wall' ? board.walls.has(index) : selectedTool === 'weight' && board.weights.has(index)
    stroke.current = { pointerId: event.pointerId, tool: selectedTool, remove, visited: new Set([index]) }
    suppressClick.current = true
    onPaint(index, selectedTool, remove)
  }

  function enter(event, index) {
    const current = stroke.current
    if (!current || current.pointerId !== event.pointerId || playback.locked) return
    if (!(event.buttons & 1)) { stroke.current = null; return }
    if (current.visited.has(index)) return
    current.visited.add(index)
    onPaint(index, current.tool, current.remove)
  }

  function navigate(event, index) {
    let next = index
    if (event.key === 'ArrowUp') next = index >= GRID_COLUMNS ? index - GRID_COLUMNS : index
    else if (event.key === 'ArrowDown') next = index < GRID_CELL_COUNT - GRID_COLUMNS ? index + GRID_COLUMNS : index
    else if (event.key === 'ArrowLeft' && index % GRID_COLUMNS > 0) next = index - 1
    else if (event.key === 'ArrowRight' && index % GRID_COLUMNS < GRID_COLUMNS - 1) next = index + 1
    else if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    cells.current[next]?.focus()
  }

  return (
    <div className="grid-panel">
      <div className="grid" role="group" aria-label="Pathfinding grid">
        {Array.from({ length: GRID_CELL_COUNT }, (_, index) => (
          <button
            type="button"
            className={getCellClassName(board, index, playback)}
            aria-label={`${getCellLabel(board, index)}${playback.path.has(index) ? ', path' : playback.visited.has(index) ? ', visited' : ''}`}
            disabled={playback.locked}
            ref={(element) => { cells.current[index] = element }}
            tabIndex={index === focused ? 0 : -1}
            onFocus={() => setFocused(index)}
            onKeyDown={(event) => navigate(event, index)}
            onPointerDown={(event) => begin(event, index)}
            onPointerEnter={(event) => enter(event, index)}
            onClick={(event) => {
              if (event.detail > 0 && suppressClick.current) { suppressClick.current = false; return }
              onCellClick(index)
            }}
            key={index}
          ><span aria-hidden="true">{index === board.startIndex ? 'S' : index === board.targetIndex ? 'T' : board.weights.has(index) ? '5' : ''}</span></button>
        ))}
      </div>
    </div>
  )
}
