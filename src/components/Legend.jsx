const legendItems = [
  ['start', 'Start'],
  ['target', 'Target'],
  ['wall', 'Wall'],
  ['weight', 'Weight'],
  ['visited', 'Visited'],
  ['path', 'Path'],
]

export default function Legend() {
  return (
    <section className="legend" aria-label="Grid legend">
      {legendItems.map(([type, label]) => (
        <div className="legend-item" key={type}>
          <span
            className={`legend-swatch legend-${type}`}
            aria-hidden="true"
          />
          <span>{label}</span>
        </div>
      ))}
    </section>
  )
}
