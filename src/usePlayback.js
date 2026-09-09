import { useEffect, useMemo, useReducer } from 'react'

export const SPEEDS = { slow: 80, normal: 25, fast: 5 }
const initial = { result: null, elapsed: null, cursor: 0, mode: 'ready' }
const countEvents = (result) => result.visitedOrder.length + result.path.length

function reducer(state, action) {
  switch (action.type) {
    case 'start': return { result: action.result, elapsed: action.elapsed,
      cursor: action.instant ? countEvents(action.result) : 0,
      mode: action.instant ? 'done' : 'playing' }
    case 'advance': {
      if (state.mode !== 'playing' && !(action.step && state.mode === 'paused')) return state
      const cursor = Math.min(state.cursor + action.count, countEvents(state.result))
      return { ...state, cursor, mode: cursor === countEvents(state.result) ? 'done' : state.mode }
    }
    case 'pause': return state.mode === 'playing' ? { ...state, mode: 'paused' } : state
    case 'resume': return state.mode === 'paused' ? { ...state, mode: 'playing' } : state
    case 'stop': return ['playing', 'paused'].includes(state.mode) ? { ...state, mode: 'stopped' } : state
    case 'clear': return initial
    default: return state
  }
}

export default function usePlayback(speed) {
  const [state, dispatch] = useReducer(reducer, initial)
  useEffect(() => {
    if (state.mode !== 'playing') return
    let active = true
    let frame
    let last = performance.now()
    let remainder = 0
    function tick(now) {
      if (!active) return
      remainder += now - last
      last = now
      const count = Math.floor(remainder / SPEEDS[speed])
      if (count > 0) {
        remainder -= count * SPEEDS[speed]
        dispatch({ type: 'advance', count })
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => { active = false; cancelAnimationFrame(frame) }
  }, [state.mode, state.result, speed])

  const visited = useMemo(() => new Set(state.result?.visitedOrder.slice(0, state.cursor) ?? []), [state.result, state.cursor])
  const path = useMemo(() => {
    if (!state.result) return new Set()
    return new Set(state.result.path.slice(0, Math.max(0, state.cursor - state.result.visitedOrder.length)))
  }, [state.result, state.cursor])
  const locked = state.mode === 'playing' || state.mode === 'paused'
  let status = { ready: 'Ready', paused: 'Paused', stopped: 'Stopped' }[state.mode]
  if (state.mode === 'playing') status = state.cursor < state.result.visitedOrder.length ? 'Searching' : 'Drawing path'
  if (state.mode === 'done') status = state.result.found ? 'Complete' : 'No path found'
  return { ...state, visited, path, locked, status, dispatch }
}
