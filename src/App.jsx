import { useState } from 'react'
import Header from './components/Header'
import Toolbar from './components/Toolbar'
import Workspace from './components/Workspace'
import StatsPanel from './components/StatsPanel'
import Legend from './components/Legend'
import { applyTool, createInitialBoard } from './grid'

export default function App() {
  const [selectedTool, setSelectedTool] = useState('wall')
  const [board, setBoard] = useState(createInitialBoard)

  function handleCellClick(index) {
    setBoard((currentBoard) => applyTool(currentBoard, index, selectedTool))
  }

  return (
    <main className="app-shell">
      <Header />
      <Toolbar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
      />
      <div className="workspace">
        <Workspace board={board} onCellClick={handleCellClick} />
        <StatsPanel />
      </div>
      <Legend />
    </main>
  )
}
