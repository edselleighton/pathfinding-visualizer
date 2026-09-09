import { useState } from 'react'
import Header from './components/Header'
import Toolbar from './components/Toolbar'
import Workspace from './components/Workspace'
import StatsPanel from './components/StatsPanel'
import Legend from './components/Legend'
import { applyTool, createInitialBoard } from './grid'
import { runSearch } from './search'
import usePlayback from './usePlayback'

export default function App() {
  const [selectedTool, setSelectedTool] = useState('wall')
  const [board, setBoard] = useState(createInitialBoard)
  const [algorithm, setAlgorithm] = useState('bfs')
  const [speed, setSpeed] = useState('normal')
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

  return (
    <main className="app-shell">
      <Header />
      <Toolbar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        algorithm={algorithm} onAlgorithmChange={(value) => { clear(); setAlgorithm(value) }}
        speed={speed} onSpeedChange={setSpeed} playback={playback}
        onRun={run} onClear={clear}
        onReset={() => { clear(); setBoard(createInitialBoard()) }}
      />
      <div className="workspace">
        <Workspace board={board} onCellClick={handleCellClick} playback={playback} />
        <StatsPanel playback={playback} />
      </div>
      <Legend />
    </main>
  )
}
