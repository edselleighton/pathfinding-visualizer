import Grid from './Grid'

export default function Workspace({ board, onCellClick, playback, selectedTool, onPaint }) {
  return (
    <section
      className="visualizer workspace-placeholder"
      aria-label="Visualizer workspace"
    >
      <Grid board={board} onCellClick={onCellClick} playback={playback} selectedTool={selectedTool} onPaint={onPaint} />
    </section>
  )
}
