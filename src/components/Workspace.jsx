import Grid from './Grid'

export default function Workspace({ board, onCellClick }) {
  return (
    <section
      className="visualizer workspace-placeholder"
      aria-label="Visualizer workspace"
    >
      <Grid board={board} onCellClick={onCellClick} />
    </section>
  )
}
