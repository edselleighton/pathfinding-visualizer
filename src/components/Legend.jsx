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
            className={`legend-swatch cell-${type}`}
            aria-hidden="true"
          >{type === 'start' ? 'S' : type === 'target' ? 'T' : type === 'weight' ? '5' : ''}</span>
          <span>{label}</span>
        </div>
      ))}
    </section>
  )
}
