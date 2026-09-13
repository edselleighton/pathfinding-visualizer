import { ALGORITHMS } from '../search'

export default function Toolbar({ selectedTool, onToolChange, algorithm, onAlgorithmChange, speed, onSpeedChange, playback, onRun, onClear, onReset, maze, onMazeChange, onGenerate }) {
  const { locked, mode, status, dispatch } = playback
  return (
    <section className="toolbar" aria-label="Visualizer controls">
      <label className="toolbar-field">
        <span>Algorithm</span>
        <select value={algorithm} onChange={(event) => onAlgorithmChange(event.target.value)} disabled={locked} aria-label="Select algorithm" aria-describedby="algorithm-help">
          {Object.entries(ALGORITHMS).map(([value, info]) => <option key={value} value={value}>{info.name}</option>)}
        </select>
      </label>

      <label className="toolbar-field">
        <span>Speed</span>
        <select value={speed} onChange={(event) => onSpeedChange(event.target.value)} aria-label="Select animation speed">
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </select>
      </label>

      <label className="toolbar-field">
        <span>Tool</span>
        <select
          value={selectedTool}
          disabled={locked}
          onChange={(event) => onToolChange(event.target.value)}
          aria-label="Select drawing tool"
        >
          <option value="start">Start</option>
          <option value="target">Target</option>
          <option value="wall">Wall</option>
          <option value="weight">Weight</option>
          <option value="erase">Erase</option>
        </select>
      </label>

      <label className="toolbar-field">
        <span>Maze</span>
        <select value={maze} onChange={(event) => onMazeChange(event.target.value)} disabled={locked} aria-label="Select maze pattern">
          <option value="none">None</option>
          <option value="random">Random walls</option>
          <option value="recursive-division">Recursive division</option>
        </select>
      </label>

      <div className="toolbar-status" aria-label="Visualizer status">
        <span className="toolbar-status-label">Status</span>
        <strong role="status" aria-live="polite">{status}</strong>
      </div>

      <p id="algorithm-help" className="algorithm-help">{ALGORITHMS[algorithm].description} Entering a normal cell costs 1; a weighted cell costs 5. Reported cost includes weights.</p>
      <div className="toolbar-actions" aria-label="Grid actions">
        <button type="button" onClick={onGenerate} disabled={locked || maze === 'none'}>Generate</button>
        <button type="button" className="primary-button" disabled={locked} onClick={onRun}>
          Run
        </button>
        <button type="button" disabled={!locked} onClick={() => dispatch({ type: mode === 'paused' ? 'resume' : 'pause' })}>{mode === 'paused' ? 'Resume' : 'Pause'}</button>
        <button type="button" disabled={mode !== 'paused'} onClick={() => dispatch({ type: 'advance', count: 1, step: true })}>Step</button>
        <button type="button" disabled={!locked} onClick={() => dispatch({ type: 'stop' })}>Stop</button>
        <button type="button" onClick={onClear}>Clear search</button>
        <button type="button" onClick={onReset}>Reset board</button>
      </div>
    </section>
  )
}
