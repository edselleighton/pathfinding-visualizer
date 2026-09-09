import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import usePlayback from './usePlayback'

let now
let frames
let nextId
function frame(ms) {
  act(() => {
    now += ms
    const callbacks = [...frames.values()]
    frames.clear()
    callbacks.forEach((callback) => callback(now))
  })
}
const search = { visitedOrder: [0, 1, 25, 2], path: [0, 1, 2], found: true, cost: 2 }
beforeEach(() => {
  now = 0; frames = new Map(); nextId = 0
  vi.spyOn(performance, 'now').mockImplementation(() => now)
  vi.stubGlobal('requestAnimationFrame', (callback) => { frames.set(++nextId, callback); return nextId })
  vi.stubGlobal('cancelAnimationFrame', (id) => frames.delete(id))
})
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })
function setup() {
  const hook = renderHook(({ speed }) => usePlayback(speed), { initialProps: { speed: 'normal' } })
  const send = (action) => act(() => hook.result.current.dispatch(action))
  send({ type: 'start', result: search, elapsed: 0.25, instant: false })
  return { ...hook, send }
}

describe('playback', () => {
  it('animates visits before path and completes with no pending frames', () => {
    const { result } = setup()
    expect(result.current.status).toBe('Searching')
    frame(100)
    expect(result.current.visited.size).toBe(4)
    expect(result.current.path.size).toBe(0)
    expect(result.current.status).toBe('Drawing path')
    frame(75)
    expect(result.current.path.size).toBe(3)
    expect(result.current.status).toBe('Complete')
    expect(result.current.elapsed).toBe(0.25)
    expect(frames.size).toBe(0)
  })
  it('pauses, steps exactly one event, resumes and changes speed', () => {
    const { result, send, rerender } = setup()
    frame(25)
    send({ type: 'pause' })
    frame(1000)
    expect(result.current.cursor).toBe(1)
    send({ type: 'advance', count: 1, step: true })
    expect(result.current.cursor).toBe(2)
    expect(result.current.status).toBe('Paused')
    send({ type: 'resume' })
    rerender({ speed: 'slow' })
    frame(79)
    expect(result.current.cursor).toBe(2)
    frame(1)
    expect(result.current.cursor).toBe(3)
    rerender({ speed: 'fast' })
    frame(20)
    expect(result.current.status).toBe('Complete')
  })
  it('stops with partial results and rejects stale callbacks on a new run', () => {
    const { result, send } = setup()
    frame(25)
    const stale = [...frames.values()][0]
    send({ type: 'stop' })
    expect(result.current.status).toBe('Stopped')
    expect(result.current.cursor).toBe(1)
    expect(result.current.locked).toBe(false)
    send({ type: 'start', result: { ...search }, elapsed: 1, instant: false })
    act(() => stale(1000))
    expect(result.current.cursor).toBe(0)
    frame(25)
    expect(result.current.cursor).toBe(1)
  })
  it('clear removes results and cancels callbacks; unmount cancels frames', () => {
    const { result, send, unmount } = setup()
    const stale = [...frames.values()][0]
    send({ type: 'clear' })
    act(() => stale(1000))
    expect(result.current.status).toBe('Ready')
    expect(result.current.result).toBeNull()
    expect(frames.size).toBe(0)
    send({ type: 'start', result: search, elapsed: 0, instant: false })
    unmount()
    expect(frames.size).toBe(0)
  })
  it('finishes unreachable searches and supports instant rendering', () => {
    const { result, send } = setup()
    send({ type: 'start', result: { visitedOrder: [0], path: [], found: false, cost: null }, elapsed: 0, instant: false })
    frame(25)
    expect(result.current.status).toBe('No path found')
    send({ type: 'start', result: search, elapsed: 0, instant: true })
    expect(result.current.status).toBe('Complete')
    expect(result.current.path.size).toBe(3)
    expect(frames.size).toBe(0)
  })
})
