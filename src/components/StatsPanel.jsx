export default function StatsPanel({ playback }) {
  const { result, mode, visited, elapsed } = playback
  const found = mode === 'done' && result?.found
  const statistics = [
    ['Visited', visited.size],
    ['Path length', found ? result.path.length - 1 : '—'],
    ['Cost', found ? result.cost : '—'],
    ['Computation', elapsed === null ? '—' : `${elapsed.toFixed(2)} ms`],
  ]
  return (
    <aside className="stats-panel" aria-labelledby="statistics-title">
      <h2 id="statistics-title">Statistics</h2>
      <dl>
        {statistics.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="stats-help">Path length counts moves. Computation time excludes animation.</p>
    </aside>
  )
}
