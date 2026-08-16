export default function Toolbar() {
  return (
    <section className="toolbar" aria-label="Visualizer controls">
      <label className="toolbar-field">
        <span>Algorithm</span>
        <select defaultValue="bfs" aria-label="Select algorithm">
          <option value="bfs">Breadth-first search</option>
          <option value="dfs">Depth-first search</option>
          <option value="dijkstra">Dijkstra</option>
          <option value="astar">A* search</option>
          <option value="greedy">Greedy best-first search</option>
        </select>
      </label>

      <label className="toolbar-field">
        <span>Speed</span>
        <select defaultValue="normal" aria-label="Select animation speed">
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </select>
      </label>

      <label className="toolbar-field">
        <span>Tool</span>
        <select defaultValue="wall" aria-label="Select drawing tool">
          <option value="wall">Wall</option>
          <option value="weight">Weight</option>
          <option value="erase">Erase</option>
        </select>
      </label>

      <div className="toolbar-status" aria-label="Visualizer status">
        <span className="toolbar-status-label">Status</span>
        <strong>Ready</strong>
      </div>

      <div className="toolbar-actions" aria-label="Grid actions">
        <button type="button" className="primary-button" disabled>
          Run
        </button>
        <button type="button" disabled>
          Clear
        </button>
      </div>
    </section>
  )
}
