const STATISTICS = [
  ['Visited', '0'],
  ['Path length', '0'],
  ['Cost', '0'],
  ['Elapsed', '0 ms'],
]

export default function StatsPanel() {
  return (
    <aside className="stats-panel" aria-labelledby="statistics-title">
      <h2 id="statistics-title">Statistics</h2>
      <dl>
        {STATISTICS.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
