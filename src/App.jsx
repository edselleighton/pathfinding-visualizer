import { useState } from 'react'
import Header from './components/Header'
import Toolbar from './components/Toolbar'
import Workspace from './components/Workspace'
import StatsPanel from './components/StatsPanel'
import Legend from './components/Legend'
import { applyTool, createInitialBoard, paintCell } from './grid'
import { runSearch } from './search'
import { generateMaze } from './maze'
import usePlayback from './usePlayback'

export default function App() {
  const [selectedTool, setSelectedTool] = useState('wall')
  const [board, setBoard] = useState(createInitialBoard)
  const [algorithm, setAlgorithm] = useState('bfs')
  const [speed, setSpeed] = useState('normal')
  const [maze, setMaze] = useState('none')
  const playback = usePlayback(speed)
  const clear = () => playback.dispatch({ type: 'clear' })

  function handleCellClick(index) {
    if (playback.locked) return
    const next = applyTool(board, index, selectedTool)
    if (next !== board) { clear(); setBoard(next) }
  }

  function run() {
    if (playback.locked) return
    const snapshot = { ...board, walls: new Set(board.walls), weights: new Set(board.weights) }
    const start = performance.now()
    const result = runSearch(snapshot, algorithm)
    const elapsed = performance.now() - start
    const instant = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    playback.dispatch({ type: 'start', result, elapsed, instant })
  }

  function handlePaint(index, tool, remove) {
    if (playback.locked) return
    clear()
    setBoard((current) => paintCell(current, index, tool, remove))
  }

  function generate() {
    if (playback.locked || maze === 'none') return
    clear()
    setBoard((current) => generateMaze(current, maze))
  }

  return (
    <main className="app-shell">
      <Header />
      <Toolbar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        algorithm={algorithm} onAlgorithmChange={(value) => { clear(); setAlgorithm(value) }}
        speed={speed} onSpeedChange={setSpeed} playback={playback}
        maze={maze} onMazeChange={setMaze} onGenerate={generate}
        onRun={run} onClear={clear}
        onReset={() => { clear(); setBoard(createInitialBoard()) }}
      />
      <div className="workspace">
        <Workspace board={board} onCellClick={handleCellClick} playback={playback} selectedTool={selectedTool} onPaint={handlePaint} />
        <StatsPanel playback={playback} />
      </div>
      <Legend />
      <details className="usage-guide">
        <summary>How to use the visualizer</summary>
        <p>Choose a tool, then click or tap a cell. Drag with a mouse or pen to paint walls, weights, or erase. Starting a stroke on an existing wall or weight removes terrain along that stroke. Start and Target are placed with a single click or tap.</p>
        <p>Tab into the grid, use arrow keys to move, and press Enter or Space to apply the tool. Start, Target, and weighted cells are marked S, T, and 5.</p>
        <p>Choose an algorithm and press Run. Pause to inspect the search, Step one cell at a time, or Stop to keep partial results. Change speed at any time. Reduced-motion preferences show the result immediately.</p>
        <p>Clear search keeps your board; Reset board restores the initial empty board. Choosing a maze does not change the board until you press Generate. Generation replaces terrain and may produce a board with no route.</p>
        <p>Compare algorithms by rerunning them on the same board. Dijkstra and A* minimize cost; BFS minimizes moves. DFS and greedy do not guarantee a shortest route.</p>
      </details>
    </main>
  )
}
